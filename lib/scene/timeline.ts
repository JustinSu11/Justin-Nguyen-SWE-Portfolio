import type { Sections } from './sections';
import type { View } from './types';

/** The Experience section: its progress bar is driven by wheel input while the section is pinned. */
export interface Timeline {
  /** pinned-scrub state */
  st: { vp: number; force: boolean; edge: number };
  /** scrollY at which the Experience column is centred on screen */
  pin(): number;
  pinned(): boolean;
  update(): void;
}

export function createTimeline(v: View, sec: Sections, pinEnabled: boolean): Timeline {
  const tlEl = document.getElementById('tl');
  const prog = document.getElementById('prog');
  const entries = Array.from(document.querySelectorAll<HTMLElement>('.te'));
  const col = document.querySelector<HTMLElement>('#experience .col');
  void sec;
  const st = { vp: 0, force: false, edge: 0 };

  const pin = () => {
    if (!col) return 0;
    const r = col.getBoundingClientRect();
    return Math.max(0, Math.round(r.top + scrollY - Math.max(0, (v.H - r.height) * 0.42)));
  };
  const pinned = () => pinEnabled && !!tlEl && Math.abs(scrollY - pin()) < 8;

  const update = () => {
    if (!tlEl || !prog) return;
    const r = tlEl.getBoundingClientRect();
    if (st.force && Math.abs(scrollY - pin()) > v.H * 1.2) st.force = false;
    let p: number;
    if (st.force) p = st.vp;
    else p = Math.max(0, Math.min(1, (v.H * 0.62 - r.top) / r.height));
    prog.style.height = p * 100 + '%';
    entries.forEach((en) => {
      const er = en.getBoundingClientRect();
      en.classList.toggle('on', st.force ? (er.top - r.top) / r.height <= p + 0.02 : er.top < v.H * 0.62);
    });
  };

  return { st, pin, pinned, update };
}
