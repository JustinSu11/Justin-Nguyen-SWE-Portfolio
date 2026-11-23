import { DEG } from './nodes';
import type { Rot, View } from './types';

/** Degree ring around the sphere; its ticks rotate with the longitude. */
export function drawCompass(ctx: CanvasRenderingContext2D, v: View, lon: number): void {
  const { cx, cy, R } = v;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = '#0B0B0B';
  ctx.lineWidth = 1.2;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.arc(0, 0, R * 1.07, 0, 7);
  ctx.stroke();
  ctx.lineWidth = 0.9;
  ctx.setLineDash([2, 5]);
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.arc(0, 0, R * 1.035, 0, 7);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = 0.8;
  const rot = -lon;
  const r0 = R * 1.07;
  ctx.beginPath();
  for (let a = 0; a < 360; a += 5) {
    const an = a * DEG + rot;
    const len = a % 30 === 0 ? 14 : a % 10 === 0 ? 8 : 4;
    ctx.moveTo(Math.sin(an) * r0, -Math.cos(an) * r0);
    ctx.lineTo(Math.sin(an) * (r0 + len), -Math.cos(an) * (r0 + len));
  }
  ctx.stroke();
  ctx.font = '10px "IBM Plex Mono",monospace';
  ctx.fillStyle = '#0B0B0B';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = 0.8;
  const tr = r0 + 28;
  for (let a = 0; a < 360; a += 30) {
    const an = a * DEG + rot;
    ctx.save();
    ctx.translate(Math.sin(an) * tr, -Math.cos(an) * tr);
    ctx.rotate(an);
    ctx.fillText(String(a).padStart(3, '0') + '°', 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

/** Faint meridians (every 30°) and parallels (-60..60°), front hemisphere only. */
export function drawGraticule(ctx: CanvasRenderingContext2D, v: View, r: Rot): void {
  const { cx, cy, R } = v;
  const { cl, sl, cp, sp } = r;
  const proj = (x: number, y: number, z: number): [number, number, number] => {
    const x1 = x * cl - z * sl;
    const z1 = x * sl + z * cl;
    const y2 = y * cp - z1 * sp;
    const z2 = y * sp + z1 * cp;
    return [cx + R * x1, cy - R * y2, z2];
  };
  ctx.save();
  ctx.lineWidth = 0.7;
  ctx.strokeStyle = '#0B0B0B';
  const trace = (pts: Iterable<[number, number, number]>) => {
    let pen = false;
    ctx.beginPath();
    for (const q of pts) {
      if (q[2] > 0) {
        if (pen) ctx.lineTo(q[0], q[1]);
        else ctx.moveTo(q[0], q[1]);
        pen = true;
      } else pen = false;
    }
    ctx.globalAlpha = 0.16;
    ctx.stroke();
  };
  for (let m = 0; m < 12; m++) {
    const lo = m * 30 * DEG;
    const pts: [number, number, number][] = [];
    for (let t = -90; t <= 90; t += 6) {
      const la = t * DEG;
      pts.push(proj(Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)));
    }
    trace(pts);
  }
  for (let l = -60; l <= 60; l += 30) {
    const lat0 = l * DEG;
    const pts: [number, number, number][] = [];
    for (let t = 0; t <= 360; t += 6) {
      const ln = t * DEG;
      pts.push(proj(Math.cos(lat0) * Math.sin(ln), Math.sin(lat0), Math.cos(lat0) * Math.cos(ln)));
    }
    trace(pts);
  }
  ctx.restore();
}
