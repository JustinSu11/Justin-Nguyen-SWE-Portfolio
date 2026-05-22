"use client";

import { useEffect, useRef } from "react";

const CONFIG = {
  count:     320,
  size:      3.2,
  speed:     0.22,
  wobble:    0.35,
  intensity: 1.0,
  shaftw:    165,   // spotlight column half-width (px)
  angle:     0,     // straight down from top-centre
  shaftx:    50,    // horizontal centre
  baseop:    0.10,  // low baseline → nearly invisible in shadow, revealed by the beam
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

      // ── ceiling spotlight — blurred cone + wide atmospheric bloom ────
      const cx = W * CONFIG.shaftx / 100;
      const srcY = -H * 0.18;   // apex above canvas — origin never visible

      // Blurred triangle → soft spotlight cone with feathered edges
      ctx!.save();
      ctx!.filter = "blur(36px)";
      ctx!.beginPath();
      ctx!.moveTo(cx, srcY);
      ctx!.lineTo(cx + H * 0.46, H + 10);
      ctx!.lineTo(cx - H * 0.46, H + 10);
      ctx!.closePath();
      const cg = ctx!.createLinearGradient(cx, srcY, cx, H);
      cg.addColorStop(0,    "rgba(255,248,210,0)");
      cg.addColorStop(0.10, "rgba(255,246,208,0.24)");
      cg.addColorStop(0.32, "rgba(255,240,186,0.14)");
      cg.addColorStop(0.68, "rgba(255,228,160,0.05)");
      cg.addColorStop(1,    "rgba(255,215,130,0)");
      ctx!.fillStyle = cg;
      ctx!.fill();
      ctx!.restore();

      // Wide atmospheric bloom — large radial halo around the beam
      const bg = ctx!.createRadialGradient(cx, srcY, H * 0.05, cx, srcY, H * 1.58);
      bg.addColorStop(0,    "rgba(255,250,220,0)");
      bg.addColorStop(0.07, "rgba(255,246,208,0.16)");
      bg.addColorStop(0.28, "rgba(255,236,178,0.06)");
      bg.addColorStop(1,    "rgba(255,212,125,0)");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, W, H);

      // Dark vignette — deepens the shadow outside the cone
      const dv = ctx!.createRadialGradient(cx, H * 0.32, H * 0.10, cx, H * 0.32, H * 0.92);
      dv.addColorStop(0,    "rgba(0,0,0,0)");
      dv.addColorStop(0.32, "rgba(0,0,0,0.30)");
      dv.addColorStop(0.65, "rgba(0,0,0,0.62)");
      dv.addColorStop(1,    "rgba(0,0,0,0.88)");
      ctx!.fillStyle = dv;
      ctx!.fillRect(0, 0, W, H);

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
        // Outside beam (sf≈0): particles at baseop → visible dark haze
        // Inside beam  (sf≈1): boost makes them glow bright
        const boost = 1 + sf * CONFIG.intensity * 5.5;
        const op    = Math.min(0.82, CONFIG.baseop * p.opMult * boost * lifeOp(p.life));

        ctx!.save();
        ctx!.globalAlpha = op;
        // Cool grey-white in shadow → warm bright in the beam
        const warm = 0.15 + sf * 0.85;
        ctx!.fillStyle = `rgb(${Math.round(210 + warm * 35)},${Math.round(207 + warm * 25)},${Math.round(204 + warm * 15)})`;
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
