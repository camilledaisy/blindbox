// App bootstrap: views, routing, nav, wiring components together.
import { h, $, $$, pick, pixelStar } from './lib/dom.js';
import { MESSAGES, ODDS, RARITIES } from './config.js';
import { CARDS } from './data/cards.js';
import { store } from './lib/store.js';
import { sfx } from './lib/sfx.js';
import { rarityOdds, fmtPct, fmtOneIn } from './lib/gacha.js';
import { toast } from './lib/ui.js';
import { initEasterEggs, logoSecret } from './lib/easterEggs.js';
import { BlindBox } from './components/BlindBox.js';
import { createReveal } from './components/CardReveal.js';
import { CollectionGrid } from './components/CollectionGrid.js';
import { ProgressTracker } from './components/ProgressTracker.js';
import { RarityBadge } from './components/RarityBadge.js';
import { openCardDetail } from './components/CardDetail.js';

// ------------------------------------------------------------------ home
const homeBox = BlindBox();
$('#box-slot').append(homeBox.el);

let pokeBubbleTimer = 0;
homeBox.el.addEventListener('click', () => {
  homeBox.poke();
  sfx.play('poke');
  const bubble = $('#box-bubble');
  bubble.textContent = pick(MESSAGES.boxPokes);
  bubble.classList.remove('is-shown');
  void bubble.offsetWidth;
  bubble.classList.add('is-shown');
  clearTimeout(pokeBubbleTimer);
  pokeBubbleTimer = setTimeout(() => bubble.classList.remove('is-shown'), 1800);
});

const reveal = createReveal({
  onViewCollection: () => (location.hash = '#/dex'),
  onClose: () => document.body.classList.remove('is-opening'),
});
$('#stage-root').append(reveal.el);

$('#open-btn').addEventListener('click', () => {
  if (reveal.isBusy()) return;
  const rect = homeBox.el.getBoundingClientRect();
  document.body.classList.add('is-opening');
  reveal.open(rect);
});

// Drop-rate table (generated from config so it's always accurate).
function renderRates() {
  const rows = rarityOdds().map(({ rarity, p, count }) =>
    h('tr', {}, h('td', {}, RarityBadge(rarity.id, { size: 'sm' })), h('td', {}, fmtPct(p)), h('td', {}, `${count} card${count === 1 ? '' : 's'}`)),
  );
  $('#rates-body').replaceChildren(
    h('table.rates__table', {}, h('tbody', {}, rows)),
    h('p.rates__fine', {}, `✦ Any card can be Shiny: ${fmtOneIn(ODDS.shiny)}.  ✦ Rumour has it something else is in there too…`),
  );
}
renderRates();

// ------------------------------------------------------------------ dex
let dexFilter = 'all';

function renderDex() {
  const s = store.get();
  const discovered = CARDS.filter((c) => store.has(c.id)).length;
  const shinies = Object.values(s.cards).reduce((n, e) => n + (e.shiny > 0 ? 1 : 0), 0);

  const filters = [{ id: 'all', label: 'ALL' }, ...RARITIES.map((r) => ({ id: r.id, label: r.label.toUpperCase() }))];
  const filterBar = h(
    'div.dex-filters',
    { role: 'tablist', 'aria-label': 'Filter by rarity' },
    filters.map((f) =>
      h(
        'button.dex-filter',
        {
          type: 'button',
          role: 'tab',
          class: `f-${f.id}${dexFilter === f.id ? ' is-active' : ''}`,
          'aria-selected': String(dexFilter === f.id),
          onClick: () => {
            dexFilter = f.id;
            sfx.play('click');
            renderDex();
          },
        },
        f.label,
      ),
    ),
  );

  const collectorInput = h('input.trade__input', {
    type: 'text',
    maxlength: '24',
    placeholder: 'your name',
    value: s.collector || '',
    'aria-label': 'Collector name',
    onChange: (e) => {
      store.setCollector(e.target.value.trim());
      toast(`Hi ${e.target.value.trim() || 'mystery collector'}! Name saved.`, { icon: '✎' });
    },
  });

  $('#dex-root').replaceChildren(
    h(
      'div.dex',
      {},
      h(
        'header.dex__head',
        {},
        h('div.dex__lights', { 'aria-hidden': 'true' }, h('i.l-big'), h('i.l-r'), h('i.l-y'), h('i.l-g')),
        h('h1.dex__title', {}, 'THE CAMILLEDEX'),
        h('p.dex__sub', {}, 'Gotta collect every Camille.'),
      ),
      ProgressTracker({ discovered, total: CARDS.length, shinies, pulls: s.pulls }),
      filterBar,
      CollectionGrid({ filter: dexFilter, onOpen: (card) => openCardDetail(card) }),
      h(
        'section.trade',
        {},
        h('div.trade__title', { html: `${pixelStar()} TRADING POST <span class="trade__soon">COMING SOON</span>` }),
        h('p.trade__text', {}, 'Soon you’ll be able to trade duplicate Camilles with friends. Claim your collector name now:'),
        h('label.trade__row', {}, h('span', {}, 'COLLECTOR:'), collectorInput),
      ),
      h(
        'div.dex__foot',
        {},
        s.pulls === 0 && h('a.btn.btn--go', { href: '#/' }, 'OPEN YOUR FIRST BOX →'),
        h(
          'button.linkbtn',
          {
            type: 'button',
            onClick: () => {
              if (confirm('Reset your whole collection? This cannot be undone.')) {
                store.reset();
                toast('Collection reset. A fresh start!', { icon: '↺' });
              }
            },
          },
          'reset collection',
        ),
      ),
    ),
  );
}

// ------------------------------------------------------------------ nav + routing
function updateNav() {
  const discovered = CARDS.filter((c) => store.has(c.id)).length;
  $('#nav-count').textContent = `${discovered}/${CARDS.length}`;
  $('#lucky').hidden = !store.flag('luckyCharm');
}

function route() {
  const view = location.hash.startsWith('#/dex') ? 'dex' : 'home';
  $$('[data-view]').forEach((v) => (v.hidden = v.dataset.view !== view));
  $$('[data-route]').forEach((a) => a.classList.toggle('is-active', a.dataset.route === view));
  $$('[data-route]').forEach((a) => (a.dataset.route === view ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
  if (view === 'dex') renderDex();
  document.body.dataset.page = view;
  window.scrollTo({ top: 0 });
}

window.addEventListener('hashchange', () => {
  sfx.play('click');
  route();
});
store.subscribe(() => {
  updateNav();
  if (document.body.dataset.page === 'dex') renderDex();
});

const muteBtn = $('#mute');
const syncMute = (m = sfx.isMuted()) => {
  muteBtn.classList.toggle('is-muted', m);
  muteBtn.setAttribute('aria-label', m ? 'Unmute sounds' : 'Mute sounds');
  muteBtn.setAttribute('aria-pressed', String(m));
};
muteBtn.addEventListener('click', () => {
  sfx.toggle();
  sfx.play('click');
});
sfx.subscribe(syncMute);
syncMute();

logoSecret($('#logo'));
initEasterEggs();
document.querySelectorAll('[data-count]').forEach((el) => (el.textContent = CARDS.length));
updateNav();
route();
