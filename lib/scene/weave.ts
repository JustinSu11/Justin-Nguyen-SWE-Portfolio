import type { View } from './types';

/**
 * Creation-of-Adam hands woven through the name. Each half of the fresco is cut at the contact
 * point (clip-path) and drawn behind the letters, with thin front slices over J-u-s-t-i-n so the
 * fingers pass in front of some letters and behind others. As you leave Home the two halves
 * pull apart: transforms are tied to scroll position, not time.
 */
export interface Weave {
  layout(): void;
  /** f = fractional section index (0 = Home) */
  animate(f: number): void;
  readonly active: boolean;
}

const FRONT_LETTERS = [1, 2, 4];
const IMG = '/assets/images/hands_fresco.png';
const ASPECT = 402 / 1600;

export function createWeave(v: View): Weave {
  const weave = document.querySelector<HTMLElement>('.weave');
  const svg = document.querySelector<SVGSVGElement>('.wsvg');
  const nameEl = document.querySelector<HTMLElement>('.name');
  const home = document.getElementById('home');
  let imgs: HTMLImageElement[] = [];

  const layout = () => {
    if (!weave || !svg || !nameEl || !home || document.body.dataset.v !== 'weave' || v.mobile) return;
    const hr = home.getBoundingClientRect();
    const letters = Array.from(nameEl.children).map((e) => {
      const r = e.getBoundingClientRect();
      return { l: r.left - hr.left, r: r.right - hr.left };
    });
    const nr = nameEl.getBoundingClientRect();
    const F = parseFloat(getComputedStyle(nameEl).fontSize);
    const nt = nr.top - hr.top;
    const nh = nr.height;
    // contact point between the two fingertips, centred under the name
    const gx = (letters[0].l + letters[5].r) / 2;
    const gy = nt + nh * 0.56;
    const iw = F * 5.5;
    const ih = iw * ASPECT;
    const left = gx - 0.4928 * iw;
    const top = gy - 0.49 * ih;
    const right = left + iw;

    weave.querySelectorAll('img').forEach((i) => i.remove());
    imgs = [];
    const mk = (cls: string, side: number, a: number, b: number, padA: number, padB: number) => {
      const im = new Image();
      im.src = IMG;
      im.className = cls;
      im.alt = '';
      im.dataset.side = String(side);
      im.style.cssText =
        `left:${left}px;top:${top}px;width:${iw}px;` +
        `clip-path:inset(0px ${right - b - padB}px 0px ${a - left - padA}px);`;
      weave.appendChild(im);
      imgs.push(im);
    };
    for (const side of [-1, 1]) {
      const lo = side < 0 ? left : gx;
      const hi = side < 0 ? gx : right;
      mk('wb', side, lo, hi, 0, 0);
      for (const k of FRONT_LETTERS) {
        const L = letters[k];
        const a = Math.max(L.l, lo);
        const b = Math.min(L.r, hi);
        if (b - a < 2) continue;
        mk('wf', side, a, b, a === L.l ? 3 : 0, b === L.r ? 3 : 0);
      }
    }

    // ruler under the name, with the red "ε → 0" marker at the contact point
    const hw = home.clientWidth;
    const hh = home.clientHeight;
    svg.dataset.hw = String(hw);
    svg.setAttribute('viewBox', `0 0 ${hw} ${hh}`);
    const x0 = letters[0].l;
    const x1 = letters[5].r;
    const ry = nt + nh + 16;
    let ticks = '';
    for (let x = x0; x <= x1; x += 14) {
      const big = Math.round((x - x0) / 14) % 5 === 0;
      ticks += `M${x.toFixed(1)} ${ry}v${big ? 10 : 5}`;
    }
    svg.innerHTML =
      `<g fill="none" stroke="#0B0B0B" stroke-width="1"><path d="M${x0} ${ry}H${x1}" opacity=".8"/><path d="${ticks}" opacity=".55"/></g>` +
      `<circle cx="${x0}" cy="${ry}" r="2.5" fill="#0B0B0B"/><circle cx="${x1}" cy="${ry}" r="2.5" fill="#0B0B0B"/>` +
      `<path d="M${gx} ${ry - 6}v22" stroke="#C4161C" stroke-width="1.2" fill="none"/><circle cx="${gx}" cy="${ry + 2}" r="4" fill="#C4161C"/>` +
      `<text x="${gx + 12}" y="${ry + 26}" font-family="IBM Plex Mono,monospace" font-size="11" letter-spacing="2" fill="#C4161C">ε → 0</text>`;
  };

  const animate = (f: number) => {
    if (!imgs.length || !home) return;
    const hd = Math.min(1, Math.max(0, f));
    const he = 1 - Math.pow(1 - hd, 1.4);
    const hw = home.clientWidth;
    for (const im of imgs) {
      const sd = Number(im.dataset.side);
      const L = sd < 0;
      // left hand droops down-left; right hand lifts up-right, fingers rising
      const dx = (L ? 0.22 : 0.27) * he * hw;
      const dy = (L ? 0.06 : -0.1) * he * hw;
      const rt = L ? he * 13 : he * 20;
      const sc = 1 - he * (L ? 0.05 : 0.03);
      im.style.transformOrigin = L ? '8% 58%' : '92% 58%';
      im.style.transform = `translate3d(${(sd * dx).toFixed(1)}px,${dy.toFixed(1)}px,0) rotate(${rt.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
    }
  };

  return {
    layout,
    animate,
    get active() {
      return imgs.length > 0;
    },
  };
}
