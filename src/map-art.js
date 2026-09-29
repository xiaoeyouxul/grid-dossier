/* Original, inline vector artwork for the investigation map.
   All shapes are authored for this project and use a 100×100 coordinate grid. */
const svg = (body, extra = '') => `<svg viewBox="0 0 100 100" role="presentation" aria-hidden="true" focusable="false" ${extra}><g stroke="#493f39" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;

const art = {
  table: `<ellipse cx="51" cy="77" rx="34" ry="7" fill="#534538" opacity=".16" stroke="none"/><path fill="#bb8050" d="M16 31 32 20h53L69 31z"/><path fill="#d5a36e" d="M16 31h53v12H16z"/><path fill="#9d6847" d="m69 31 16-11v12L69 43z"/><path fill="#76543c" d="M23 44h5v36h-5zm39 0h5v36h-5zm13-1h5v25h-5z"/><path fill="none" d="M22 49h48" stroke="#f1c991" stroke-width="2"/>`,
  chair: `<ellipse cx="51" cy="81" rx="26" ry="5" fill="#534538" opacity=".15" stroke="none"/><path fill="#946447" d="M33 19h34v37H33z"/><path fill="#c79464" d="M37 24h26v27H37z"/><path fill="#bd8759" d="M26 51h48v12H26z"/><path fill="#76533b" d="M31 63h5v20h-5zm33 0h5v20h-5z"/><path fill="none" d="M32 67h34" stroke="#e4b989" stroke-width="2"/>`,
  box: `<ellipse cx="51" cy="81" rx="31" ry="6" fill="#534538" opacity=".15" stroke="none"/><path fill="#bb8657" d="m20 35 30-17 31 16-30 18z"/><path fill="#d4a06b" d="m20 35 31 17v31L20 66z"/><path fill="#a8754d" d="m51 52 30-18v32L51 83z"/><path fill="none" d="m31 29 31 16m-11 7v31m0-31 30-18" stroke="#f1c991" stroke-width="2"/>`,
  plant: `<ellipse cx="51" cy="83" rx="25" ry="6" fill="#34493b" opacity=".18" stroke="none"/><path fill="#b56f49" d="M35 63h34l-5 21H40z"/><path fill="#d48d5d" d="M35 63h34l-2 7H37z"/><path fill="none" d="M44 71h16" stroke="#efbd8d" stroke-width="2"/><path fill="#64875c" d="M50 64C32 57 29 43 34 34c14 2 21 12 18 30zm3-4C49 43 58 28 72 26c6 15-1 29-19 34zM49 55C34 45 35 31 43 22c12 7 15 19 8 33zM53 55c-1-16 8-25 20-27 3 13-4 24-20 31z"/><path fill="none" d="M51 64 48 39m5 21 13-27m-16 20-9-19" stroke="#a8c18a" stroke-width="2"/>`,
  carpet: `<path fill="#aa6860" d="m17 22 65 5v51l-65-5z"/><path fill="#cf8d7b" d="m23 28 53 4v39l-53-4z"/><path fill="none" d="m29 34 41 3v27l-41-3z" stroke="#f2c3a7" stroke-width="2"/><path fill="none" d="m33 39 33 2v17l-33-2z" stroke="#9b5e5d" stroke-width="2"/><path fill="#e6b28d" stroke="none" d="m49 45 3 5 6 .8-4.4 3.5 1.3 5.7-5.2-3-5.2 3 1.3-5.7-4.4-3.5 6-.8z"/>`,
  bed: `<ellipse cx="51" cy="80" rx="36" ry="7" fill="#534538" opacity=".15" stroke="none"/><path fill="#725b4b" d="M18 25h6v57h-6zm58 0h6v57h-6z"/><path fill="#d0bfa4" d="M23 43h55v29H23z"/><path fill="#f1e6d3" d="M27 32h20v17H27z"/><path fill="#a77762" d="M23 55h55v17H23z"/><path fill="#d49a77" d="M25 58h51v11H25z"/><path fill="none" d="M23 49h55M22 73h58" stroke="#725b4b" stroke-width="2.5"/>`,
  shelf: `<ellipse cx="51" cy="83" rx="27" ry="5" fill="#534538" opacity=".14" stroke="none"/><path fill="#795a43" d="M27 15h6v69h-6zm41 0h6v69h-6z"/><path fill="#a87952" d="M30 20h42v8H30zm0 21h42v8H30zm0 21h42v8H30z"/><path fill="#e0bb8a" d="M34 29h7v10h-7zm10 0h13v10H44zm16 0h8v10h-8zM35 50h11v10H35zm15 0h8v10h-8zm13 0h6v10h-6zM34 71h7v10h-7zm11 0h15v10H45z"/><path fill="none" d="M30 29h42m-42 21h42m-42 21h42" stroke="#604936" stroke-width="2"/>`,
  counter: `<ellipse cx="51" cy="80" rx="34" ry="6" fill="#534538" opacity=".15" stroke="none"/><path fill="#77543e" d="M22 41h7v41h-7zm48 0h7v41h-7z"/><path fill="#b77d50" d="m16 28 12-9h56l-12 9z"/><path fill="#d19c67" d="M16 28h56v15H16z"/><path fill="#986746" d="m72 28 12-9v15L72 43z"/><path fill="#ead2ae" d="M24 32h40v7H24z"/><path fill="none" d="M28 48h41" stroke="#d7a777" stroke-width="2"/>`,
  sofa: `<ellipse cx="51" cy="80" rx="37" ry="7" fill="#34413c" opacity=".16" stroke="none"/><path fill="#687e73" d="M22 35h10v32H22zm46 0h10v32H68z"/><path fill="#8ca195" d="M28 29h44v26H28z"/><path fill="#aebca9" d="M33 34h16v17H33zm19 0h16v17H52z"/><path fill="#71897b" d="M20 53h60v17H20z"/><path fill="#93a899" d="M26 56h48v11H26z"/><path fill="none" d="M23 70v9m54-9v9M50 55v14" stroke="#4e6358" stroke-width="3"/>`,
  lamp: `<ellipse cx="51" cy="83" rx="23" ry="5" fill="#534538" opacity=".13" stroke="none"/><path fill="#bd895c" d="M45 72h12v8H45z"/><path fill="#d6b27b" d="m28 42 8-23h28l8 23-10 5H38z"/><path fill="#f2dba3" d="m36 41 5-16h18l5 16-7 3H43z"/><path fill="#8b6848" d="M48 47h5v26h-5z"/><path fill="none" d="M35 42h30" stroke="#fff0c4" stroke-width="2"/>`,
  flower: `<path fill="#a96e55" d="M37 66h27l-4 17H41z"/><path fill="#d38f6b" d="M37 66h27l-2 6H39z"/><path fill="#64875d" d="M49 66V42m1 15c-13 1-19-7-17-15 10 0 17 5 17 15zm1-8c0-11 8-17 17-16 1 10-5 16-17 20z"/><path fill="#e3ae69" d="M50 19c4 8 8 9 14 9-6 3-8 7-8 13-3-6-7-8-13-8 6-3 8-7 7-14zm-12 9c3 5 6 6 10 6-5 2-6 5-6 9-2-4-5-5-9-5 4-2 6-5 5-10z"/>`,
  bench: `<ellipse cx="51" cy="82" rx="34" ry="6" fill="#534538" opacity=".15" stroke="none"/><path fill="#a97852" d="M18 35h64v10H18zm0 16h64v10H18z"/><path fill="#72533d" d="M24 61h6v21h-6zm46 0h6v21h-6z"/><path fill="none" d="M22 47h56" stroke="#e0b483" stroke-width="2"/>`,
};

/** Return crisp, self-contained SVG art for a fixture type. */
export function fixtureSvg(type) {
  const body = art[type];
  return body ? svg(body) : '';
}

/** Stable fixture variation for any rectangular board size. */
export function fixtureForCell(row, column, caseIndex = 0, room = '') {
  const preferred = /garden|forest|beach|pool|courtyard|terrace|greenhouse|veranda|balcony|pier|dock/i.test(room) ? 'plant'
    : /bed|guest room|cabin|ward/i.test(room) ? 'bed'
    : /kitchen|pantry|bar|restaurant|dining/i.test(room) ? 'counter'
    : /library|archive|office|study|map room/i.test(room) ? 'shelf'
    : /living|lounge|sitting|lobby/i.test(room) ? 'sofa' : null;
  const seed = (row * 7 + column * 3 + caseIndex) % 13;
  if (![0, 3, 5, 8, 11].includes(seed)) return null;
  const choices = ['table', 'chair', 'plant', 'bed', 'shelf', 'counter', 'sofa', 'lamp', 'flower', 'bench', 'box', 'carpet'];
  return preferred && seed === 0 ? preferred : choices[(row * 5 + column * 3 + caseIndex) % choices.length];
}

/** Preserve the established decoration vocabulary while making placement deterministic. */
export function floorDecoration(row, column, caseIndex, material) {
  const styles = { wood: 'grain', stone: 'brick', garden: 'leaf', tile: 'star', water: 'pebble', carpet: 'star' };
  return (row * 7 + column * 11 + caseIndex * 3) % 4 === 0 ? (styles[material] || null) : null;
}

/** Inline decorative SVG for empty tiles, ready to place behind cell content. */
export function floorDetail(material, variant = 0) {
  const details = {
    wood: `<path d="M8 24h84M8 51h84M8 78h84M25 0v24m47 0v27M42 51v27m35 0v22"/>`,
    stone: `<path d="M5 25h90M5 53h90M5 81h90M30 0v25m38 0v28M18 53v28m53 0v19"/>`,
    garden: `<path d="M18 22c9-10 18-8 20 2-9 8-17 8-20-2zm41 44c10-11 19-8 20 2-9 8-17 8-20-2z"/><path d="m20 25 15-2m27 45 16-2"/>`,
    tile: `<path d="M0 0h100v100H0zM50 0v100M0 50h100"/>`,
    water: `<path d="M12 25c10-8 19-8 29 0m18 0c9-8 19-8 29 0M5 55c10-8 19-8 29 0m22 0c10-8 20-8 30 0M17 83c10-8 20-8 30 0m20 0c9-8 17-8 27 0"/>`,
    carpet: `<path d="M10 10h80v80H10zM18 18h64v64H18z"/><path d="m50 30 5 14 15 1-12 9 4 15-12-9-12 9 4-15-12-9 15-1z"/>`,
  };
  const body = details[material];
  return body ? `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><g fill="none" stroke="#51483f" stroke-width="1.4" opacity="${variant % 2 ? '.12' : '.09'}">${body}</g></svg>` : '';
}
