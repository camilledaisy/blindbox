// The blind-box opening sequence + "YOU PULLED..." screen.
// This is the centerpiece: every phase escalates with the (still hidden) rarity tier.
import { h, $, rand, replayClass, reducedMotion } from '../lib/dom.js';
import { MESSAGES, ODDS } from '../config.js';
import { roll, rarityById, chanceOf, fmtOneIn, cardById } from '../lib/gacha.js';
import { store } from '../lib/store.js';
import { sfx } from '../lib/sfx.js';
import { ParticleField } from '../lib/particles.js';
import { attachTilt } from '../lib/tilt.js';
import { toast } from '../lib/ui.js';
import { saveCardImage } from '../lib/cardImage.js';
import { BlindBox } from './BlindBox.js';
import { Card } from './Card.js';
import { RarityBadge } from './RarityBadge.js';

const TAU = Math.PI * 2;
const RAINBOW = ['#ff5e7e', '#ffb13b', '#ffe45e', '#5ee6a0', '#5ec8ff', '#a47bff', '#ff7eea'];
const GLITCH = ['#39ff88', '#ff2bd6', '#28e0ff', '#ffffff'];

// Per-tier choreography. Index = rarity tier (0 common … 4 secret, 5 error).
const FX = [
  { glow: '#fffaf0', dim: 0.8, shake: [1.5, 4.5], dur: 1000, colors: ['#ffffff', '#fff3cf'] },
  { glow: '#9ff5c8', dim: 0.84, shake: [1.5, 5.5], dur: 1150, colors: ['#9ff5c8', '#ffffff', '#d8ffe9'] },
  { glow: '#ffd95a', dim: 0.87, shake: [2, 7], dur: 1300, colors: ['#ffd95a', '#fff6c2', '#ffffff', '#ffb13b'] },
  { glow: '#ff7eb6', dim: 0.9, shake: [2.5, 9], dur: 1500, colors: ['#ff7eb6', '#ffd95a', '#7ecbff', '#ffffff', '#b9f5d8'] },
  { glow: '#ffffff', dim: 0.93, shake: [3, 10], dur: 1500, colors: RAINBOW },
  { glow: '#39ff88', dim: 0.88, shake: [3, 12], dur: 1500, colors: GLITCH },
];

