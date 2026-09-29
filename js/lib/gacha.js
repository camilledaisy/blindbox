// Pull logic + probability math. Pure functions over config + card data.
import { RARITIES, HIDDEN_RARITIES, ODDS } from '../config.js';
import { CARDS, SPECIAL_CARDS } from '../data/cards.js';

export const ALL_RARITIES = [...RARITIES, ...HIDDEN_RARITIES];
export const ALL_CARDS = [...CARDS, ...SPECIAL_CARDS];

export const rarityById = (id) => ALL_RARITIES.find((r) => r.id === id) ?? RARITIES[0];
export const cardById = (id) => ALL_CARDS.find((c) => c.id === id);
export const isSpecial = (card) => SPECIAL_CARDS.includes(card);

const cardWeight = (c) => c.weight ?? 1;

/** Rarities that actually have cards, with their (optionally boosted) weight. */
function rollableRarities(boost = false) {
  return RARITIES.filter((r) => CARDS.some((c) => c.rarity === r.id)).map((r) => ({
    rarity: r,
    weight: r.weight * (boost && r.tier >= 2 ? ODDS.luckyCharmBoost : 1),
  }));
}

function pickWeighted(items, getWeight) {
  const total = items.reduce((s, it) => s + getWeight(it), 0);
  let n = Math.random() * total;
  for (const it of items) {
    n -= getWeight(it);
    if (n <= 0) return it;
  }
  return items[items.length - 1];
}

/**
 * Open one blind box.
 * @returns {{ card, shiny: boolean }}
 */
export function roll({ boost = false } = {}) {
  if (SPECIAL_CARDS.length && Math.random() < ODDS.error) {
    return { card: pickWeighted(SPECIAL_CARDS, cardWeight), shiny: false };
  }
  const { rarity } = pickWeighted(rollableRarities(boost), (x) => x.weight);
  const pool = CARDS.filter((c) => c.rarity === rarity.id);
  const card = pickWeighted(pool, cardWeight);
  return { card, shiny: Math.random() < ODDS.shiny };
}

/** Probability (0..1) of pulling this card (any variant), or its shiny variant. */
export function chanceOf(card, { shiny = false } = {}) {
  if (isSpecial(card)) {
    const total = SPECIAL_CARDS.reduce((s, c) => s + cardWeight(c), 0);
    return ODDS.error * (cardWeight(card) / total);
  }
  const rarities = rollableRarities();
  const total = rarities.reduce((s, x) => s + x.weight, 0);
  const entry = rarities.find((x) => x.rarity.id === card.rarity);
  if (!entry) return 0;
  const pool = CARDS.filter((c) => c.rarity === card.rarity);
  const poolTotal = pool.reduce((s, c) => s + cardWeight(c), 0);
  const p = (1 - (SPECIAL_CARDS.length ? ODDS.error : 0)) * (entry.weight / total) * (cardWeight(card) / poolTotal);
  return shiny ? p * ODDS.shiny : p;
}

/** Normalised chance of each rarity, for the drop-rate table. */
export function rarityOdds() {
  const rarities = rollableRarities();
  const total = rarities.reduce((s, x) => s + x.weight, 0);
  return rarities.map(({ rarity, weight }) => ({
    rarity,
    p: weight / total,
    count: CARDS.filter((c) => c.rarity === rarity.id).length,
  }));
}

export const oneIn = (p) => (p > 0 ? Math.max(1, Math.round(1 / p)) : Infinity);
export const fmtOneIn = (p) => `1 in ${oneIn(p).toLocaleString('en-US')}`;
export const fmtPct = (p) => {
  const pct = p * 100;
  return `${pct >= 1 ? +pct.toFixed(1) : +pct.toFixed(2)}%`;
};
