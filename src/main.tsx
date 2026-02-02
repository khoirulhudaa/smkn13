import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "../node_modules/leaflet/dist/leaflet.css";
import "./core/styles/index.css";
import { motion } from 'framer-motion'

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/features/_root/app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
     <motion.div 
        animate={{ 
          x: [0, 50, 0], 
          y: [0, 30, 0],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="fixed z-[3] -top-20 -left-20 w-[30%] h-[40%] bg-blue-800 rounded-full blur-[160px]" 
      />
      <motion.div 
        animate={{ 
          x: [0, 50, 0], 
          y: [0, 30, 0],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="fixed z-[3] bottom-0 -right-20 w-[30%] h-[40%] bg-blue-800 rounded-full blur-[160px]" 
      />
    <App />
  </StrictMode>,
);
