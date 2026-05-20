"use client";

import { useEffect, useRef } from "react";

const CONFIG = {
  count:     90,
  size:      2.6,
  speed:     0.3,
  wobble:    0.4,
  intensity: 0.75,
  shaftw:    300,
  angle:     -13,
  shaftx:    62,   // % from left
  baseop:    0.14,
};

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  phase: number; phaseSpeed: number;
  life: number; lifeSpd: number;
  opMult: number;
}

function mkParticle(
  W: number, H: number,
  live = false, fromEdge = false
): Particle {
  let x: number, y: number;

  if (live || !fromEdge) {
    x = rand(0, W);
    y = rand(0, H);
  } else {
    // Drifted off the top — re-enter from bottom
    x = rand(0, W);
    y = H + rand(2, 12);
  }

  return {
    x, y,
    vx:        rand(-0.18, 0.18),
    vy:        rand(-0.30, -0.06),
    size:      rand(0.5, CONFIG.size),
    phase:     rand(0, Math.PI * 2),
    phaseSpeed:rand(0.006, 0.018),
    life:      (live || !fromEdge) ? rand(0, 1) : rand(0, 0.08),
    lifeSpd:   rand(0.0008, 0.0022),
    opMult:    rand(0.4, 1.0),
  };
}

function lifeOp(t: number) {
  if (t < 0.15) return t / 0.15;
  if (t > 0.82) return (1 - t) / 0.18;
  return 1;
}

export function DustParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    let particles: Particle[] = [];
    let raf = 0;

    function resize() {
      const parent = canvas!.parentElement!;
      W = canvas!.width  = parent.clientWidth;
      H = canvas!.height = parent.clientHeight;
    }

    function spawn() {
      particles = Array.from({ length: CONFIG.count }, () =>
        mkParticle(W, H, true, false)
      );
    }

    function shaftBrightness(x: number, y: number) {
      const ar = CONFIG.angle * Math.PI / 180;
      const cx = W * CONFIG.shaftx / 100;
      const cy = H * 0.38;
      const px =  Math.cos(ar);
      const py = -Math.sin(ar);
      const d  = (x - cx) * px + (y - cy) * py;
      return Math.exp(-(d * d) / (2 * CONFIG.shaftw * CONFIG.shaftw));
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      const spd = CONFIG.speed;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.phase += p.phaseSpeed;
        p.x     += (p.vx + Math.sin(p.phase) * 0.14 * CONFIG.wobble) * spd;
        p.y     += p.vy * spd;
        p.life  += p.lifeSpd;

        if (p.life >= 1) {
          particles[i] = mkParticle(W, H, false, false); continue;
        }
        if (p.y < -15) {
          particles[i] = mkParticle(W, H, false, true); continue;
        }
        if (p.x < -15)   p.x = W + 10;
        if (p.x > W + 15) p.x = -10;

        const sf    = shaftBrightness(p.x, p.y);
        const boost = 1 + sf * CONFIG.intensity * 3.5;
        const op    = Math.min(1, CONFIG.baseop * p.opMult * boost * lifeOp(p.life));

        ctx!.save();
        ctx!.globalAlpha = op;
        const warm = 0.4 + sf * 0.6;
        ctx!.fillStyle = `rgb(${Math.round(232 + warm * 13)},${Math.round(225 + warm * 8)},${Math.round(215 + warm * 6)})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      while (particles.length < CONFIG.count)
        particles.push(mkParticle(W, H, true, false));

      raf = requestAnimationFrame(draw);
    }

    const observer = new ResizeObserver(() => {
      resize();
    });
    observer.observe(canvas.parentElement!);

    resize();
    spawn();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
