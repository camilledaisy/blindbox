/**
 * Camille Cards — player tracker (Google Apps Script)
 *
 * Receives each player's collection from the website and keeps one row per
 * player in the "Players" sheet. Open the web-app URL in a browser to get
 * everything as JSON. Setup steps: tracking/README.md
 */
// Password for viewing results: open  <your /exec URL>?key=YOUR-PASSWORD
// Change it here in Apps Script only (never commit your real password to GitHub).
// While it still says CHANGE-ME, nobody can view the results.
const VIEW_PASSWORD = 'CHANGE-ME';

const SHEET_NAME = 'Players';
const HEADERS = ['Player ID', 'Name', 'Packs opened', 'Unique cards', 'Total cards', 'Duplicates', 'Cards (count)', 'Last update', 'JSON'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

const str = (v, max) => String(v == null ? '' : v).slice(0, max);
// A cell starting with = + - @ would run as a formula; show it as plain text instead.
const cell = (v) => (/^[=+\-@]/.test(v) ? "'" + v : v);
const num = (v) => (Number.isFinite(Number(v)) ? Math.max(0, Math.floor(Number(v))) : 0);

/** Keep only the fields we expect, with sane sizes (the data comes from the public). */
function clean_(d) {
  const cards = (Array.isArray(d.cards) ? d.cards : []).slice(0, 100).map((c) => ({
    no: str(c.no, 8),
    name: str(c.name, 60),
    rarity: str(c.rarity, 20),
    count: num(c.count),
    duplicates: num(c.duplicates),
    shiny: num(c.shiny),
  }));
  return {
    playerId: str(d.playerId, 64),
    name: str(d.name, 24),
    packsOpened: num(d.packsOpened),
    uniqueCards: cards.length,
    totalCards: cards.reduce((n, c) => n + c.count, 0),
    totalDuplicates: cards.reduce((n, c) => n + c.duplicates, 0),
    setSize: num(d.setSize),
    cards,
    updatedAt: new Date().toISOString(),
  };
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = clean_(JSON.parse(e.postData.contents));
    if (!d.playerId || !d.name) return ContentService.createTextOutput('ignored');
    const sh = sheet_();
    const row = [
      d.playerId,
      cell(d.name),
      d.packsOpened,
      d.uniqueCards,
      d.totalCards,
      d.totalDuplicates,
      cell(d.cards.map((c) => `${c.name} ×${c.count}`).join(', ')),
      d.updatedAt,
      JSON.stringify(d),
    ];
    const ids = sh.getRange(1, 1, Math.max(sh.getLastRow(), 1), 1).getValues().map((r) => r[0]);
    const i = ids.indexOf(d.playerId);
    if (i > 0) sh.getRange(i + 1, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

const json_ = (obj) => ContentService.createTextOutput(JSON.stringify(obj, null, 2)).setMimeType(ContentService.MimeType.JSON);

/** Open <web-app URL>?key=YOUR-PASSWORD to download every player as JSON. */
function doGet(e) {
  const key = (e && e.parameter && e.parameter.key) || '';
  if (VIEW_PASSWORD === 'CHANGE-ME') return json_({ error: 'Set VIEW_PASSWORD at the top of the script first.' });
  if (key !== VIEW_PASSWORD) return json_({ error: 'Wrong or missing password. Add ?key=YOUR-PASSWORD to the end of the link.' });
  const sh = sheet_();
  const rows = sh.getLastRow() > 1 ? sh.getRange(2, 9, sh.getLastRow() - 1, 1).getValues() : [];
  const players = rows.map((r) => JSON.parse(r[0])).sort((a, b) => b.packsOpened - a.packsOpened);
  return json_({ exportedAt: new Date().toISOString(), players });
}
