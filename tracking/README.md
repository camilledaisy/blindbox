# Player tracking (Google Sheet + JSON)

When a friend opens the site, they're asked for their name. After that, every
pack they open sends their collection to a Google Sheet you own:

- their name and how many packs they've opened
- every card they have, how many copies, and how many are duplicates

You get a spreadsheet with one row per friend, plus a JSON link you can open
at any time.

## One-time setup (about 5 minutes)

1. Go to **sheets.new** to create a Google Sheet. Name it "Camille Cards".
2. In the sheet, open **Extensions → Apps Script**.
3. Delete what's in the editor, paste in everything from `tracking/Code.gs`,
   and click **Save** (the disk icon).
4. Click **Deploy → New deployment**. Click the gear next to "Select type" and
   choose **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**. Google asks you to authorise it: pick your account, then
   **Advanced → Go to (unsafe)** → **Allow**. It says "unsafe" only because
   you wrote the script yourself and Google hasn't reviewed it.
6. Copy the **Web app URL** (it ends in `/exec`).
7. Paste it into `js/config.js`:

   ```js
   export const TRACKING = {
     endpoint: 'https://script.google.com/macros/s/…/exec',
   };
   ```

8. Commit that change. From then on, every pack is recorded.

## Password for the JSON link

The site's code contains your Web app URL, so the JSON view is locked with a
password that only lives in Apps Script:

1. In Apps Script, change the top line `const VIEW_PASSWORD = 'CHANGE-ME';`
   to your own password, e.g. `'daisy-cake-2026'`. Save.
2. **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy.**
   The URL stays the same.
3. Don't put your real password into the GitHub copy of `Code.gs`.

Recording friends' pulls doesn't need the password; only viewing does.

## Seeing the results

- **Spreadsheet:** the "Players" tab updates live, one row per friend.
- **JSON:** open `<your Web app URL>?key=YOUR-PASSWORD` in a browser. It returns:

```json
{
  "exportedAt": "2026-10-04T21:15:00.000Z",
  "players": [
    {
      "name": "Jess",
      "packsOpened": 7,
      "uniqueCards": 18,
      "totalCards": 35,
      "totalDuplicates": 17,
      "setSize": 25,
      "cards": [
        { "no": "001", "name": "Honey", "rarity": "Ultra Rare", "count": 2, "duplicates": 1, "shiny": 0 }
      ]
    }
  ]
}
```

## Good to know

- Tracking only works on the real website (GitHub Pages). The claude.ai
  preview link blocks sending data to other sites.
- Each browser counts as one player. A friend on two phones shows up twice.
- If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit →
  New version** so the same URL keeps working.
