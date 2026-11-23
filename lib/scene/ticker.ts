import type { Disposer } from './types';

const MOTTOS = ['SEMPER · FIDELIS', 'AD ASTRA · PER ASPERA', 'HIC SUNT · LEONES'];

/** The black bar top-left cycles through mottos. */
export function startMottos(reduced: boolean): Disposer {
  const bar = document.querySelector('.col-blk');
  const span = bar?.querySelector('span');
  if (!span || reduced) return () => {};
  let i = 0;
  let inner = 0;
  const outer = window.setInterval(() => {
    span.classList.add('o');
    inner = window.setTimeout(() => {
      i = (i + 1) % MOTTOS.length;
      span.textContent = MOTTOS[i];
      span.classList.remove('o');
    }, 480);
  }, 5200);
  return () => {
    clearInterval(outer);
    clearTimeout(inner);
  };
}

/** Greek words type out their definition the first time they scroll into view. */
export function startTypewriters(reduced: boolean): Disposer {
  const els = Array.from(document.querySelectorAll<HTMLElement>('.gw .tw'));
  const timers = new Set<number>();
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };
  const type = (el: HTMLElement) => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const text = el.dataset.t ?? '';
    if (reduced) {
      el.textContent = text;
      return;
    }
    el.classList.add('ty');
    let i = 0;
    const next = () => {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) later(next, 26 + Math.random() * 30);
      else later(() => el.classList.remove('ty'), 1800);
    };
    next();
  };
  if (!('IntersectionObserver' in window)) {
    els.forEach((e) => (e.textContent = e.dataset.t ?? ''));
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          io.unobserve(e.target);
          later(() => type(e.target as HTMLElement), 350);
        }
      });
    },
    { threshold: 0.9 },
  );
  els.forEach((w) => io.observe(w));
  return () => {
    io.disconnect();
    timers.forEach(clearTimeout);
  };
}
