// ============================================================================
//  TRADING — architecture sketch (not wired into the UI yet)
//
//  How it's meant to work later:
//  - Every pull is stored in store.log as a *copy* with its own `uid`.
//    A trade moves copies (uids) between collectors, never abstract card ids,
//    so duplicates and shinies stay distinct and nothing can be double-spent.
//  - Each friend sets a collector name (store.setCollector) — already saved.
//  - A TradeOffer lists what one collector gives and what they want back.
//  - Transport is pluggable. Two options that fit a birthday party:
//      1. No backend: encode a copy/offer as a short code or QR (below) that
//         the other person pastes/scans. Simple, but needs an honour system.
//      2. Tiny backend (Supabase/Firebase/etc.): implement TradeTransport
//         against a `trades` table and a `copies` table keyed by uid.
//
//  To build it: implement a TradeTransport, add a "Trade" view to main.js,
//  and call applyTrade() when an offer is accepted.
// ============================================================================

/**
 * @typedef {{ uid: string, id: string, shiny: boolean, at: number }} CardCopy
 * @typedef {{ id: string, from: string, to?: string, give: CardCopy[], want: string[],
 *             status: 'open'|'accepted'|'declined'|'cancelled', createdAt: number }} TradeOffer
 * @typedef {{
 *   publish(offer: TradeOffer): Promise<void>,
 *   listOffers(collector: string): Promise<TradeOffer[]>,
 *   respond(offerId: string, accept: boolean, giveBack: CardCopy[]): Promise<void>,
 * }} TradeTransport
 */

export function createOffer({ from, give, want = [] }) {
  return {
    id: crypto.randomUUID?.() ?? String(Date.now()),
    from,
    give,
    want,
    status: 'open',
    createdAt: Date.now(),
  };
}

/** Encode a card copy or offer as a copy-pasteable code. */
export const encode = (obj) => btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
export const decode = (code) => JSON.parse(decodeURIComponent(escape(atob(code))));

/**
 * Apply an accepted trade to local state: remove given copies, add received ones.
 * Left unimplemented on purpose until trading ships — it needs store.js to
 * gain removeCopy()/addCopy() helpers that also update the per-card counts.
 */
export function applyTrade(/* state, { gave, received } */) {
  throw new Error('Trading is coming soon ✦');
}
