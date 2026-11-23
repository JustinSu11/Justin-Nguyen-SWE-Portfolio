import { layoutAccents } from './accents';
import { drawCompass, drawGraticule } from './compass';
import { createNeural } from './neural';
import { NODES, nodeAt } from './nodes';
import { drawNodesLayer, getLabel } from './nodesLayer';
import { createSections } from './sections';
import { createSnap } from './snap';
import { createFlashes, createSphere, drawDots, drawFlashes } from './sphere';
import { startMottos, startTypewriters } from './ticker';
import { createTimeline } from './timeline';
import { on, type Disposer, type Hit, type Pointer, type Ripple, type Rot, type View } from './types';
import { createWeave } from './weave';

/**
 * Boots the page's scene: the dot-sphere with its neural web (canvas #orb), the section-node layer
 * (#orb2), scroll mapping, snapping, the name/hands weave, accent layout and the small tickers.
 * Returns a cleanup function, so it is safe under React strict mode.
 */
export function startScene(): Disposer {
  const cv = document.getElementById('orb') as HTMLCanvasElement | null;
  const cv2 = document.getElementById('orb2') as HTMLCanvasElement | null;
  const ctx1 = cv?.getContext('2d');
  const ctx2 = cv2?.getContext('2d');
  if (!cv || !cv2 || !ctx1 || !ctx2) return () => {};

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches && !reduced;
  const v: View = { W: 0, H: 0, DPR: 1, cx: 0, cy: 0, R: 0, mobile: innerWidth <= 820, reducedMotion: reduced };

  const sphere = createSphere(v.mobile);
  const neural = createNeural(sphere, v.mobile);
  const flashes = createFlashes(sphere.N, v.mobile ? 5 : 10);
  const sec = createSections(v);
  const tl = createTimeline(v, sec, fine);
  const snap = createSnap(v, sec, tl, fine);
  const weave = createWeave(v);
  const label = getLabel();
  const adam = document.getElementById('adam');
  const rfill = document.querySelector<HTMLElement>('.rfill');
  const rmark = document.querySelector<HTMLElement>('.rmark');

  const ptr: Pointer = { mx: 0, my: 0, lastMove: 0, hover: -1 };
  const hits: Hit[] = [];
  const rip: Ripple = { on: false, t: 0, v: null };
  let lastActive = 0;
  let lastDraw = 0;
  let raf = 0;
  let stopped = false;
  const timers: number[] = [];
  const offs: Disposer[] = [];

  const resize = () => {
    v.DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    v.W = innerWidth;
    v.H = innerHeight;
    for (const [c, x] of [[cv, ctx1], [cv2, ctx2]] as const) {
      c.width = v.W * v.DPR;
      c.height = v.H * v.DPR;
      x.setTransform(v.DPR, 0, 0, v.DPR, 0, 0);
    }
    v.mobile = v.W <= 820;
    v.R = v.mobile ? Math.min(v.W * 0.72, v.H * 0.5) : Math.min(v.H * 0.74, v.W * 0.4);
    v.cx = v.mobile ? v.W * 0.5 : v.W - v.R * 0.42;
    v.cy = v.H * 0.5;
    sec.measure();
  };

  /** the scroll ruler down the left edge */
  const rulerUpdate = () => {
    if (!rfill || !rmark) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    const h = Math.round(p * innerHeight);
    rfill.style.height = h + 'px';
    rmark.style.top = h + 'px';
  };

  const relayout = () => {
    sec.measure();
    sec.computeTarget();
    weave.layout();
    layoutAccents();
  };

  const frame = (now: number) => {
    if (stopped) return;
    const prog = sec.progress;
    // idle: nothing is moving, so redraw at ~30fps at most
    if (!reduced && Math.abs(prog.target - prog.f) < 0.002 && !rip.on && !snap.snapping && now - ptr.lastMove > 600 && now - lastDraw < 31) {
      raf = requestAnimationFrame(frame);
      return;
    }
    lastDraw = now;
    prog.f += (prog.target - prog.f) * (reduced ? 1 : 0.11);
    if (Math.abs(prog.target - prog.f) < 0.0005) prog.f = prog.target;
    const f = prog.f;

    const nd = nodeAt(f);
    const lon = nd.lon + (reduced ? 0 : ptr.mx * 0.12 + Math.sin(now / 5200) * 0.03);
    const lat = nd.lat + (reduced ? 0 : ptr.my * 0.1 + Math.cos(now / 6100) * 0.02);
    const rot: Rot = { cl: Math.cos(lon), sl: Math.sin(lon), cp: Math.cos(lat), sp: Math.sin(lat) };

    // ripple when the active section changes
    const active = Math.round(f);
    if (active !== lastActive) {
      lastActive = active;
      if (!reduced) {
        rip.on = true;
        rip.t = 0;
        rip.v = NODES[active].v;
      }
    }
    if (rip.on) {
      rip.t += 0.018;
      if (rip.t > 1.6) rip.on = false;
    }

    weave.animate(f);

    // background painting drifts and fades slightly as you go down
    if (adam) {
      const so = reduced ? 0 : Math.sin(now / 5200);
      const co = reduced ? 0 : Math.cos(now / 6100);
      const ax = so * 14 - ptr.mx * 22 + f * -10;
      const ay = co * 10 - ptr.my * 14;
      const ar = so * 0.45 + ptr.mx * 0.5;
      const sc = 1 + Math.min(f, 1) * 0.05 + co * 0.006;
      adam.style.transform = `translate3d(${ax.toFixed(2)}px,${ay.toFixed(2)}px,0) rotate(${ar.toFixed(3)}deg) scale(${sc.toFixed(4)})`;
      adam.style.opacity = (1 - 0.35 * Math.min(1, f)).toFixed(3);
    }

    ctx1.clearRect(0, 0, v.W, v.H);
    drawCompass(ctx1, v, lon);
    drawGraticule(ctx1, v, rot);
    drawDots(ctx1, v, rot, sphere, rip);
    neural.draw(ctx1, v, rot);
    if (!reduced) drawFlashes(ctx1, v, rot, sphere, flashes);

    ctx2.clearRect(0, 0, v.W, v.H);
    drawNodesLayer(ctx2, v, rot, f, ptr, hits, label);
    if (label && Math.abs(f - Math.round(f)) > 0.45) label.root.style.opacity = '0';

    raf = requestAnimationFrame(frame);
  };

  // ---- interaction ----
  offs.push(
    on('pointermove', (e) => {
      ptr.lastMove = performance.now();
      ptr.mx = e.clientX / v.W - 0.5;
      ptr.my = e.clientY / v.H - 0.5;
      ptr.hover = -1;
      for (const h of hits) {
        const dx = e.clientX - h.x;
        const dy = e.clientY - h.y;
        if (dx * dx + dy * dy < h.r * h.r) {
          ptr.hover = h.i;
          break;
        }
      }
      cv.style.pointerEvents = 'none';
      document.body.style.cursor = ptr.hover >= 0 ? 'pointer' : '';
    }),
    on('click', (e) => {
      for (const h of hits) {
        const dx = e.clientX - h.x;
        const dy = e.clientY - h.y;
        if (dx * dx + dy * dy < h.r * h.r) {
          snap.jump(h.i);
          return;
        }
      }
    }),
    on(
      'scroll',
      () => {
        sec.computeTarget();
        tl.update();
        rulerUpdate();
      },
      { passive: true },
    ),
    on('resize', () => {
      resize();
      sec.computeTarget();
      weave.layout();
      layoutAccents();
      rulerUpdate();
    }),
    snap.install(),
    startMottos(reduced),
    startTypewriters(reduced),
  );

  // ---- boot ----
  resize();
  sec.computeTarget();
  sec.progress.f = sec.progress.target;
  tl.update();
  rulerUpdate();
  document.fonts?.ready.then(() => {
    if (!stopped) relayout();
  });
  const onLoad = () => {
    relayout();
    timers.push(window.setTimeout(layoutAccents, 600));
  };
  if (document.readyState === 'complete') onLoad();
  else offs.push(on('load', onLoad));
  raf = requestAnimationFrame(frame);

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout);
    offs.forEach((o) => o());
    document.body.style.cursor = '';
  };
}
