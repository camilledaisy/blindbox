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
| 019 Cheese             | rare    | `029-cheese.webp` ✓ |
| 020 Looking Down On You | common  | `030-looking-down-on-you.webp` ✓ |
| 021 Weebcam            | common  | `031-weebcam.webp` ✓ |
| 022 Meh                | common  | `032-meh.webp` ✓ |
| 023 Smirk              | rare    | `033-smirk.webp` ✓ |
| 024 Diva               | ultra   | `034-diva.webp` ✓ |
| 025 Snapcam            | common  | `035-snapcam.webp` ✓ |
| 026 Fakecry            | common  | `036-fakecry.webp` ✓ |
| 027 Tata               | common  | `037-tata.webp` ✓ |
| 028 Peepeepoopoo       | common  | `038-peepeepoopoo.webp` ✓ |
| 029 Tortle             | common  | `039-tortle.webp` ✓ |
| 030 Devil              | common  | `040-devil.webp` ✓ |
| 031 Hotelcam           | common  | `041-hotelcam.webp` ✓ |
| 032 ABG Cam            | ultra   | `042-abg-cam.webp` ✓ |
| 033 Prom               | common  | `043-prom.webp` ✓ |
| 034 ABG Cam 2          | rare    | `044-abg-cam-2.webp` ✓ |
| 035 Real Cry           | rare    | `045-real-cry.webp` ✓ |
| 036 Smileycam          | ultra   | `046-smileycam.webp` ✓ |
| 037 Heartcam           | common  | `047-heartcam.webp` ✓ |
| 038 Callum             | rare    | `048-callum.webp` ✓ |
| 039 Eh                 | common  | `049-eh.webp` ✓ |
| 040 Body Tea           | rare    | `050-body-tea.webp` ✓ |
| 041 First Night In Canada Cam | ultra   | `051-first-night-in-canada-cam.webp` ✓ |
| 042 School Cam         | common  | `052-school-cam.webp` ✓ |
| 043 Big Cam            | ultra   | `053-big-cam.webp` ✓ |
| 044 Swagcam            | common  | `054-swagcam.webp` ✓ |
| 045 CNE Cam            | common  | `055-cne-cam.webp` ✓ |
| 046 18th               | rare    | `056-18th.webp` ✓ |
| 047 Honey              | ultra   | `057-honey.webp` ✓ |
| 048 Gamercam           | common  | `058-gamercam.webp` ✓ |
| 049 Josh               | ultra   | `059-josh.webp` ✓ |
| 050 Blur               | common  | `060-blur.webp` ✓ |
| 051 Ouch               | rare    | `061-ouch.webp` ✓ |
| 052 Sari Sari          | common  | `062-sari-sari.webp` ✓ |
| 053 Birthdaycam        | ultra   | `063-birthdaycam.webp` ✓ |
| 054 Princess           | rare    | `064-princess.webp` ✓ |
| 055 Princess 2.0       | ultra   | `065-princess-2.webp` ✓ |
| 056 Who’s That?        | common  | `066-whos-that.webp` ✓ |
| 057 Daisy              | common  | `067-daisy.webp` ✓ |
| 058 IKEA Cam           | common  | `068-ikea-cam.webp` ✓ |
| 059 Shades             | common  | `069-shades.webp` ✓ |
| 060 Tiny               | common  | `070-tiny.webp` ✓ |
| 061 Cozycam            | common  | `071-cozycam.webp` ✓ |
| ??? ERROR CAMILLE      | error   | `err-error-camille.jpg`  |

Tips
- Portrait-ish photos (roughly 4:3 tall or square) crop best.
- About 800px wide is plenty. Smaller files load faster at the party.
- If the crop cuts off a face, add `imagePosition: '50% 20%'` to that card (the first number is horizontal, the second vertical).
- `.png`, `.webp` and `.jpeg` work too. Just match the path in `cards.js`.
