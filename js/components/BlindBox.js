import { h, rand, reducedMotion } from '../lib/dom.js';
import { SET } from '../config.js';
import { CARDS } from '../data/cards.js';
import { SILHOUETTE_SVG } from './Card.js';

const face = (cls, ...kids) => h(`div.bbox__face.${cls}`, {}, ...kids);

function FrontArt() {
  return h(
    'div.bb-front',
    {},
    h('div.bb-front__band', {}, `✦ ${SET.edition} ✦ ${SET.series} ✦`),
    h('div.bb-front__logo', {}, h('span', {}, 'Camille')),
    h('div.bb-front__sub', {}, 'Blind Box Collection'),
    h('div.bb-front__window', {}, h('div.bb-front__fig', { html: SILHOUETTE_SVG }), h('span.bb-front__q', {}, '?')),
    h('div.bb-front__jp', {}, 'カミーユ', h('small', {}, 'ブラインドボックス')),
    h('div.bb-front__fine', {}, `全${CARDS.length}種＋シークレット`),
  );
}

function SideArt() {
  return h(
    'div.bb-side',
    {},
    h('div.bb-side__title', {}, 'WHICH ONE WILL YOU GET?'),
    h(
      'div.bb-side__grid',
      {},
      Array.from({ length: 6 }, (_, i) => h('div.bb-side__cell', { html: SILHOUETTE_SVG + `<span>${i === 5 ? '???' : '?'}</span>` })),
    ),
    h('div.bb-side__note', {}, 'Contents are random. Trading encouraged.'),
  );
}

function LeftArt() {
  return h(
    'div.bb-left',
    {},
    h('div.bb-left__warn', {}, 'CAUTION: may contain extreme amounts of Camille'),
    h('div.bb-left__barcode'),
    h('div.bb-left__fine', {}, 'AGES 6+ (EMOTIONALLY)'),
  );
}

/**
 * The 3D blind box.
 * Returns { el, shake(), setGlow(), open(), sink(), reset(), poke() }
 */
export function BlindBox() {
  const rig = h(
    'div.bbox__rig',
    {},
    h(
      'div.bbox__body',
      {},
      face('f-back'),
      face('f-left', LeftArt()),
      face('f-bottom'),
      face('f-right', SideArt()),
      face('f-front', FrontArt()),
      h(
        'div.bbox__lid',
        {},
        face('f-top', h('div.bb-top', {}, h('span.bb-top__seal', {}, 'C'), h('span.bb-top__tear', {}, 'OPEN HERE ↑'))),
        face('lip.lip-front', '— TEAR HERE — TEAR HERE —'),
        face('lip.lip-right'),
        face('lip.lip-left'),
        face('lip.lip-back'),
      ),
    ),
  );
  const glow = h('div.bbox__glow');
  const el = h('div.bbox', {}, h('div.bbox__floor'), glow, rig);

  let raf = 0;

  /** Shake for `duration` ms, intensity ramping from→to (px). Resolves early if shouldStop() is true. */
  function shake({ duration = 1200, from = 2, to = 6, onTick, shouldStop = () => false } = {}) {
    cancelAnimationFrame(raf);
    const scale = reducedMotion() ? 0.3 : 1;
    return new Promise((resolve) => {
      const t0 = performance.now();
      let lastTick = 0;
      let ticks = 0;
      const step = (now) => {
        const k = Math.min(1, (now - t0) / duration);
        if (k >= 1 || shouldStop()) {
          rig.style.transform = '';
          resolve();
          return;
        }
        const amp = (from + (to - from) * k * k) * scale;
        const hop = Math.abs(Math.sin(now / 55)) * amp * 0.6;
        rig.style.transform = `translate(${rand(-amp, amp).toFixed(1)}px, ${(-hop).toFixed(1)}px) rotate(${rand(-amp, amp) * 0.9}deg)`;
        const interval = 120 - k * 60;
        if (now - lastTick > interval) {
          lastTick = now;
          onTick?.(ticks++, k);
        }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
  }

  return {
    el,
    shake,
    setGlow(color, { rainbow = false, glitch = false } = {}) {
      el.style.setProperty('--glow', color);
      el.classList.toggle('glow-rainbow', rainbow);
      el.classList.toggle('glow-glitch', glitch);
      el.classList.add('is-glowing');
    },
    setGlitch(on) {
      el.classList.toggle('is-glitching', on);
    },
    open() {
      el.classList.add('is-open');
    },
    sink() {
      el.classList.add('is-sinking');
    },
    reset() {
      cancelAnimationFrame(raf);
      rig.style.transform = '';
      el.className = 'bbox';
      el.style.removeProperty('--glow');
    },
    poke() {
      el.classList.remove('is-poked');
      void el.offsetWidth;
      el.classList.add('is-poked');
    },
  };
}
