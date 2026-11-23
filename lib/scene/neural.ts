import type { Sphere } from './sphere';
import type { Rot, Vec3, View } from './types';

/**
 * A small feed-forward-looking web wired between existing dots.
 * Signals ("pulses") flow from the top of the sphere (input) to the bottom (output).
 */
export interface Neural {
  draw(ctx: CanvasRenderingContext2D, v: View, r: Rot): void;
}

const BANDS = 6;

export function createNeural(s: Sphere, mobile: boolean): Neural {
  const NM = mobile ? 90 : 180;
  const MAXP = mobile ? 16 : 34;
  const NP: Vec3[] = [];
  const NB: number[] = []; // vertical band of each node
  const NE: [number, number][] = []; // edges, from -> to (high y to low y)
  const NW: number[] = []; // edge weight
  const EL: number[] = []; // edge glow
  const OUT: number[][] = [];
  const NL: number[] = []; // node glow
  const seen = new Set<string>();
  const rnd = Math.random;

  const step = s.N / NM;
  for (let i = 0; i < NM; i++) {
    const d = Math.min(s.N - 1, Math.floor((i + rnd()) * step));
    const l = s.PL[d];
    NP.push([s.PX[d] * l, s.PY[d] * l, s.PZ[d] * l]);
    NB.push(Math.min(BANDS - 1, Math.floor(((1 - s.PY[d] * l) / 2) * BANDS)));
    OUT.push([]);
    NL.push(0);
  }
  const link = (a: number, b: number) => {
    const key = a < b ? a + '_' + b : b + '_' + a;
    if (seen.has(key)) return;
    seen.add(key);
    let f = a;
    let t = b;
    if (NP[b][1] > NP[a][1] + 0.02 || (Math.abs(NP[b][1] - NP[a][1]) <= 0.02 && rnd() < 0.5)) {
      f = b;
      t = a;
    }
    NE.push([f, t]);
    NW.push(0.1 + Math.pow(rnd(), 1.7) * 0.9);
    EL.push(0);
    OUT[f].push(NE.length - 1);
  };
  for (let i = 0; i < NM; i++) {
    const ds: [number, number][] = [];
    for (let j = 0; j < NM; j++) {
      if (j !== i) ds.push([NP[i][0] * NP[j][0] + NP[i][1] * NP[j][1] + NP[i][2] * NP[j][2], j]);
    }
    ds.sort((a, b) => b[0] - a[0]);
    const pool = ds.slice(0, 7);
    const want = 2 + ((rnd() * 2) | 0);
    for (let k = 0; k < want; k++) {
      const pick = pool.splice((rnd() * pool.length) | 0, 1)[0];
      if (pick) link(i, pick[1]);
    }
    if (rnd() < 0.07) {
      const far = ds[8 + ((rnd() * 10) | 0)];
      if (far) link(i, far[1]);
    }
  }

  interface Pulse {
    e: number;
    t: number;
    v: number;
  }
  const PU: Pulse[] = [];
  const spawn = (e: number) => {
    if (PU.length < MAXP) PU.push({ e, t: 0, v: 0.016 + Math.random() * 0.012 });
  };
  /** point along the great-circle between nodes a and b */
  const nnPt = (a: number, b: number, t: number, o: Vec3) => {
    const x = NP[a][0] * (1 - t) + NP[b][0] * t;
    const y = NP[a][1] * (1 - t) + NP[b][1] * t;
    const z = NP[a][2] * (1 - t) + NP[b][2] * t;
    const l = 1 / Math.sqrt(x * x + y * y + z * z);
    o[0] = x * l;
    o[1] = y * l;
    o[2] = z * l;
  };

  const draw = (ctx: CanvasRenderingContext2D, v: View, r: Rot) => {
    const { cx, cy, R } = v;
    const RM = v.reducedMotion;
    const o: Vec3 = [0, 0, 0];
    const tr = (p: Vec3): Vec3 => {
      const x1 = p[0] * r.cl - p[2] * r.sl;
      const z1 = p[0] * r.sl + p[2] * r.cl;
      return [cx + R * x1, cy - (p[1] * r.cp - z1 * r.sp) * R, p[1] * r.sp + z1 * r.cp];
    };
    const seg = (a: number, b: number, t0: number, t1: number) => {
      nnPt(a, b, t0, o);
      let P1 = tr(o);
      ctx.moveTo(P1[0], P1[1]);
      const n = Math.max(2, Math.ceil((t1 - t0) * 8));
      for (let q = 1; q <= n; q++) {
        nnPt(a, b, t0 + ((t1 - t0) * q) / n, o);
        P1 = tr(o);
        ctx.lineTo(P1[0], P1[1]);
      }
    };
    const T = NP.map(tr);

    // static links, three weight classes
    const cls = [
      [0, 0.33, 0.6, 0.5],
      [0.33, 0.66, 0.95, 0.7],
      [0.66, 1.01, 1.5, 0.9],
    ];
    ctx.strokeStyle = '#0B0B0B';
    for (const [lo, hi, lw, al] of cls) {
      ctx.lineWidth = lw;
      ctx.globalAlpha = al * 0.5;
      ctx.beginPath();
      for (let e = 0; e < NE.length; e++) {
        const w = NW[e];
        if (w < lo || w >= hi) continue;
        const [a, b] = NE[e];
        if (T[a][2] < 0.04 || T[b][2] < 0.04) continue;
        seg(a, b, 0, 1);
      }
      ctx.stroke();
    }

    // energised links: the connection itself lights up and fades
    ctx.strokeStyle = '#C4161C';
    for (let e = 0; e < NE.length; e++) {
      if (EL[e] <= 0.02) continue;
      const [a, b] = NE[e];
      if (T[a][2] >= 0.04 && T[b][2] >= 0.04) {
        ctx.globalAlpha = EL[e] * 0.85;
        ctx.lineWidth = 0.7 + NW[e] * 1.6;
        ctx.beginPath();
        seg(a, b, 0, 1);
        ctx.stroke();
      }
      EL[e] *= 0.965;
    }

    // weight readouts on the strongest visible links
    ctx.font = '9px "IBM Plex Mono",monospace';
    ctx.fillStyle = '#0B0B0B';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let e = 0; e < NE.length; e++) {
      if (NW[e] < 0.93) continue;
      const [a, b] = NE[e];
      if (T[a][2] < 0.4 || T[b][2] < 0.4) continue;
      nnPt(a, b, 0.5, o);
      const P1 = tr(o);
      ctx.globalAlpha = Math.min(0.7, (P1[2] - 0.3) * 1.4);
      ctx.fillText('w=' + NW[e].toFixed(2), P1[0], P1[1] - 7);
    }

    // forward pass: charge fills each link, then fans out into the next layer
    if (!RM) {
      if (PU.length < MAXP && rnd() < 0.07) {
        let s0 = (rnd() * NM) | 0;
        let g = 0;
        while ((NB[s0] !== 0 || !OUT[s0].length) && g++ < 300) s0 = (rnd() * NM) | 0;
        if (OUT[s0].length) spawn(OUT[s0][(rnd() * OUT[s0].length) | 0]);
      }
      for (let i = PU.length - 1; i >= 0; i--) {
        const p = PU[i];
        p.t += p.v;
        const [a, b] = NE[p.e];
        const w = NW[p.e];
        EL[p.e] = Math.max(EL[p.e], 0.9);
        const vis = T[a][2] >= 0.04 && T[b][2] >= 0.04;
        const tt = Math.min(1, p.t);
        if (vis) {
          ctx.strokeStyle = '#C4161C';
          ctx.lineCap = 'round';
          ctx.globalAlpha = 1;
          ctx.lineWidth = 1.1 + w * 2;
          ctx.beginPath();
          seg(a, b, 0, tt);
          ctx.stroke();
          nnPt(a, b, tt, o);
          const H1 = tr(o);
          ctx.fillStyle = '#C4161C';
          ctx.globalAlpha = 0.25;
          ctx.beginPath();
          ctx.arc(H1[0], H1[1], 4 + w * 4, 0, 7);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(H1[0], H1[1], 1.8 + w * 1.6, 0, 7);
          ctx.fill();
          ctx.lineCap = 'butt';
        }
        if (p.t >= 1) {
          NL[b] = 1;
          PU.splice(i, 1);
          const ou = OUT[b];
          if (ou.length) {
            spawn(ou[(rnd() * ou.length) | 0]);
            if (rnd() < 0.6) spawn(ou[(rnd() * ou.length) | 0]);
          }
        }
      }
    }

    // nodes: emphasise the existing dots that carry the web
    for (let i = 0; i < NM; i++) {
      const Z = T[i][2];
      if (Z < 0.05) continue;
      const lit = NL[i];
      NL[i] = lit > 0 ? lit - 0.025 : 0;
      const rr = (1.8 + 1.5 * Z + lit * 2.6) * (R / 620 + 0.5);
      ctx.globalAlpha = Math.min(1, Z * 3) * 0.95;
      ctx.fillStyle = lit > 0.05 ? '#C4161C' : '#0B0B0B';
      ctx.beginPath();
      ctx.arc(T[i][0], T[i][1], rr, 0, 7);
      ctx.fill();
    }
  };

  return { draw };
}
