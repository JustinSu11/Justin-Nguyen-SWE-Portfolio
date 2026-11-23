import type { SectionNode, Vec3 } from './types';

export const DEG = Math.PI / 180;

/** Order matches the order of the page sections. lon/lat in degrees. */
const RAW = [
  { id: 'home', g: '', lon: 0, lat: 0, t: 'HOME', s: 'start' },
  { id: 'about', g: 'γ', lon: 55, lat: 20, t: 'ABOUT', s: 'story & background' },
  { id: 'works', g: 'ε', lon: 110, lat: -18, t: 'WORKS', s: 'projects & case studies' },
  { id: 'stack', g: 'τ', lon: 165, lat: 22, t: 'STACK', s: 'tools & skills' },
  { id: 'experience', g: 'β', lon: 220, lat: -20, t: 'RÉSUMÉ', s: 'experience & timeline' },
  { id: 'contact', g: 'λ', lon: 275, lat: 14, t: 'CONTACT', s: 'say hello' },
];

export const NODES: SectionNode[] = RAW.map((n) => {
  const la = n.lat * DEG;
  const lo = n.lon * DEG;
  const v: Vec3 = [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
  return { ...n, v };
});

/** Sphere orientation (radians) for a fractional section index, interpolated between nodes. */
export function nodeAt(fv: number): { lon: number; lat: number } {
  let i = Math.max(0, Math.min(NODES.length - 2, Math.floor(fv)));
  let u = fv - i;
  if (fv >= NODES.length - 1) {
    i = NODES.length - 2;
    u = 1;
  }
  const a = NODES[i];
  const b = NODES[i + 1];
  return { lon: (a.lon + (b.lon - a.lon) * u) * DEG, lat: (a.lat + (b.lat - a.lat) * u) * DEG };
}
