// ============================================================================
//  CAMILLE BLIND BOX — CONFIG
//  Everything you're likely to want to tweak lives in this file.
//  (Cards themselves live in js/data/cards.js.)
// ============================================================================

export const SET = {
  name: 'Camille Blind Box',
  code: 'CBB',
  edition: "BDAY '26",
  series: 'SERIES 01',
};

/**
 * RARITY TABLE
 * - `weight` is the pull chance in percent. Weights are normalised, so they
 *   don't strictly have to add up to 100, but it's easier to reason about.
 * - `tier` controls how dramatic the opening animation gets (0 = chill → 4 = chaos).
 * - `message` is the line shown on the reveal screen.
 * - If a rarity has no cards in cards.js it's skipped automatically.
 */
export const RARITIES = [
  { id: 'common',   label: 'Common',      stars: 1, weight: 45, tier: 0, message: 'Classic Camille.' },
  { id: 'uncommon', label: 'Uncommon',    stars: 2, weight: 30, tier: 1, message: 'Ooh, a little upgrade.' },
  { id: 'rare',     label: 'Rare',        stars: 3, weight: 15, tier: 2, message: 'Okayyyy, good pull.' },
  { id: 'ultra',    label: 'Ultra Rare',  stars: 4, weight: 8,  tier: 3, message: 'WAIT. YOU ACTUALLY GOT THIS ONE?' },
  { id: 'secret',   label: 'Secret Rare', stars: 5, weight: 2,  tier: 4, message: 'NO WAY.' },
];

/** Rarities that never come from the normal roll (see ODDS.error). */
export const HIDDEN_RARITIES = [
  { id: 'error', label: '???', stars: 0, weight: 0, tier: 5, message: 'Uh... that one was not supposed to drop.' },
];

export const ODDS = {
  /** Chance that ANY pull turns into Error Camille instead. 1/300 ≈ 0.33% */
  error: 1 / 300,
  /** Chance that a normal card comes out as its Shiny variant. 1/32 ≈ 3% */
  shiny: 1 / 32,
  /** Lucky charm (hidden easter egg) multiplies Rare-and-up weights by this for one pull. */
  luckyCharmBoost: 3,
};

export const MESSAGES = {
  shiny: '✦ SHINY VARIANT ✦',
  // Toasts shown after N total boxes opened.
  milestones: {
    1: 'First box! Welcome to the Camille economy.',
    5: '5 boxes opened. Camille is flattered.',
    10: '10 boxes. This is a normal amount of Camille.',
    25: '25 boxes?? Please drink some water.',
    50: '50 boxes. You are legally Camille’s biggest fan.',
    100: '100 BOXES. Seek help (the help is more Camille).',
  },
  // Speech bubbles when you poke the box on the home screen.
  boxPokes: [
    'hey!! no peeking',
    'shake me gently...',
    'it’s camille’s birthday!',
    'i might be a rare one ✦',
    'there’s a camille in here',
    'ok that tickles',
    'press the big button!!',
    '*rattle rattle*',
  ],
};

/** Click the logo this many times for the secret message. */
export const SECRET_LOGO = {
  clicks: 5,
  title: 'SECRET UNLOCKED',
  lines: [
    'Congratulations. You have clicked the logo an unreasonable number of times.',
    'Official notice from the Camille Blind Box Company: Camille is the main character today. Please act accordingly.',
    'As a reward, your next box has a ✦ LUCKY CHARM ✦ (boosted odds for Rare and up).',
  ],
};

/**
 * OPTIONAL SOUND FILES
 * Every sound is synthesised by default, so nothing is required here.
 * To use your own audio, drop a file in /sounds and map it, e.g.
 *   reveal: 'sounds/reveal.mp3',
 * Names: click, rattle, whoosh, dim, charge, pop, flash, flip, sparkle,
 *        poke, heartbeat, reveal, glitch, secret, open
 */
export const SOUND_FILES = {
  // reveal: 'sounds/reveal.mp3',
};

export const STORAGE_KEY = 'camille-blind-box/v1';
