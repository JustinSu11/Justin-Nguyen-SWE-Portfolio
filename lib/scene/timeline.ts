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
  /** ease the drawn bar toward its target; call every frame with ms since last frame */
  tick(dt: number): void;
}

export function createTimeline(v: View, sec: Sections, pinEnabled: boolean): Timeline {
  const tlEl = document.getElementById('tl');
  const prog = document.getElementById('prog');
  const entries = Array.from(document.querySelectorAll<HTMLElement>('.te'));
  const col = document.querySelector<HTMLElement>('#experience .col');
  void sec;
  const st = { vp: 0, force: false, edge: 0 };
  let target = 0;
  let shown = 0;
  let first = true;

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
    target = p;
    if (first || v.reducedMotion) {
      shown = p;
      first = false;
      prog.style.transform = `scaleY(${shown})`;
    }
    entries.forEach((en) => {
      const er = en.getBoundingClientRect();
      en.classList.toggle('on', st.force ? (er.top - r.top) / r.height <= p + 0.02 : er.top < v.H * 0.62);
    });
  };

  const tick = (dt: number) => {
    if (!prog || shown === target) return;
    const k = 1 - Math.pow(1 - 0.16, Math.min(dt, 50) / 16.7);
    shown += (target - shown) * k;
    if (Math.abs(target - shown) < 0.0004) shown = target;
    prog.style.transform = `scaleY(${shown})`;
  };

  return { st, pin, pinned, update, tick };
}
