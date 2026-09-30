# Card photos

Drop photos here using these filenames and they replace the placeholders automatically.
Or change the `image` path for a card in `js/data/cards.js`.

## The 25-card set

| Card | Rarity | File |
| --- | --- | --- |
| 001 Honey                    | ultra   | `057-honey.webp` |
| 002 Sari Sari                | common  | `062-sari-sari.webp` |
| 003 Ouch                     | rare    | `061-ouch.webp` |
| 004 Who’s That?              | common  | `066-whos-that.webp` |
| 005 Birthdaycam              | ultra   | `063-birthdaycam.webp` |
| 006 Body Tea                 | rare    | `050-body-tea.webp` |
| 007 First Night In Canada Cam | secret  | `051-first-night-in-canada-cam.webp` |
| 008 Swagcam                  | common  | `054-swagcam.webp` |
| 009 Big Cam                  | ultra   | `053-big-cam.webp` |
| 010 Tiny                     | common  | `070-tiny.webp` |
| 011 School Cam               | common  | `052-school-cam.webp` |
| 012 Gang                     | common  | `022-gang.webp` |
| 013 Karatecam                | rare    | `014-karatecam.webp` |
| 014 Middle School Cam        | common  | `018-middle-school-cam.webp` |
| 015 Braces                   | common  | `028-braces.webp` |
| 016 Derpmille                | rare    | `011-derpmille.webp` |
| 017 Chicken                  | rare    | `026-chicken.webp` |
| 018 Okaay Eyebrows           | rare    | `020-okaay-eyebrows.webp` |
| 019 Tortle                   | common  | `039-tortle.webp` |
| 020 Diva                     | ultra   | `034-diva.webp` |
| 021 18th                     | rare    | `056-18th.webp` |
| 022 Prom                     | common  | `043-prom.webp` |
| 023 Gamercam                 | common  | `058-gamercam.webp` |
| 024 Smileycam                | secret  | `046-smileycam.webp` |
| 025 IKEA Cam                 | common  | `068-ikea-cam.webp` |
| ??? ERROR CAMILLE | error | `err-error-camille.jpg` (glitch art, no photo needed) |

## Retired photos

Not in the set. Move a card from `RETIRED_CARDS` into `CARDS` in `js/data/cards.js` to bring it back.

Run Forrest Run, Spidercam, Spongeybob, Tomato, Twin, Coconut, Mwah Mwah, Glasses, Just Standing, Album Cover, Uncanny Valley, Cheese, Looking Down On You, Weebcam, Meh, Smirk, Snapcam, Fakecry, Tata, Peepeepoopoo, Devil, Hotelcam, ABG Cam, ABG Cam 2, Real Cry, Heartcam, Callum, Eh, CNE Cam, Josh, Blur, Princess, Princess 2.0, Daisy, Shades, Cozycam.

Tips
- Portrait-ish photos (roughly 4:3 tall or square) crop best.
- About 800px wide is plenty. Smaller files load faster at the party.
- If the crop cuts off a face, add `imagePosition: '50% 20%'` to that card (the first number is horizontal, the second vertical).
- `.png`, `.webp` and `.jpeg` work too. Just match the path in `cards.js`.
