# ✿ Camille Blind Box

A tiny collectible game for Camille's birthday. Each friend rips open a digital booster pack of 5 **Camille Cards**. The last card is always the rare slot. Collect them all in **THE CAMILLEDEX**.

No build step and no dependencies: it's plain HTML, CSS and JavaScript modules.

## Run it locally

Browsers block JavaScript modules on `file://`, so serve the folder with any static server:

```bash
npx serve .            # or
python3 -m http.server
```

Then open the address it prints (for example http://localhost:3000).

## Put it online (free)

**GitHub Pages:** go to repo **Settings → Pages**, set the source to **Deploy from a branch**, pick the branch and `/ (root)`, and save. Netlify, Vercel or Cloudflare Pages also work: drag and drop the folder, no build command needed.

## Customise

| I want to…                              | Edit                                                   |
| --------------------------------------- | ------------------------------------------------------ |
| Add my photos                           | Drop them in `images/cards/` (see below)               |
| Change card names, quotes, stats, eras  | `js/data/cards.js`                                     |
| Add or remove cards                     | `js/data/cards.js`: the Camilledex updates itself      |
| Change pack size / rarity odds          | `js/config.js` → `PACK`                                |
| Change reveal messages                  | `js/config.js` → `RARITIES`                            |
| Change Shiny / Error Camille odds       | `js/config.js` → `ODDS`                                |
| Change the secret logo message          | `js/config.js` → `SECRET_LOGO`                         |
| Use real sound files                    | Put files in `sounds/`, map them in `SOUND_FILES`      |

### Photos

Each card has an `image` path such as `images/cards/005-bookworm-camille.jpg`. Save your photo with that exact name and it replaces the placeholder automatically. You can also point `image` at any filename you like. Portrait-ish photos crop best. If a face gets cut off, add `imagePosition: '50% 20%'` to that card to move the crop.

### Preview any card

Add `?preview=<id>` to the URL to force the rare-slot card, e.g. `/?preview=010` or `/?preview=003&shiny` or `/?preview=err`. Preview packs are **not** saved to your collection, so you can test photos and animations freely.

## How it works

```
index.html            page shell
css/                  base · pack (booster pack) · card · reveal · dex
js/config.js          rarities, odds, messages, easter-egg text
js/data/cards.js      the card list
js/main.js            routing (#/ and #/dex), nav, wiring
js/components/
  CardPack.js         foil booster pack with a tear-off top strip
  Card.js             the trading card (+ back face, locked silhouette)
  CardReveal.js       the whole pack opening: tear, card stack, rare slot, summary
  CollectionGrid.js   Camilledex grid
  CardDetail.js       big card modal with 3D tilt + holo
  RarityBadge.js      ★★★ RARE badge
  ProgressTracker.js  "7 / 10 discovered" LCD bar
js/lib/
  gacha.js            pack rolls + probability math
  shake.js            shared shake animation
  store.js            collection saved in localStorage
  sfx.js              synthesised sound effects + mute
  particles.js        canvas sparkles / confetti
  cardImage.js        SAVE CARD → PNG (share sheet on phones)
  tilt.js · ui.js · placeholder.js · easterEggs.js
  trade.js            architecture sketch for future trading
```

**Opening a pack:**
1. Drag across the top of the pack to tear it open (or press *Open it for me*).
2. The cards slide out. Swipe or tap through cards 1–4 (mostly Common/Uncommon, sometimes a Rare).
3. Card 5 is the **rare slot** (Rare or better). It comes out face-down and charges up. The stronger the glow, shake and darkness, the rarer it is. Secret Rares fake you out first. Tap to flip it.
4. See the whole pack fanned out, and tap any card for a closer look.

The light that spills out when you tear the pack is also a hint: pink or rainbow means something big.

**Trading (later):** every pull is stored as its own copy with a unique `uid` in `store.log`, and each friend can already save a collector name. `js/lib/trade.js` explains the planned offer and transport design.

## Easter eggs (spoilers!)

<details>
<summary>Reveal</summary>

- Click the logo 5 times fast → secret message + a 🍀 lucky charm (3× Ultra/Secret odds in the next pack)
- Poke the pack on the home screen
- Type `daisy`, `cake`, `camille` or `birthday` anywhere
- Konami code (↑↑↓↓←→←→BA) → 1989 handheld mode
- ERROR CAMILLE: a 1-in-300 glitched joke card in the rare slot
- Shiny variants of any card (1 in 32)
- Milestone messages as you open more boxes
</details>
