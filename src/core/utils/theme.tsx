import { useEffect, useRef, useState } from "react";

// Device Pixel Ratio hook
function useDevicePixelRatio() {
  const [dpr, setDpr] = useState(() => (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1));
  useEffect(() => {
    const handler = () => setDpr(window.devicePixelRatio || 1);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return dpr;
}

// FireCanvas — Phoenix/Fire Background + Phoenix Silhouette Detail
export default function FireCanvas({ night = true, sparks = true, tempo = 0.7 }) {
  const canvasRef = useRef(null);
  const dpr = useDevicePixelRatio();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let last = performance.now();
    let lastFrame = 0; // for FPS cap
    let t = 0;
    let particles = [];

    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const seedParticles = (W, H) => {
      const isSmall = W < 640 || H < 480;
      const base = prefersReduced ? 60 : 100;
      const count = isSmall ? Math.floor(base * 0.7) : base;
      particles = Array.from({ length: count }).map(() => ({
        x: Math.random(), y: 1 + Math.random()*0.2, r: Math.random()*2+1, v: Math.random()*0.5+0.5, life: Math.random()
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedParticles(width, height);
    };
    resize();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) {
        last = performance.now();
        lastFrame = 0;
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const draw = (now) => {
      if (!running) return;

      const minFrameDelta = 1000 / 45;
      if (now - lastFrame < minFrameDelta) {
        raf = requestAnimationFrame(draw); return;
      }
      lastFrame = now;

      let dt = (now - last) / 1000; 
      if (dt > 0.1) dt = 0.1;
      last = now; 
      const speed = (prefersReduced ? tempo * 0.5 : tempo);
      t += dt * speed;

      const W = canvas.width / dpr, H = canvas.height / dpr;

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      if (night) { bg.addColorStop(0, "#0a0a0a"); bg.addColorStop(1, "#1a0b0b"); }
      else { bg.addColorStop(0, "#ffedd5"); bg.addColorStop(1, "#fecaca"); }
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      const flameColors = ["rgba(255,200,80,0.5)", "rgba(255,120,50,0.4)", "rgba(255,50,30,0.3)"];
      const step = 8;
      for (let i = 0; i < flameColors.length; i++) {
        const col = flameColors[i];
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += step) {
          const y = H - 100 - Math.sin((x/200) + t * (0.6 + i * 0.3)) * 60 - Math.cos((x/100) + t * 0.8) * 30;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H); ctx.closePath();
        ctx.fillStyle = col; ctx.fill();
      }

      ctx.save();
      ctx.translate(W/2, H*0.65);
      ctx.scale(1.1, 1.1);
      ctx.beginPath();
      ctx.moveTo(0, -60);
      ctx.quadraticCurveTo(20, -30, 0, 40);
      ctx.quadraticCurveTo(-20, -30, 0, -60);
      ctx.closePath();
      ctx.fillStyle = night ? "rgba(255,140,0,0.22)" : "rgba(220,50,47,0.22)";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -50);
      ctx.quadraticCurveTo(120, -100, 140, 0);
      ctx.quadraticCurveTo(60, 20, 0, 40);
      ctx.moveTo(0, -50);
      ctx.quadraticCurveTo(-120, -100, -140, 0);
      ctx.quadraticCurveTo(-60, 20, 0, 40);
      ctx.fillStyle = night ? "rgba(255,120,0,0.2)" : "rgba(200,60,47,0.2)";
      ctx.fill();
      ctx.beginPath(); ctx.arc(0, -65, 10, 0, Math.PI*2); ctx.fillStyle = night ? "rgba(255,180,80,0.3)" : "rgba(220,80,47,0.3)"; ctx.fill();
      ctx.restore();

      if (sparks) {
        const jitter = prefersReduced ? 0.001 : 0.002;
        for (let p of particles) {
          p.y -= dt * p.v * 0.28; p.x += (Math.random()-0.5)*jitter; p.life -= dt*0.05;
          if (p.y < 0 || p.life <= 0) { p.x = Math.random(); p.y = 1 + Math.random()*0.2; p.life = 1; }
          ctx.fillStyle = `rgba(255,${Math.floor(140 + Math.random()*115)},0,${p.life})`;
          ctx.beginPath(); ctx.arc(p.x*W, p.y*H, p.r, 0, Math.PI*2); ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { running = false; cancelAnimationFrame(raf); if (ro) ro.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, [night, dpr, sparks, tempo]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}