'use client';

import React, { useRef, useEffect, useState } from "react";

/**
 * FireCanvas - Animasi api unggun malam dengan bintang, bintang jatuh, dan efek glow
 * Bisa digunakan di mana saja dengan props sederhana
 */
interface FireCanvasProps {
  night?: boolean;        // true = malam (api + bintang), false = siang (matahari + awan)
  quality?: "auto" | "low" | "high";
  tempo?: number;         // 0.3 - 2.0, kecepatan animasi
  className?: string;
}

export default function FireCanvas({
  night = true,
  quality = "auto",
  tempo = 0.7,
  className = "absolute inset-0 w-full h-full"
}: FireCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dpr, setDpr] = useState(1);

  // Deteksi device pixel ratio
  useEffect(() => {
    const updateDpr = () => setDpr(window.devicePixelRatio || 1);
    updateDpr();
    window.addEventListener("resize", updateDpr);
    return () => window.removeEventListener("resize", updateDpr);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Deteksi performa
    const cores = (navigator as any)?.hardwareConcurrency || 4;
    const mem = (navigator as any)?.deviceMemory || 4;
    const q = quality === "auto"
      ? (cores <= 4 || mem <= 4 || dpr > 1.5 ? "low" : "high")
      : quality;
    const SCALE = q === "low" ? 0.5 : 1.0;
    const TIME_SCALE = Math.max(0.3, Math.min(2, tempo));

    let raf = 0;
    let running = true;
    let t = 0;
    let last = performance.now();

    // Resize handler
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // === BINTANG ===
    const starCount = Math.floor(900 * SCALE);
    const starColors = ["255,255,255", "200,220,255", "255,232,200", "180,210,255"];
    const stars = Array.from({ length: starCount }).map(() => ({
      x: Math.random(),
      y: Math.random() * 0.9,
      r: Math.random() * 1.1 + 0.3,
      tw: Math.random() * Math.PI * 2,
      c: starColors[Math.floor(Math.random() * starColors.length)],
    }));

    // === BINTANG JATUH ===
    const shooting: any[] = [];
    const spawnShoot = () => {
      if (!night || Math.random() > 0.002) return;
      shooting.push({
        x: Math.random() * canvas.width / dpr,
        y: Math.random() * canvas.height / dpr * 0.4,
        len: 160 + Math.random() * 260,
        speed: 180 + Math.random() * 300,
        ang: Math.PI * (0.15 + Math.random() * 0.2),
        life: 1,
      });
    };

    // === API UNGGUN ===
    const emberCount = Math.floor(120 * SCALE);
    const embers = Array.from({ length: emberCount }).map(() => ({
      x: 0.5 + (Math.random() - 0.5) * 0.12,
      y: 0.92 + Math.random() * 0.04,
      vy: -(0.2 + Math.random() * 0.6),
      vx: (Math.random() - 0.5) * 0.1,
      life: Math.random() * 1,
      size: Math.random() * 2.2 + 0.6,
    }));

    const flameLayers = [
      { hue: 40, alpha: 0.78, amp: 90 * SCALE, wav: 240, blur: 22 * SCALE },
      { hue: 18, alpha: 0.50, amp: 130 * SCALE, wav: 320, blur: 28 * SCALE },
      { hue: 6, alpha: 0.35, amp: 160 * SCALE, wav: 420, blur: 36 * SCALE },
    ];

    // === LOOP ANIMASI ===
    const draw = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.1);
      if (dt < 1 / 120) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = now;
      t += dt;
      const tt = t * TIME_SCALE;

      const { width, height } = canvas;
      const W = width / dpr;
      const H = height / dpr;

      // Langit
      ctx.globalCompositeOperation = "source-over";
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      if (night) {
        sky.addColorStop(0, "#020714");
        sky.addColorStop(0.6, "#070b18");
        sky.addColorStop(1, "#090909");
      } else {
        sky.addColorStop(0, "#89c2ff");
        sky.addColorStop(0.6, "#bfe1ff");
        sky.addColorStop(1, "#ffe9c7");
      }
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Bintang
      ctx.globalCompositeOperation = "lighter";
      for (const s of stars) {
        const alpha = (night ? 0.9 : 0.06) * (Math.sin(tt * 2 + s.tw) * 0.5 + 0.5);
        if (alpha < 0.012) continue;
        ctx.fillStyle = `rgba(${s.c},${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bintang jatuh
      if (night) {
        spawnShoot();
        for (let i = shooting.length - 1; i >= 0; i--) {
          const st = shooting[i];
          st.x += Math.cos(st.ang) * st.speed * dt;
          st.y += Math.sin(st.ang) * st.speed * dt;
          st.life -= dt * 0.35;

          const gx = st.x - Math.cos(st.ang) * st.len;
          const gy = st.y - Math.sin(st.ang) * st.len;
          const grad = ctx.createLinearGradient(st.x, st.y, gx, gy);
          grad.addColorStop(0, "rgba(255,255,255,0.9)");
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(st.x, st.y);
          ctx.lineTo(gx, gy);
          ctx.stroke();

          if (st.life <= 0) shooting.splice(i, 1);
        }
      }

      // Tanah
      ctx.globalCompositeOperation = "source-over";
      const groundH = H * 0.18;
      ctx.fillStyle = night ? "#070809" : "#d9cbb6";
      ctx.fillRect(0, H - groundH, W, groundH);

      const cx = W * 0.5;
      const cy = H - groundH * 0.35;

      // Glow api
      const glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, Math.max(W, H) * 0.45);
      glow.addColorStop(0, night ? "rgba(255,200,80,0.45)" : "rgba(255,210,120,0.35)");
      glow.addColorStop(0.35, night ? "rgba(255,120,30,0.18)" : "rgba(255,140,60,0.14)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Lapisan api
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < flameLayers.length; i++) {
        const f = flameLayers[i];
        const heightMul = 0.6 + i * 0.25;
        const baseW = 110 + i * 40;
        const topW = 18 + i * 10;
        const flameHeight = 180 * heightMul;

        ctx.save();
        ctx.filter = `blur(${f.blur}px)`;
        const grad = ctx.createLinearGradient(cx, cy - flameHeight, cx, cy + 20);
        grad.addColorStop(0, `hsla(${f.hue}, 90%, 60%, ${f.alpha})`);
        grad.addColorStop(0.6, `hsla(${f.hue}, 90%, 55%, ${Math.max(0.25, f.alpha - 0.25)})`);
        grad.addColorStop(1, `hsla(${f.hue}, 90%, 40%, 0)`);
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.moveTo(cx - baseW, cy);
        const steps = Math.max(22, Math.floor(30 * SCALE));
        for (let x = 0; x <= steps; x++) {
          const p = x / steps;
          const px = cx - baseW + p * (baseW * 2);
          const sway = Math.sin(p * Math.PI * 3 + tt * 1.6 + i) * (8 + i * 4);
          const y = cy - (Math.sin(p * Math.PI) * flameHeight + Math.sin((px + tt * 120) / f.wav) * (f.amp * (0.4 + 0.2 * Math.sin(tt * 1.5 + i))));
          ctx.lineTo(px + sway, y);
        }
        ctx.lineTo(cx + baseW, cy + 10);
        ctx.lineTo(cx - baseW, cy + 10);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Inti api
      const core = ctx.createRadialGradient(cx, cy - 30, 4, cx, cy - 20, 60);
      core.addColorStop(0, "rgba(255,255,255,0.9)");
      core.addColorStop(1, "rgba(255,200,120,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy - 28, 70, 0, Math.PI * 2);
      ctx.fill();

      // Bara api
      ctx.globalCompositeOperation = "screen";
      for (const e of embers) {
        e.y += e.vy * dt * (night ? 32 : 22) * (0.6 + Math.sin(tt * 2.2 + e.x * 8) * 0.2);
        e.x += e.vx * dt * 18;
        e.life -= dt * 0.25;

        if (e.life <= 0 || e.y < 0.02) {
          e.x = 0.5 + (Math.random() - 0.5) * 0.10;
          e.y = 0.92 + Math.random() * 0.05;
          e.vy = -(0.2 + Math.random() * 0.7);
          e.vx = (Math.random() - 0.5) * 0.12;
          e.life = 0.6 + Math.random() * 1.0;
          e.size = Math.random() * 2.4 + 0.6;
        }

        const ex = e.x * W + (Math.sin(tt * 1.2 + e.x * 8) * 10);
        const ey = e.y * H;
        const grad = ctx.createRadialGradient(ex, ey, 0.5, ex, ey, e.size * 6);
        grad.addColorStop(0, "rgba(255,220,120,0.85)");
        grad.addColorStop(1, "rgba(255,120,40,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ex, ey, e.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Kayu bakar
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = night ? "#3a2a1e" : "#6a4a2e";
      const logW = 140;
      const logH = 22;
      const tilt = 18;
      ctx.save();
      ctx.translate(cx, cy + 12);
      ctx.rotate((-tilt * Math.PI) / 180);
      ctx.fillRect(-logW, -logH / 2, logW * 2, logH);
      ctx.restore();
      ctx.save();
      ctx.translate(cx, cy + 4);
      ctx.rotate((tilt * Math.PI) / 180);
      ctx.fillRect(-logW, -logH / 2, logW * 2, logH);
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [night, quality, tempo, dpr]);

  return <canvas ref={canvasRef} className={className} />;
}