export function createReveal({ onViewCollection, onClose, getHomeBoxRect }) {
  const box = BlindBox();
  const canvas = h('canvas.stage__particles', { 'aria-hidden': 'true' });
  const flashEl = h('div.stage__flash');
  const head = h('h2.stage__head', {}, h('span', {}, 'YOU PULLED'), h('span.stage__dots', {}, '...'));
  const cardHolder = h('div.stage__card');
  const stickers = h('div.stage__stickers');
  const slot = h('div.stage__slot', {}, box.el, cardHolder, stickers);
  const info = h('div.stage__info', { 'aria-live': 'polite' });
  const content = h('div.stage__content', {}, head, slot, info);
  const hint = h('p.stage__hint', { 'aria-hidden': 'true' });

  const skipBtn = h('button.chip.stage__skip', { type: 'button', onClick: () => (skipping = true) }, 'SKIP ▸▸');
  const closeBtn = h('button.chip.stage__close', { type: 'button', 'aria-label': 'Back to the box', onClick: close }, '✕ BACK');
  const muteBtn = h('button.chip.stage__mute', { type: 'button', onClick: () => sfx.toggle() });
  const syncMute = () => {
    muteBtn.textContent = sfx.isMuted() ? '♪ OFF' : '♪ ON';
    muteBtn.setAttribute('aria-label', sfx.isMuted() ? 'Unmute sounds' : 'Mute sounds');
  };
  sfx.subscribe(syncMute);
  syncMute();

  const el = h(
    'div.stage',
    { 'aria-hidden': 'true', 'data-phase': 'idle' },
    h('div.stage__dim'),
    h('div.stage__rays'),
    content,
    hint,
    canvas,
    flashEl,
    h('div.stage__bar', {}, closeBtn, h('div.stage__bar-r', {}, skipBtn, muteBtn)),
  );
  const particles = new ParticleField(canvas);

  let busy = false;
  let skipping = false;
  let untilt = null;
  let current = null;
  let rainTimer = 0;

  const wait = (ms) => new Promise((r) => setTimeout(r, skipping ? Math.min(ms, 20) : ms));
  const phase = (p) => (el.dataset.phase = p);
  const boxPoint = (fy = 0.5) => {
    const r = box.el.querySelector('.bbox__rig').getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height * fy, r };
  };
  const slotPoint = () => {
    const r = slot.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, r };
  };

  function flash(strength = 1) {
    if (skipping) return;
    flashEl.style.setProperty('--flash', reducedMotion() ? strength * 0.4 : strength);
    replayClass(flashEl, 'is-flashing');
  }
  const quake = () => !reducedMotion() && replayClass(content, 'is-quaking');

  // ---------------------------------------------------------------- particles
  function dust(tier) {
    const { x, r } = boxPoint();
    particles.burst({
      x, y: r.bottom - 8, count: 2 + tier, type: 'dot', colors: ['#fff8e0', '#ffe9a8', '#ffffff'],
      speed: 2.2, spread: Math.PI * 0.9, gravity: 0.015, life: [25, 45], size: [1.5, 3.5], jitter: r.width / 3,
    });
    if (tier >= 2) {
      particles.burst({
        x, y: r.top + r.height / 2, count: tier - 1, type: 'star', colors: FX[tier].colors,
        speed: 1.2, gravity: -0.01, life: [30, 55], size: [3, 6], jitter: r.width * 0.75,
      });
    }
    if (tier === 5) {
      particles.burst({ x, y: r.top + r.height / 2, count: 4, type: 'pixel', colors: GLITCH, speed: 3, gravity: 0, life: [10, 25], size: [3, 8], jitter: r.width * 0.7 });
    }
  }

  function lidBurst(tier) {
    const { x, y } = boxPoint(0.15);
    const c = FX[tier].colors;
    const up = -Math.PI / 2;
    particles.ring({ x, y, color: c[0], size: 140 + tier * 50, life: 36 });
    switch (tier) {
      case 0:
        particles.burst({ x, y, count: 26, type: 'dot', colors: c, speed: 5, life: [30, 55] });
        break;
      case 1:
        particles.burst({ x, y, count: 38, type: 'dot', colors: c, speed: 6, life: [30, 60] });
        particles.burst({ x, y, count: 10, type: 'star', colors: c, speed: 5, size: [3, 6], life: [40, 70] });
        break;
      case 2:
        particles.burst({ x, y, count: 55, type: 'star', colors: c, speed: 8, size: [3, 7], life: [40, 80], gravity: 0.05 });
        particles.burst({ x, y, count: 24, type: 'dot', colors: c, speed: 6 });
        setTimeout(() => particles.ring({ x, y, color: '#fff6c2', size: 260, life: 42 }), 120);
        break;
      case 3:
        particles.burst({ x, y, count: 150, type: 'confetti', colors: c, speed: 13, spread: TAU * 0.8, angle: up, gravity: 0.17, size: [4, 8], life: [70, 120] });
        particles.burst({ x, y, count: 60, type: 'star', colors: c, speed: 9, size: [3, 8], life: [50, 90] });
        [0, 110, 220].forEach((d, i) => setTimeout(() => particles.ring({ x, y, color: c[i], size: 220 + i * 90, life: 44 }), d));
        break;
      case 4:
        particles.burst({ x, y, count: 260, type: 'confetti', colors: c, speed: 16, spread: TAU, angle: up, gravity: 0.16, size: [4, 9], life: [80, 140] });
        particles.burst({ x, y, count: 120, type: 'star', colors: ['#ffffff', ...c], speed: 11, size: [3, 9], life: [60, 110] });
        c.forEach((col, i) => setTimeout(() => particles.ring({ x, y, color: col, size: 180 + i * 70, life: 50, width: 8 }), i * 70));
        fountain(x, y, 1600, c);
        break;
      case 5:
        particles.burst({ x, y, count: 170, type: 'pixel', colors: GLITCH, speed: 10, gravity: 0, drag: 0.94, size: [3, 10], life: [30, 70] });
        break;
    }
  }

  function fountain(x, y, ms, colors) {
    const t0 = performance.now();
    const tick = () => {
      if (performance.now() - t0 > ms || skipping) return;
      particles.burst({ x, y, count: 6, type: 'star', colors, speed: 9, spread: 1.2, angle: -Math.PI / 2, gravity: 0.2, size: [3, 7], life: [50, 80] });
      requestAnimationFrame(tick);
    };
    tick();
  }

  function revealBurst(tier) {
    const { x, y, r } = slotPoint();
    const c = FX[tier].colors;
    particles.burst({ x, y, count: 18 + tier * 22, type: tier === 5 ? 'pixel' : 'star', colors: c, speed: 5 + tier * 1.6, size: [2, 6], life: [35, 70], gravity: 0.03, jitter: r.width * 0.3 });
    particles.ring({ x, y, color: c[0], size: r.width * 0.9, life: 34 });
  }

  function rain(ms, colors, type = 'confetti') {
    clearInterval(rainTimer);
    const t0 = performance.now();
    rainTimer = setInterval(() => {
      if (performance.now() - t0 > ms || el.dataset.phase === 'idle') return clearInterval(rainTimer);
      particles.burst({
        x: rand(0, innerWidth), y: -20, count: 3, type, colors, speed: 2, spread: 0.8, angle: Math.PI / 2,
        gravity: 0.06, drag: 0.99, size: [4, 7], life: [140, 200], spin: 0.15,
      });
    }, 70);
  }

  // ---------------------------------------------------------------- lifecycle
  function resetStage() {
    clearInterval(rainTimer);
    untilt?.();
    untilt = null;
    particles.clear();
    box.reset();
    cardHolder.replaceChildren();
    cardHolder.className = 'stage__card';
    stickers.replaceChildren();
    info.replaceChildren();
    hint.textContent = '';
    el.classList.remove('is-rainbow', 'is-error');
    el.style.removeProperty('--glow');
    head.classList.remove('is-shown');
    info.classList.remove('is-shown');
    skipBtn.hidden = false;
  }

  function show() {
    el.classList.add('is-active');
    el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('stage-open');
  }

  function close() {
    if (busy) skipping = true;
    sfx.play('click');
    el.classList.remove('is-active');
    el.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('stage-open');
    setTimeout(() => {
      phase('idle');
      resetStage();
    }, 300);
    onClose?.();
  }

  /** Run the full opening sequence. `fromRect` = home-page box position for a smooth hand-off. */
  async function open(fromRect) {
    if (busy) return;
    busy = true;
    skipping = false;

    // ?preview=<card id>[&shiny] forces a card so you can test photos/animations.
    // Preview pulls are NOT saved to the collection.
    const params = new URLSearchParams(location.search);
    const previewCard = params.has('preview') && cardById(params.get('preview'));
    const boost = !previewCard && !!store.flag('luckyCharm');
    const pull = previewCard ? { card: previewCard, shiny: params.has('shiny') } : roll({ boost });
    if (boost) store.setFlag('luckyCharm', false);
    const rarity = rarityById(pull.card.rarity);
    const tier = rarity.tier;
    const fx = FX[tier];
    const owned = store.owned(pull.card.id);
    const rec = previewCard
      ? { isNew: !owned, isNewShiny: false, count: owned?.count ?? 0, pullNo: store.get().pulls, preview: true }
      : store.record(pull.card, pull.shiny);
    current = pull;

    resetStage();
    phase('intro');
    el.dataset.tier = '0';
    show();
    sfx.play('open');
    if (boost) toast('Lucky charm activated ✦ boosted odds!', { icon: '🍀' });

    // 1 — the box flies from the home screen to centre stage
    if (fromRect) {
      const to = box.el.getBoundingClientRect();
      const dx = fromRect.left + fromRect.width / 2 - (to.left + to.width / 2);
      const dy = fromRect.top + fromRect.height / 2 - (to.top + to.height / 2);
      const s = fromRect.width / to.width || 1;
      box.el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${s})` }, { transform: 'none' }], {
        duration: 550, easing: 'cubic-bezier(.2,.9,.25,1)',
      });
    } else {
      replayClass(box.el, 'is-entering');
    }
    await wait(600);

    // 2 — shaking (+ 3. particles leaking out, escalating with tier)
    hint.textContent = pick(['*rattle rattle*', 'something is moving...', 'here it comes...']);
    sfx.play('whoosh');
    if (tier === 5) box.setGlitch(true);
    await box.shake({
      duration: fx.dur,
      from: fx.shake[0],
      to: fx.shake[1],
      shouldStop: () => skipping,
      onTick: (i) => {
        sfx.play('rattle');
        if (i % 2 === 0) dust(Math.min(tier, 3));
      },
    });

    // Secret rare & error get a fake-out: it settles… then goes feral.
    if (tier >= 4) {
      hint.textContent = '...?';
      await wait(750);
      sfx.play('heartbeat');
      await wait(450);
      hint.textContent = tier === 5 ? 'ERR0R: box.exe has stopped responding' : 'wait... WAIT';
      if (tier === 5) {
        sfx.play('glitch');
        document.documentElement.classList.add('is-glitch-screen');
      }
      await box.shake({
        duration: 1300, from: 7, to: 15, shouldStop: () => skipping,
        onTick: (i) => {
          sfx.play('rattle');
          dust(tier);
          if (tier === 4 && i % 3 === 0) sfx.play('sparkle');
        },
      });
      document.documentElement.classList.remove('is-glitch-screen');
    }
    hint.textContent = '';

    // 4 — the screen darkens
    el.style.setProperty('--dim', fx.dim);
    phase('dark');
    sfx.play('dim');
    await wait(550);

    // 5 — a glow from inside the box
    el.dataset.tier = String(tier);
    el.style.setProperty('--glow', fx.glow);
    el.classList.toggle('is-rainbow', tier === 4);
    el.classList.toggle('is-error', tier === 5);
    box.setGlow(fx.glow, { rainbow: tier === 4, glitch: tier === 5 });
    sfx.play('charge', Math.min(tier, 4));
    if (tier >= 2) dust(tier);
    await wait(700 + Math.min(tier, 4) * 180);

    // lid pops off, burst
    phase('burst');
    box.open();
    sfx.play('pop');
    lidBurst(tier);
    if (tier >= 3) {
      flash(tier === 3 ? 0.8 : 1);
      sfx.play('flash');
      quake();
    }
    if (tier === 4) setTimeout(() => flash(0.9), 380);
    if (tier === 5) {
      sfx.play('glitch');
      document.documentElement.classList.add('is-glitch-screen');
      setTimeout(() => document.documentElement.classList.remove('is-glitch-screen'), 650);
    }

    // 6 — the card slowly rises out of the box, face down
    const cardEl = Card(pull.card, { shiny: pull.shiny, withBack: true, faceDown: true });
    cardHolder.append(cardEl);
    await wait(120);
    box.sink();
    cardHolder.classList.add('is-rising');
    head.classList.add('is-shown');
    phase('rise');
    await wait(1100);

    if (tier >= 3 && tier !== 5) {
      cardHolder.classList.add(tier === 4 ? 'is-spinning-lots' : 'is-spinning');
      sfx.play('whoosh');
      await wait(tier === 4 ? 1500 : 950);
    } else {
      await wait(250 + tier * 180);
    }

    // 7 — flip!
    sfx.play('flip');
    cardEl.classList.remove('is-face-down');
    await wait(380);

    // reveal
    phase('result');
    revealBurst(tier);
    sfx.play('reveal', tier);
    if (pull.shiny) setTimeout(() => sfx.play('sparkle'), 250);
    if (tier >= 2 && tier !== 5) flash(0.35 + tier * 0.1);
    if (tier === 5) {
      document.documentElement.classList.add('is-glitch-screen');
      setTimeout(() => document.documentElement.classList.remove('is-glitch-screen'), 500);
    }
    if (tier === 4) rain(4500, RAINBOW);
    else if (tier === 3) rain(2500, fx.colors);
    else if (pull.shiny) rain(1800, ['#ffffff', '#e0f4ff', '#ffe9fb'], 'star');

    renderResult(pull, rarity, rec, cardEl);
    skipBtn.hidden = true;
    busy = false;
    skipping = false;

    const milestone = !rec.preview && MESSAGES.milestones[rec.pullNo];
    if (milestone) setTimeout(() => toast(milestone, { icon: '📦' }), 1400);
  }

  function renderResult(pull, rarity, rec, cardEl) {
    const { card, shiny } = pull;
    const chance = chanceOf(card, { shiny });

    if (rec.isNew) stickers.append(h('span.sticker.sticker--new', {}, 'NEW!'));
    else stickers.append(h('span.sticker.sticker--dupe', {}, `DUPE ×${rec.count}`));
    if (shiny && rec.isNewShiny) stickers.append(h('span.sticker.sticker--shiny', {}, '✦ 1st SHINY'));

    info.replaceChildren(
      h('div.stage__badges', {}, RarityBadge(card.rarity, { size: 'lg', shiny }), shiny && h('span.chip.chip--shiny', {}, MESSAGES.shiny)),
      h('p.stage__msg', { class: `msg-${rarity.id}`, 'data-text': rarity.message }, rarity.message),
      h('p.stage__odds', {}, h('b', {}, fmtOneIn(chance)), ' chance', shiny && h('small', {}, ` · shiny rate ${fmtOneIn(ODDS.shiny)}`)),
      h('p.stage__meta', {}, rec.preview ? 'PREVIEW MODE · not saved to your collection' : [`Box #${rec.pullNo} · `, rec.isNew ? 'added to your Camilledex!' : `you now own ×${rec.count}`]),
      h(
        'div.stage__btns',
        {},
        h('button.btn.btn--ghost', { type: 'button', onClick: () => doSave(card, shiny) }, '⤓ SAVE CARD'),
        h('button.btn.btn--ghost', { type: 'button', onClick: () => { close(); onViewCollection?.(); } }, '▦ VIEW COLLECTION'),
        h('button.btn.btn--go', { type: 'button', onClick: openAnother }, '↻ OPEN ANOTHER'),
      ),
    );
    requestAnimationFrame(() => info.classList.add('is-shown'));
    untilt = attachTilt(cardEl, { max: 20 });
    $('.btn--go', info)?.focus({ preventScroll: true });
  }

  async function doSave(card, shiny) {
    sfx.play('click');
    try {
      await saveCardImage(card, { shiny });
      toast('Card saved! Go flex it in the group chat.', { icon: '⤓' });
    } catch (err) {
      console.warn(err);
      toast('Couldn’t save the image here — try a screenshot!', { icon: '⚠' });
    }
  }

  function openAnother() {
    if (busy) return;
    sfx.play('click');
    phase('intro');
    el.style.setProperty('--dim', 0);
    open(null);
  }

  // stop page scroll from the stage on touch
  el.addEventListener('touchmove', (e) => {
    if (!e.target.closest('.stage__content')) e.preventDefault();
  }, { passive: false });
  document.addEventListener('keydown', (e) => {
    if (!el.classList.contains('is-active')) return;
    if (e.key === 'Escape' && !document.body.classList.contains('has-modal')) close();
    if ((e.key === ' ' || e.key === 'Enter') && busy) {
      e.preventDefault();
      skipping = true;
    }
  });

  return { el, open, close, isBusy: () => busy, current: () => current, getHomeBoxRect };
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
