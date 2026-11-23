/**
 * Geometric accent linework (.ac) is positioned in viewport units, so at some window sizes it lands
 * on text. This nudges each accent to the nearest free spot (or hides it) so none overlap content,
 * cards, tags, the name, or each other. Runs on load, font load and resize. Skipped at <= 820px.
 */
interface Box {
  l: number;
  t: number;
  r: number;
  b: number;
}

const CONTENT =
  'h1,h2,h3,p,li,.kick,.gk,.card,.tags span,.eq,.eqc,.name,.stack-g h4,footer,button,.btn,.roles,.scrollcue,.te';

export function layoutAccents(): void {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('section'));
  if (innerWidth <= 820) {
    sections.forEach((sc) => sc.querySelectorAll<HTMLElement>('.ac').forEach((a) => (a.style.translate = '')));
    return;
  }
  const sx = scrollX;
  const sy = scrollY;

  // the Greek-word typewriters measure as empty until typed; fill them while measuring
  const typed: [HTMLElement, string][] = [];
  document.querySelectorAll<HTMLElement>('.gw .tw[data-t]').forEach((t) => {
    typed.push([t, t.textContent ?? '']);
    t.textContent = t.dataset.t ?? '';
  });

  const rect = (e: Element): Box => {
    const r = e.getBoundingClientRect();
    return { l: r.left + sx, t: r.top + sy, r: r.right + sx, b: r.bottom + sy };
  };
  /** an accent's box, including its absolutely positioned child squares */
  const union = (e: Element): Box => {
    const u = rect(e);
    e.querySelectorAll('i').forEach((c) => {
      const q = rect(c);
      u.l = Math.min(u.l, q.l);
      u.t = Math.min(u.t, q.t);
      u.r = Math.max(u.r, q.r);
      u.b = Math.max(u.b, q.b);
    });
    return u;
  };
  const hit = (a: Box, b: Box, pad: number) => a.l < b.r + pad && b.l < a.r + pad && a.t < b.b + pad && b.t < a.b + pad;
  const area = (a: HTMLElement) => (a.matches('.gw') ? 1e6 : 0) + a.offsetWidth * a.offsetHeight;

  sections.forEach((sc) => {
    const accents = Array.from(sc.querySelectorAll<HTMLElement>('.ac')).filter((a) => getComputedStyle(a).display !== 'none');
    accents.forEach((a) => (a.style.translate = ''));
    const sr = rect(sc);
    const fixed: Box[] = [];
    sc.querySelectorAll(CONTENT).forEach((e) => {
      if (e.closest('.ac') || !e.getBoundingClientRect().width) return;
      if (e.matches('.card,.btn,button,.tags span,.name')) {
        fixed.push(rect(e));
        return;
      }
      // tight per-line text boxes, not the full-width block
      const rg = document.createRange();
      rg.selectNodeContents(e);
      for (const q of Array.from(rg.getClientRects())) {
        if (q.width > 1) fixed.push({ l: q.left + sx, t: q.top + sy, r: q.right + sx, b: q.bottom + sy });
      }
    });
    const orbX = sr.l + innerWidth * 0.45; // keep accents on the left of the orb
    const placed: Box[] = [];

    accents
      .slice()
      .sort((a, b) => area(b) - area(a))
      .forEach((a) => {
        const base = union(a);
        const free = (dx: number, dy: number) => {
          const c: Box = { l: base.l + dx, t: base.t + dy, r: base.r + dx, b: base.b + dy };
          if (c.l < sr.l + 2 || c.t < sr.t + 2 || c.b > sr.b - 2 || c.r > orbX) return false;
          for (const f of fixed) if (hit(c, f, 9)) return false;
          for (const p of placed) if (hit(c, p, 7)) return false;
          return true;
        };
        let dx = 0;
        let dy = 0;
        if (!free(0, 0)) {
          let best: [number, number] | null = null;
          let bd = 1e9;
          for (let yy = -900; yy <= 900; yy += 10) {
            for (let xx = -500; xx <= 500; xx += 10) {
              const d = xx * xx + yy * yy * 1.3;
              if (d < bd && free(xx, yy)) {
                bd = d;
                best = [xx, yy];
              }
            }
          }
          if (best) {
            [dx, dy] = best;
            a.style.translate = dx + 'px ' + dy + 'px';
          } else {
            a.style.visibility = 'hidden';
            return;
          }
        }
        a.style.visibility = '';
        placed.push({ l: base.l + dx, t: base.t + dy, r: base.r + dx, b: base.b + dy });
      });
  });
  typed.forEach(([el, text]) => (el.textContent = text));
}
