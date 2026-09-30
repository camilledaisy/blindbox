# Card photos

Drop photos here using these filenames and they replace the placeholders automatically.
Or change the `image` path for a card in `js/data/cards.js`.

| Card | Rarity | Filename |
| --- | --- | --- |
| 001 Derpmille          | rare    | `011-derpmille.webp` ✓ |
| 002 Run Forrest Run    | rare    | `012-run-forrest-run.webp` ✓ |
| 003 Spidercam          | rare    | `013-spidercam.webp` ✓ |
| 004 Karatecam          | rare    | `014-karatecam.webp` ✓ |
| 005 Spongeybob         | common  | `015-spongeybob.webp` ✓ |
| 006 Tomato             | common  | `016-tomato.webp` ✓ |
| 007 Twin               | common  | `017-twin.webp` ✓ |
| 008 Middle School Cam  | common  | `018-middle-school-cam.webp` ✓ |
| 009 Coconut            | common  | `019-coconut.webp` ✓ |
| 010 Okaay Eyebrows     | rare    | `020-okaay-eyebrows.webp` ✓ |
| 011 Mwah Mwah          | rare    | `021-mwah-mwah.webp` ✓ |
| 012 Gang               | common  | `022-gang.webp` ✓ |
| 013 Glasses            | common  | `023-glasses.webp` ✓ |
| 014 Just Standing      | common  | `024-just-standing.webp` ✓ |
| 015 Album Cover        | rare    | `025-album-cover.webp` ✓ |
| 016 Chicken            | rare    | `026-chicken.webp` ✓ |
| 017 Uncanny Valley     | common  | `027-uncanny-valley.webp` ✓ |
| 018 Braces             | common  | `028-braces.webp` ✓ |
| ??? ERROR CAMILLE      | error   | `err-error-camille.jpg`  |

Tips
- Portrait-ish photos (roughly 4:3 tall or square) crop best.
- About 800px wide is plenty. Smaller files load faster at the party.
- If the crop cuts off a face, add `imagePosition: '50% 20%'` to that card (the first number is horizontal, the second vertical).
- `.png`, `.webp` and `.jpeg` work too. Just match the path in `cards.js`.
