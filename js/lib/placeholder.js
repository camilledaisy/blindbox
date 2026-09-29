// Placeholder art shown until a real photo exists at card.image.
const failed = new Set();
const cache = new Map();

export function placeholderFor(card) {
  if (cache.has(card.id)) return cache.get(card.id);
  const c = card.color || '#ffd27a';
  const isError = card.rarity === 'error';
  const bg = isError
    ? `<rect width='400' height='320' fill='#0b0b0f'/>
       <g opacity='.9'>${Array.from({ length: 26 }, (_, i) =>
         `<rect x='0' y='${i * 12.3}' width='400' height='${(i * 7) % 5 + 1}' fill='${['#39ff88', '#ff2bd6', '#28e0ff'][i % 3]}' opacity='${0.1 + ((i * 13) % 7) / 20}'/>`,
       ).join('')}</g>`
    : `<defs><pattern id='p' width='40' height='40' patternUnits='userSpaceOnUse'>
         <rect width='40' height='40' fill='${c}'/>
         <rect width='20' height='20' fill='#fff' opacity='.28'/>
         <rect x='20' y='20' width='20' height='20' fill='#fff' opacity='.28'/>
       </pattern></defs>
       <rect width='400' height='320' fill='url(#p)'/>`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 320'>
    ${bg}
    <circle cx='200' cy='146' r='82' fill='#fff' opacity='${isError ? 0.08 : 0.6}'/>
    <circle cx='200' cy='146' r='82' fill='none' stroke='#3a2418' stroke-width='4' stroke-dasharray='10 8' opacity='.35'/>
    <text x='200' y='176' font-size='86' text-anchor='middle' font-family='Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif'>${card.emoji || '✿'}</text>
    <rect x='96' y='258' width='208' height='30' fill='${isError ? '#39ff88' : '#3a2418'}'/>
    <text x='200' y='279' font-family='monospace' font-size='15' font-weight='700' fill='${isError ? '#0b0b0f' : '#fff7e3'}' text-anchor='middle' letter-spacing='2'>PHOTO ${card.no}</text>
  </svg>`;
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  cache.set(card.id, url);
  return url;
}

/** Source to try first for a card: the real photo unless we know it's missing. */
export function srcFor(card) {
  return card.image && !failed.has(card.image) ? card.image : placeholderFor(card);
}

/** <img> that falls back to the placeholder if the photo 404s. */
export function bindCardImage(img, card) {
  const src = srcFor(card);
  const usingPlaceholder = src !== card.image;
  img.classList.toggle('is-placeholder', usingPlaceholder);
  if (!usingPlaceholder) {
    img.onerror = () => {
      failed.add(card.image);
      img.onerror = null;
      img.classList.add('is-placeholder');
      img.src = placeholderFor(card);
    };
  }
  img.src = src;
  return img;
}

/** Load a card's image as an HTMLImageElement (for the PNG export). */
export function loadCardImage(card) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      if (img.src !== placeholderFor(card)) {
        failed.add(card.image);
        img.src = placeholderFor(card);
      } else resolve(null);
    };
    img.src = srcFor(card);
  });
}
