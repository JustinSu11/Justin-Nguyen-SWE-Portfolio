import { NODES } from './nodes';
import type { Hit, Pointer, Rot, View } from './types';

export interface Label {
  root: HTMLElement;
  title: HTMLElement;
  sub: HTMLElement;
}

export function getLabel(): Label | null {
  const root = document.getElementById('lab');
  const title = root?.querySelector('b');
  const sub = root?.querySelector('span');
  return root && title && sub ? { root, title, sub } : null;
}

/**
 * Section nodes on the sphere: great-circle arcs between them (active leg in red),
 * numbered discs, and the floating label for the current one. Desktop only for the discs.
 * `hits` is refilled each call and used for hover/click.
 */
export function drawNodesLayer(
  ctx: CanvasRenderingContext2D,
  v: View,
  r: Rot,
  f: number,
  ptr: Pointer,
  hits: Hit[],
  label: Label | null,
): void {
  const { cx, cy, R, W } = v;
  const { cl, sl, cp, sp } = r;
  const n = NODES.length;
  hits.length = 0;

  const arc = (A: number[], B: number[], col: string, lw: number, al: number, dash?: number[]) => {
    let pen = false;
    ctx.strokeStyle = col;
    ctx.lineWidth = lw;
    ctx.globalAlpha = al;
    ctx.setLineDash(dash ?? []);
    ctx.beginPath();
    for (let t = 0; t <= 1.001; t += 1 / 28) {
      let x = A[0] * (1 - t) + B[0] * t;
      let y = A[1] * (1 - t) + B[1] * t;
      let z = A[2] * (1 - t) + B[2] * t;
      const l = 1 / Math.sqrt(x * x + y * y + z * z);
      x *= l;
      y *= l;
      z *= l;
      const x1 = x * cl - z * sl;
      const z1 = x * sl + z * cl;
      const y2 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp;
      if (z2 > 0.03) {
        const X = cx + R * x1;
        const Y = cy - R * y2;
        if (pen) ctx.lineTo(X, Y);
        else {
          ctx.moveTo(X, Y);
          pen = true;
        }
      } else pen = false;
    }
    ctx.stroke();
    ctx.setLineDash([]);
  };
  for (let e = 0; e < n; e++) arc(NODES[e].v, NODES[(e + 2) % n].v, '#0B0B0B', 0.8, 0.22, [2, 5]);
  for (let e = 0; e < n; e++) {
    const on = (f >= e && f <= e + 1) || (e === n - 1 && f > n - 1);
    arc(NODES[e].v, NODES[(e + 1) % n].v, on ? '#C4161C' : '#0B0B0B', on ? 1.9 : 1.1, on ? 0.95 : 0.5);
  }

  // discs sit on top of the text on phones, so skip them there
  if (v.mobile) return;

  for (let i = 0; i < n; i++) {
    const nv = NODES[i].v;
    const nx = nv[0] * cl - nv[2] * sl;
    const nz = nv[0] * sl + nv[2] * cl;
    const ny = nv[1] * cp - nz * sp;
    const nz2 = nv[1] * sp + nz * cp;
    if (nz2 < 0.05) continue;
    const X = cx + R * nx;
    const Y = cy - R * ny;
    if (X < -30 || X > W + 30) continue;
    const act = Math.max(0, 1 - Math.abs(f - i) * 1.6);
    const rad = i === 0 ? 20 : 14 + act * 6;
    ctx.globalAlpha = Math.min(1, nz2 * 2.2);
    if (i === 0) {
      ctx.fillStyle = '#E8E5DE';
      ctx.strokeStyle = '#0B0B0B';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(X, Y, rad + 8, 0, 7);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#C4161C';
      ctx.beginPath();
      ctx.arc(X, Y, rad * 0.55, 0, 7);
      ctx.fill();
    } else {
      ctx.fillStyle = act > 0.5 ? '#C4161C' : '#E8E5DE';
      ctx.strokeStyle = act > 0.5 ? '#C4161C' : '#0B0B0B';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(X, Y, rad, 0, 7);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = act > 0.5 ? '#E8E5DE' : '#0B0B0B';
      ctx.font = 'italic ' + (15 + act * 3) + 'px "Noto Serif",serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(NODES[i].g, X, Y + 1);
    }
    if (act > 0.2) {
      ctx.globalAlpha = act * 0.8;
      ctx.strokeStyle = '#C4161C';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(X, Y, rad + 8 + act * 3, 0, 7);
      ctx.stroke();
    }
    hits.push({ i, x: X, y: Y, r: rad + 8 });
    if (label && Math.abs(f - i) < 0.5) {
      const o = 1 - Math.abs(f - i) * 2;
      label.root.style.opacity = String(ptr.hover < 0 ? Math.min(1, o * 1.4) : 1);
      label.title.textContent = NODES[i].t;
      label.sub.textContent = NODES[i].s;
      label.root.style.left = Math.min(W - 180, X + rad + 16) + 'px';
      label.root.style.top = Y + rad * 0.2 + 'px';
    }
  }
}
