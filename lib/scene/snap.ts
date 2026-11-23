import type { Sections } from './sections';
import type { Timeline } from './timeline';
import { on, type Disposer, type View } from './types';

export interface Snap {
  readonly snapping: boolean;
  /** jump to a section (used by the node discs) */
  jump(i: number): void;
  install(): Disposer;
}

/**
 * Desktop section snapping. One wheel gesture = one section; the inertia tail of a
 * trackpad flick is swallowed until the wheel pauses. Experience pins and scrubs its own bar.
 * Does nothing at <= 820px.
 */
export function createSnap(v: View, sec: Sections, tl: Timeline, fine: boolean): Snap {
  const RM = v.reducedMotion;
  let snapping = false;
  let lockUntil = 0;
  let glideDir = 0;
  let glideId = 0;
  let tIdx = 0;
  let accD = 0;
  let lastW = 0;
  let newG = true; // current wheel event starts a new gesture
  let scrubBudget = 0.34; // timeline progress available right now; refills with time, so scrolling never stalls
  let scrubAt = 0;
  let tail = false; // swallow the inertia of the gesture that started a glide until the wheel pauses
  const secs = sec.secs;

  const isExp = (i: number) => secs[i]?.id === 'experience';

  function goTo(y: number, dir: number, chain: boolean) {
    y = Math.max(0, Math.round(y));
    const y0 = scrollY;
    const d = y - y0;
    if (Math.abs(d) < 2) return;
    if (RM) {
      scrollTo(0, y);
      return;
    }
    const id = ++glideId;
    snapping = true;
    tail = true;
    glideDir = dir || (d > 0 ? 1 : -1);
    const t0 = performance.now();
    const dur = chain ? Math.min(1500, 1100 + Math.abs(d) * 0.1) : Math.min(1900, 1300 + Math.abs(d) * 0.2);
    const step = (now: number) => {
      if (id !== glideId) return;
      const t = Math.min(1, (now - t0) / dur);
      const e = chain ? 1 - Math.pow(1 - t, 3) : -(Math.cos(Math.PI * t) - 1) / 2;
      scrollTo(0, y0 + d * e);
      if (t < 1) requestAnimationFrame(step);
      else {
        lockUntil = isExp(tIdx) ? 0 : performance.now() + 140;
        snapping = false;
        glideDir = 0;
        accD = 0;
      }
    };
    step(t0);
  }

  function secTarget(j: number, dir: number): number {
    if (fine && isExp(j)) {
      tl.st.force = true;
      tl.st.vp = dir > 0 ? 0 : 1;
      tl.st.edge = performance.now();
      tl.update();
      return tl.pin();
    }
    return sec.tops[j];
  }

  function stepSec(dir: number, ev: { deltaY?: number; preventDefault(): void }) {
    if (v.mobile) return; // small screens: plain native scrolling
    const dy = Math.abs(ev.deltaY || 140);
    const n = secs.length;
    if (snapping) {
      ev.preventDefault();
      if (dir !== glideDir) {
        const j0 = Math.max(0, Math.min(n - 1, tIdx + dir));
        tIdx = j0;
        accD = 0;
        goTo(secTarget(j0, dir), dir, true);
      } else if (isExp(tIdx)) {
        // gliding into Experience: ignore input until we land, same in both directions
      } else if (newG) {
        accD += dy;
        if (accD >= 60) {
          accD = 0;
          const j1 = tIdx + dir;
          if (j1 >= 0 && j1 < n) {
            tIdx = j1;
            goTo(secTarget(j1, dir), dir, true);
          }
        }
      }
      return;
    }
    if (performance.now() < lockUntil) {
      ev.preventDefault();
      return;
    }
    const i = sec.curSec();
    const top = sec.tops[i];
    const bot = top + secs[i].offsetHeight;
    if (isExp(i) && tl.pinned()) {
      ev.preventDefault();
      const atEdge = dir > 0 ? tl.st.vp >= 1 : tl.st.vp <= 0;
      if (!atEdge) {
        if (!newG && tail) return; // inertia of the gesture that brought us here
        // the bar can move at most ~0.8 timelines/second, so a hard flick can't blow through it
        // but steady scrolling is never cut off mid-way
        const t = performance.now();
        scrubBudget = Math.min(0.34, scrubBudget + (t - scrubAt) * 0.0008);
        scrubAt = t;
        const step = Math.min((ev.deltaY ? dy : 240) / 600, scrubBudget);
        scrubBudget -= step;
        tl.st.vp = Math.max(0, Math.min(1, tl.st.vp + dir * step));
        if (tl.st.vp === 0 || tl.st.vp === 1) tl.st.edge = performance.now();
        tl.update();
        return;
      }
      // leaving needs a fresh gesture, so the flick that reached the end doesn't carry on past it
      const jj = i + dir;
      if (jj < 0 || jj >= n || !newG) return;
      tIdx = jj;
      accD = 0;
      goTo(secTarget(jj, dir), dir, false);
      return;
    }
    // still more of this section to read (Home is exempt: its extra height is only padding)
    if (dir > 0 && i !== 0 && bot > scrollY + v.H + 10) return;
    if (dir < 0 && top < scrollY - 10) return;
    const j = i + dir;
    if (j < 0 || j >= n) return;
    ev.preventDefault();
    if (!newG && tail) return;
    tIdx = j;
    accD = 0;
    goTo(secTarget(j, dir), dir, false);
  }

  return {
    get snapping() {
      return snapping;
    },
    jump(i) {
      tIdx = i;
      goTo(secTarget(i, i > sec.curSec() ? 1 : -1), 0, false);
    },
    install() {
      if (!fine) return () => {};
      const offs = [
        on(
          'wheel',
          (e) => {
            if (e.ctrlKey || Math.abs(e.deltaY) < 3) return;
            const n = performance.now();
            newG = n - lastW > 130;
            lastW = n;
            if (newG) tail = false;
            stepSec(e.deltaY > 0 ? 1 : -1, e);
          },
          { passive: false },
        ),
        on('keydown', (e) => {
          const k = e.key;
          let dir = 0;
          if (k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) dir = 1;
          else if (k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey)) dir = -1;
          const tag = (e.target as HTMLElement | null)?.tagName ?? '';
          if (!dir || /INPUT|TEXTAREA|SELECT/.test(tag)) return;
          newG = !e.repeat;
          if (newG) tail = false;
          stepSec(dir, e);
        }),
      ];
      return () => {
        glideId++; // cancel any glide in flight
        offs.forEach((o) => o());
      };
    },
  };
}
