# Card photos

Drop photos here using these filenames and they replace the placeholders automatically.
Or change the `image` path for a card in `js/data/cards.js`.

| Card                      | Filename                          |
| ------------------------- | --------------------------------- |
| 001 Baby Camille          | `001-baby-camille.jpg`            |
| 002 Birthday Camille      | `002-birthday-camille.jpg`        |
| 003 Bookstore Camille     | `003-bookstore-camille.jpg`       |
| 004 Gamer Camille         | `004-gamer-camille.jpg`           |
| 005 The Bookworm          | `005-bookworm-camille.jpg`        |
| 006 UX Researcher Camille | `006-ux-researcher-camille.jpg`   |
| 007 Going Out Camille     | `007-going-out-camille.jpg`       |
| 008 Daisy                 | `008-daisy.jpg`                   |
| 009 Childhood Throwback   | `009-childhood-throwback.jpg`     |
| 010 Legendary Camille     | `010-legendary-camille.jpg`       |
| 011 Derpmille             | `011-derpmille.webp` ✓            |
| ??? ERROR CAMILLE         | `err-error-camille.jpg`           |

Tips
- Portrait-ish photos (roughly 4:3 tall or square) crop best.
- About 800px wide is plenty. Smaller files load faster at the party.
- If the crop cuts off a face, add `imagePosition: '50% 20%'` to that card (the first number is horizontal, the second vertical).
- `.png`, `.webp` and `.jpeg` work too. Just match the path in `cards.js`.
