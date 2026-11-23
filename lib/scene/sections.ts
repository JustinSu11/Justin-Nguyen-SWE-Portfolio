import type { View } from './types';

export interface Sections {
  secs: HTMLElement[];
  tops: number[];
  /** fractional section index the orb is heading to */
  progress: { target: number; f: number };
  measure(): void;
  computeTarget(): void;
  curSec(): number;
}

const smooth = (t: number) => {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
};

export function createSections(v: View): Sections {
  const secs = Array.from(document.querySelectorAll<HTMLElement>('section[data-node]'));
  const s: Sections = {
    secs,
    tops: [],
    progress: { target: 0, f: 0 },
    measure() {
      s.tops = secs.map((e) => e.getBoundingClientRect().top + scrollY);
    },
    computeTarget() {
      const y = scrollY + v.H * 0.5;
      const band = v.H * 0.32;
      let t = 0;
      for (let i = 1; i < s.tops.length; i++) t += smooth((y - (s.tops[i] - band)) / (band * 2));
      s.progress.target = t;
    },
    curSec() {
      const y = scrollY + v.H * 0.5;
      let k = 0;
      for (let i = 0; i < s.tops.length; i++) if (s.tops[i] <= y) k = i;
      return k;
    },
  };
  return s;
}
