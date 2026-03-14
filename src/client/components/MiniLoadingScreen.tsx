import React, { useEffect, useRef } from "react";
 
export default function MiniLoadingScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
 
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
 
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    const fontSize = 10;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => 1);
 
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
 
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);
 
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 2000,
    }}>
      <div style={{ position: 'relative', width: '300px', height: '150px' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', border: '2px solid #0f0',
          backgroundColor: 'rgba(0,0,0,0.8)',
        }}>
          <h2 style={{ color: '#0f0', fontFamily: 'VT323', fontSize: '28px', margin: 0 }}>Loading</h2>
          <p style={{ color: '#0f0', fontFamily: 'monospace', fontSize: '12px', margin: '8px 0 0' }}>Please wait...</p>
        </div>
      </div>
    </div>
  );
}