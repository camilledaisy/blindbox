// ============================================================================
//  THE CARDS
//  Add, remove or edit cards here — the whole site updates automatically.
//
//  Fields:
//    id            unique string (used to remember what people collected — don't
//                  change it after the party starts or people lose that card)
//    no            number printed on the card
//    name          card name
//    rarity        'common' | 'uncommon' | 'rare' | 'ultra' | 'secret'  (see config.js)
//    image         path to the photo. Drop your photo at this path and it replaces
//                  the placeholder automatically. Portrait-ish photos crop best.
//    imagePosition optional CSS object-position to fine-tune the crop, e.g. '50% 20%'
//    description   the funny quote
//    era           year or era label
//    stats         any 1–4 stats. Numbers (0–100) draw a bar; strings are shown as-is.
//    color         card accent / placeholder colour
//    emoji         shown on the placeholder until you add a photo
//    weight        optional: relative chance WITHIN its rarity (default 1)
// ============================================================================

export const CARDS = [
  {
    id: '001',
    no: '001',
    name: 'Baby Camille',
    rarity: 'common',
    image: 'images/cards/001-baby-camille.jpg',
    description: 'Has not yet learned to read. Is already judging you.',
    era: 'The Early Years',
    stats: { Cuteness: 99, 'Nap Power': 88, Chaos: 61, Teeth: 2 },
    color: '#ffd6a5',
    emoji: '🍼',
  },
  {
    id: '002',
    no: '002',
    name: 'Birthday Camille',
    rarity: 'common',
    image: 'images/cards/002-birthday-camille.jpg',
    description: 'Appears once a year. Demands cake. Is legally the main character today.',
    era: '2026',
    stats: { Party: 95, 'Cake Intake': 100, Humility: 12, Luck: 80 },
    color: '#ffc8dd',
    emoji: '🎂',
  },
  {
    id: '003',
    no: '003',
    name: 'Bookstore Camille',
    rarity: 'uncommon',
    image: 'images/cards/003-bookstore-camille.jpg',
    description: 'Said she would “just look.” Left with nine books and a new tote bag.',
    era: '2026',
    stats: { Browsing: 99, 'Self-Control': 8, 'Tote Bags': 76, 'Wallet HP': 14 },
    color: '#cde7b0',
    emoji: '📚',
  },
  {
    id: '004',
    no: '004',
    name: 'Gamer Camille',
    rarity: 'uncommon',
    image: 'images/cards/004-gamer-camille.jpg',
    description: 'One more run. (It is 3:47 AM.)',
    era: '2026',
    stats: { Reflexes: 82, Sleep: 11, 'Trash Talk': 70, 'Side Quests': 100 },
    color: '#bde0fe',
    emoji: '🎮',
  },
  {
    id: '005',
    no: '005',
    name: 'The Bookworm',
    rarity: 'rare',
    image: 'images/cards/005-bookworm-camille.jpg',
    description: 'Will disappear for several hours and return emotionally devastated by a fictional character.',
    era: '2026',
    stats: { Reading: 98, 'Social Battery': 34, Yearning: 100, Luck: 67 },
    color: '#e9c8ff',
    emoji: '🐛',
  },
  {
    id: '006',
    no: '006',
    name: 'UX Researcher Camille',
    rarity: 'rare',
    image: 'images/cards/006-ux-researcher-camille.jpg',
    description: 'Will ask “and how did that make you feel?” about a door handle.',
    era: '2026',
    stats: { Empathy: 96, 'Sticky Notes': 100, Insights: 91, 'It Depends': 'Always' },
    color: '#fff3a3',
    emoji: '🔍',
  },
  {
    id: '007',
    no: '007',
    name: 'Going Out Camille',
    rarity: 'ultra',
    image: 'images/cards/007-going-out-camille.jpg',
    description: 'Rare nocturnal form. Only appears when the outfit is perfect and the group chat agrees.',
    era: 'After Dark',
    stats: { Outfit: 100, Dance: 88, 'Social Battery': 100, 'Ride Home': 3 },
    color: '#ff9ecf',
    emoji: '🪩',
  },
  {
    id: '008',
    no: '008',
    name: 'Daisy',
    rarity: 'ultra',
    image: 'images/cards/008-daisy.jpg',
    description: 'Not technically a Camille. Somehow still the most requested card in the set.',
    era: 'Always',
    stats: { Charm: 100, Sunshine: 96, Mystery: 88, Loyalty: 100 },
    color: '#fff1b8',
    emoji: '🌼',
  },
  {
    id: '009',
    no: '009',
    name: 'Childhood Throwback',
    rarity: 'secret',
    image: 'images/cards/009-childhood-throwback.jpg',
    description: 'Recovered from a family photo album. Handle with extreme nostalgia.',
    era: 'Pre-Y2K',
    stats: { Nostalgia: 100, Imagination: 99, 'Juice Boxes': 88, 'Bowl Cut Risk': 64 },
    color: '#a0e7e5',
    emoji: '📼',
  },
  {
    id: '010',
    no: '010',
    name: 'Legendary Camille',
    rarity: 'secret',
    image: 'images/cards/010-legendary-camille.jpg',
    description: 'The final form. Witnesses report a faint glow and a sudden urge to wish her happy birthday.',
    era: 'Eternal',
    stats: { Power: 100, Grace: 100, Aura: 100, Birthday: '∞' },
    color: '#ffd166',
    emoji: '👑',
  },
  {
    id: '011',
    no: '011',
    name: 'Derpmille',
    rarity: 'rare',
    image: 'images/cards/011-derpmille.jpg',
    imagePosition: '45% 30%',
    description: 'Was told to smile for the photo. Chose chaos instead. Has not changed since.',
    era: 'The Early Years',
    stats: { Derp: 100, Cuteness: 99, 'Pose Game': 12, Mischief: 87 },
    color: '#ffc8dd',
    emoji: '🤪',
  },
];

/** Joke cards that only drop via ODDS.error in config.js. */
export const SPECIAL_CARDS = [
  {
    id: 'err',
    no: '???',
    name: 'ERROR CAMILLE',
    rarity: 'error',
    image: 'images/cards/err-error-camille.jpg',
    description: 'This Camille was not supposed to be here.',
    era: 'NULL',
    stats: { HP: 'NaN', Luck: '404', Vibes: '▓▓▓', Exists: '???' },
    color: '#39ff88',
    emoji: '👾',
  },
];
