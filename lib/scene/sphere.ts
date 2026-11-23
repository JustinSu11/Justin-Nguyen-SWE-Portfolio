import type { Ripple, Rot, View } from './types';

export interface Sphere {
  N: number;
  PX: Float32Array;
  PY: Float32Array;
  PZ: Float32Array;
  PS: Float32Array;
  /** 1 / |p|, so the ripple can use unit vectors */
  PL: Float32Array;
  /** per-depth-band scratch buffers of x,y,size triples */
  BUF: Float32Array[];
}

/** ~17k dots on a Fibonacci sphere with a little jitter and a few outliers. */
export function createSphere(mobile: boolean): Sphere {
  const N = mobile ? 9000 : 17000;
  const PX = new Float32Array(N);
  const PY = new Float32Array(N);
  const PZ = new Float32Array(N);
  const PS = new Float32Array(N);
  const PL = new Float32Array(N);
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = Math.max(-1, Math.min(1, 1 - (2 * (i + 0.5)) / N + (Math.random() - 0.5) * (2 / N) * 1.6));
    const r = Math.sqrt(1 - y * y);
    const th = ga * i + (Math.random() - 0.5) * 0.35;
    let rad = 1 + (Math.random() - 0.5) * 0.018;
    if (Math.random() < 0.05) rad += Math.random() * 0.06;
    PX[i] = Math.cos(th) * r * rad;
    PY[i] = y * rad;
    PZ[i] = Math.sin(th) * r * rad;
    PS[i] = 0.5 + Math.random() * 0.6;
    PL[i] = 1 / Math.sqrt(PX[i] * PX[i] + PY[i] * PY[i] + PZ[i] * PZ[i]);
  }
  const BUF = [0, 1, 2, 3].map(() => new Float32Array(N * 3));
  return { N, PX, PY, PZ, PS, PL, BUF };
}

/** Dots in four depth bands (front = big and dark, back = faint), with the section-change ripple. */
export function drawDots(ctx: CanvasRenderingContext2D, v: View, r: Rot, s: Sphere, rip: Ripple): void {
  const { cx, cy, R, W, H } = v;
  const { cl, sl, cp, sp } = r;
  const cnt = [0, 0, 0, 0];
  const rv = rip.on ? rip.v : null;
  const RS = R / 620 + 0.45;
  for (let i = 0; i < s.N; i++) {
    const px = s.PX[i];
    const py = s.PY[i];
    const pz = s.PZ[i];
    const x1 = px * cl - pz * sl;
    const z1 = px * sl + pz * cl;
    const z2 = py * sp + z1 * cp;
    const b = z2 > 0.5 ? 0 : z2 > 0.18 ? 1 : z2 > 0 ? 2 : 3;
    if (b === 3 && i % 5 > 1) continue;
    const y2 = py * cp - z1 * sp;
    let k = 1;
    let sz = s.PS[i];
    if (rv) {
      const dd = Math.acos(Math.max(-1, Math.min(1, (px * rv[0] + py * rv[1] + pz * rv[2]) * s.PL[i])));
      const w = (dd - rip.t * 1.5) / 0.16;
      const e = Math.exp(-w * w) * (1 - rip.t / 1.6);
      k = 1 + e * 0.05;
      sz += e * 2.2;
    }
    const X = cx + R * x1 * k;
    const Y = cy - R * y2 * k;
    if (X < -10 || X > W + 10 || Y < -10 || Y > H + 10) continue;
    const A = s.BUF[b];
    const c = cnt[b];
    A[c] = X;
    A[c + 1] = Y;
    A[c + 2] = b === 3 ? sz * 0.7 : sz;
    cnt[b] = c + 3;
  }
  const al = [0.85, 0.62, 0.42, 0.14];
  const mul = [1.15, 1, 0.85, 0.85];
  ctx.fillStyle = '#0B0B0B';
  for (let b = 3; b >= 0; b--) {
    const A = s.BUF[b];
    const n = cnt[b];
    ctx.globalAlpha = al[b];
    ctx.beginPath();
    if (b === 0) {
      for (let i = 0; i < n; i += 3) {
        const rr = A[i + 2] * mul[b] * RS;
        ctx.moveTo(A[i] + rr, A[i + 1]);
        ctx.arc(A[i], A[i + 1], rr, 0, 7);
      }
    } else {
      for (let i = 0; i < n; i += 3) {
        const r2 = A[i + 2] * mul[b] * RS;
        ctx.rect(A[i] - r2, A[i + 1] - r2, r2 * 2, r2 * 2);
      }
    }
    ctx.fill();
  }
}

/** Short red blips that appear and fade on random dots. */
export interface Flash {
  i: number;
  t: number;
  l: number;
}

export function createFlashes(n: number, count: number): Flash[] {
  const make = (): Flash => ({ i: (Math.random() * n) | 0, t: 0, l: 50 + Math.random() * 80 });
  return Array.from({ length: count }, () => {
    const f = make();
    f.t = Math.random() * f.l;
    return f;
  });
}

export function drawFlashes(ctx: CanvasRenderingContext2D, v: View, r: Rot, s: Sphere, flashes: Flash[]): void {
  const { cx, cy, R } = v;
  ctx.fillStyle = '#C4161C';
  for (let k = 0; k < flashes.length; k++) {
    const fh = flashes[k];
    fh.t++;
    if (fh.t > fh.l) {
      flashes[k] = { i: (Math.random() * s.N) | 0, t: 0, l: 50 + Math.random() * 80 };
      continue;
    }
    const px = s.PX[fh.i];
    const py = s.PY[fh.i];
    const pz = s.PZ[fh.i];
    const fx = px * r.cl - pz * r.sl;
    const fz = px * r.sl + pz * r.cl;
    const fy = py * r.cp - fz * r.sp;
    const fz2 = py * r.sp + fz * r.cp;
    if (fz2 > 0.1) {
      const ph = Math.sin((fh.t / fh.l) * Math.PI);
      ctx.globalAlpha = ph * 0.9;
      ctx.beginPath();
      ctx.arc(cx + R * fx, cy - R * fy, 1.5 + ph * 2.2, 0, 7);
      ctx.fill();
      ctx.globalAlpha = ph * 0.25;
      ctx.beginPath();
      ctx.arc(cx + R * fx, cy - R * fy, 5 + ph * 6, 0, 7);
      ctx.fill();
    }
  }
}
