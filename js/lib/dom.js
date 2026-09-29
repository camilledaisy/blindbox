/**
 * Tiny hyperscript helper: h('div.card.is-rare', { onclick }, child, 'text')
 */
export function h(tag, props, ...kids) {
  const [name, ...classes] = tag.split('.');
  const el = document.createElement(name || 'div');
  if (classes.length) el.className = classes.join(' ');
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = [el.className, v].filter(Boolean).join(' ');
    else if (k === 'style' && typeof v === 'object') {
      for (const [sk, sv] of Object.entries(v)) {
        if (sk.startsWith('--')) el.style.setProperty(sk, sv);
        else el.style[sk] = sv;
      }
    } else if (k === 'html') el.innerHTML = v;
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  append(el, kids);
  return el;
}

function append(el, kids) {
  for (const kid of kids) {
    if (kid == null || kid === false) continue;
    if (Array.isArray(kid)) append(el, kid);
    else el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const rand = (a, b) => a + Math.random() * (b - a);
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const pad3 = (n) => String(n).padStart(3, '0');

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Restart a CSS animation by removing + re-adding a class. */
export function replayClass(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

/** 7×9 pixel-art star, returned as an inline SVG string. */
const STAR_ROWS = [
  '....#....',
  '...###...',
  '#########',
  '.#######.',
  '..#####..',
  '..##.##..',
  '.##...##.',
];
const STAR_PATH = STAR_ROWS.flatMap((row, y) =>
  [...row].map((c, x) => (c === '#' ? `M${x} ${y}h1v1h-1z` : '')),
).join('');
export const pixelStar = (cls = '') =>
  `<svg class="pxstar ${cls}" viewBox="0 0 9 7" shape-rendering="crispEdges" aria-hidden="true"><path d="${STAR_PATH}" fill="currentColor"/></svg>`;
