"use client";

import { useEffect, useRef } from "react";

const skills = [
  { name: "React", lat: 30, lng: 45 },
  { name: "TypeScript", lat: -20, lng: 120 },
  { name: "Python", lat: 50, lng: 200 },
  { name: "Next.js", lat: -40, lng: 300 },
  { name: "Node.js", lat: 60, lng: 160 },
  { name: "Tailwind", lat: -10, lng: 70 },
  { name: "FastAPI", lat: 20, lng: 250 },
  { name: "PostgreSQL", lat: -50, lng: 20 },
  { name: "AI/ML", lat: 40, lng: 330 },
];

function latLngToXYZ(
  lat: number,
  lng: number,
  r: number
): [number, number, number] {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  return [
    r * Math.cos(latRad) * Math.cos(lngRad),
    r * Math.sin(latRad),
    r * Math.cos(latRad) * Math.sin(lngRad),
  ];
}

export function WireframeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.38;

      ctx.clearRect(0, 0, w, h);

      const rot = rotationRef.current;
      const cosRot = Math.cos(rot);
      const sinRot = Math.sin(rot);

      // Draw wireframe circles (latitude lines)
      ctx.strokeStyle = "rgba(245, 240, 232, 0.06)";
      ctx.lineWidth = 0.5;

      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        const latRad = (lat * Math.PI) / 180;
        const ringR = r * Math.cos(latRad);
        const ringY = cy - r * Math.sin(latRad);

        for (let i = 0; i <= 64; i++) {
          const angle = (i / 64) * Math.PI * 2 + rot;
          const x = cx + ringR * Math.cos(angle);
          const z = ringR * Math.sin(angle);
          const opacity = (z / ringR + 1) / 2;
          if (i === 0) {
            ctx.moveTo(x, ringY);
          } else {
            if (opacity > 0.3) ctx.lineTo(x, ringY);
            else ctx.moveTo(x, ringY);
          }
        }
        ctx.stroke();
      }

      // Draw longitude lines
      for (let lng = 0; lng < 360; lng += 30) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(245, 240, 232, 0.06)";
        for (let i = 0; i <= 64; i++) {
          const lat = (i / 64) * 180 - 90;
          const [x3d, y3d, z3d] = latLngToXYZ(lat, lng, r);
          const x = cx + x3d * cosRot - z3d * sinRot;
          const z = x3d * sinRot + z3d * cosRot;
          const y = cy - y3d;
          const opacity = (z / r + 1) / 2;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            if (opacity > 0.3) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw skill nodes
      skills.forEach((skill) => {
        const [x3d, y3d, z3d] = latLngToXYZ(skill.lat, skill.lng, r);
        const x = cx + x3d * cosRot - z3d * sinRot;
        const z = x3d * sinRot + z3d * cosRot;
        const y = cy - y3d;
        const depth = (z / r + 1) / 2;

        if (depth > 0.3) {
          const nodeR = 2 + depth * 2;
          const pulse = 0.6 + 0.4 * Math.sin(Date.now() / 1000 + skill.lat);
          ctx.beginPath();
          ctx.arc(x, y, nodeR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 240, 232, ${depth * 0.6 * pulse})`;
          ctx.fill();

          // Glow
          ctx.beginPath();
          ctx.arc(x, y, nodeR + 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 240, 232, ${depth * 0.08 * pulse})`;
          ctx.fill();
        }
      });

      rotationRef.current += 0.003;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{ display: "block" }}
    />
  );
}
