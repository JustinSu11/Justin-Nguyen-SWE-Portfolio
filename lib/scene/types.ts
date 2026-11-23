export type Vec3 = [number, number, number];

export interface SectionNode {
  id: string;
  /** Greek glyph drawn inside the node disc */
  g: string;
  lon: number;
  lat: number;
  /** label title / subtitle shown beside the active node */
  t: string;
  s: string;
  /** unit vector on the sphere */
  v: Vec3;
}

/** Viewport + sphere placement, recomputed on resize. */
export interface View {
  W: number;
  H: number;
  DPR: number;
  cx: number;
  cy: number;
  R: number;
  /** <= 820px: no snapping, lighter orb, no node discs */
  mobile: boolean;
  reducedMotion: boolean;
}

/** Sphere rotation as cos/sin pairs, rebuilt each frame. */
export interface Rot {
  cl: number;
  sl: number;
  cp: number;
  sp: number;
}

export interface Pointer {
  mx: number;
  my: number;
  lastMove: number;
  /** index of the hovered section node, or -1 */
  hover: number;
}

export interface Hit {
  i: number;
  x: number;
  y: number;
  r: number;
}

export interface Ripple {
  on: boolean;
  t: number;
  v: Vec3 | null;
}

export type Disposer = () => void;

/** addEventListener that returns its own remover. */
export function on<K extends keyof WindowEventMap>(
  type: K,
  fn: (e: WindowEventMap[K]) => void,
  opts?: AddEventListenerOptions,
): Disposer {
  window.addEventListener(type, fn as EventListener, opts);
  return () => window.removeEventListener(type, fn as EventListener, opts);
}
