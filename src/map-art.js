/* Original, inline vector artwork for the investigation map.
   All shapes are authored for this project and use a 100×100 coordinate grid. */
const svg = (body, extra = '') => `<svg viewBox="0 0 100 100" role="presentation" aria-hidden="true" focusable="false" ${extra}><defs>
  <linearGradient id="wood" x2="0" y2="1"><stop stop-color="#efc184"/><stop offset=".48" stop-color="#bd8050"/><stop offset="1" stop-color="#80543d"/></linearGradient>
  <linearGradient id="woodLight" x2="0" y2="1"><stop stop-color="#f4d39b"/><stop offset="1" stop-color="#c58a58"/></linearGradient>
  <linearGradient id="leaf" x2=".8" y2="1"><stop stop-color="#a9c879"/><stop offset="1" stop-color="#47704c"/></linearGradient>
  <linearGradient id="fabric" x2="0" y2="1"><stop stop-color="#c5d5b8"/><stop offset="1" stop-color="#718c7a"/></linearGradient>
  <linearGradient id="pot" x2="0" y2="1"><stop stop-color="#e7a675"/><stop offset="1" stop-color="#a8583f"/></linearGradient>
  <linearGradient id="linen" x2="0" y2="1"><stop stop-color="#fff7e7"/><stop offset="1" stop-color="#c7b9a5"/></linearGradient>
 </defs><g stroke="#493f39" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;

const art = {
  table: `<ellipse cx="51" cy="80" rx="35" ry="7" fill="#493d33" opacity=".18" stroke="none"/><path fill="url(#wood)" d="M13 32 30 18h57L70 32z"/><path fill="url(#woodLight)" d="M13 32h57v13H13z"/><path fill="#99613f" d="m70 32 17-14v14L70 45z"/><path fill="#80533b" d="M21 44h7v38h-7zm42 0h7v38h-7zm13 0h6v28h-6z"/><path fill="#dca76e" d="M23 48h3v30h-3zm42 0h3v30h-3z" stroke="none"/><path fill="none" d="M18 35h51m-46 5h46m-40-5c7 4 15 4 22 0" stroke="#ffe0a8" stroke-width="1.5" opacity=".8"/><path fill="#f3d5a0" d="M42 25h10v3H42z" stroke="none"/>`,
  chair: `<ellipse cx="51" cy="84" rx="26" ry="5" fill="#493d33" opacity=".18" stroke="none"/><path fill="url(#wood)" d="M30 17h40v41H30z"/><path fill="#d9a56c" d="M35 22h30v30H35z"/><path fill="#b9774a" d="M39 26h22v22H39z"/><path fill="none" d="M42 30v14m16-14v14M35 25h30" stroke="#efc58d" stroke-width="1.7"/><path fill="url(#woodLight)" d="M24 51h52v13H24z"/><path fill="#80543b" d="M29 63h7v21h-7zm36 0h7v21h-7z"/><path fill="none" d="M34 67h32m-2 0v13M32 71v9" stroke="#f0c58c" stroke-width="2"/><path fill="#f5d59e" d="M26 53h48" stroke="none"/>`,
  box: `<ellipse cx="51" cy="84" rx="32" ry="6" fill="#493d33" opacity=".18" stroke="none"/><path fill="url(#wood)" d="m17 34 33-18 34 17-33 20z"/><path fill="#e2b477" d="m17 34 34 19v32L17 66z"/><path fill="#a66b46" d="m51 53 33-20v33L51 85z"/><path fill="url(#woodLight)" d="m25 35 25-14 25 13-25 15z"/><path fill="none" d="m17 42 34 19 33-20M28 29l34 19m-11 5v32" stroke="#f5d5a0" stroke-width="2"/><path fill="#75503b" d="M35 44h8v5h-8z"/><path fill="#e7c27e" d="M39 44h3v7h-3z"/><path fill="none" d="M25 61v5m53-29v27" stroke="#88583d" stroke-width="1.5"/>`,
  plant: `<ellipse cx="51" cy="85" rx="26" ry="6" fill="#34493b" opacity=".18" stroke="none"/><path fill="url(#pot)" d="M32 64h38l-6 22H39z"/><path fill="#f0b27a" d="M32 62h38v8H32z"/><ellipse cx="51" cy="63" rx="19" ry="4" fill="#9a563e"/><ellipse cx="51" cy="63" rx="15" ry="2.5" fill="#604b38" stroke="none"/><path fill="url(#leaf)" d="M49 64C29 59 25 44 31 34c15 1 23 13 20 30zm5-3c-5-20 5-35 20-36 6 16-2 31-20 36zM48 55C32 43 35 28 44 19c13 8 14 22 4 37zm6 1c0-17 10-27 23-27 2 14-7 27-23 32zM45 62C35 56 35 47 40 41c9 4 12 11 9 21z"/><path fill="none" d="m51 65-4-28m7 25 15-31M49 55l-7-27m10 29 16-22" stroke="#c7d895" stroke-width="1.8"/><path fill="none" d="M38 74h26" stroke="#f8c492" stroke-width="1.8"/>`,
  carpet: `<path fill="#aa6860" d="m17 22 65 5v51l-65-5z"/><path fill="#cf8d7b" d="m23 28 53 4v39l-53-4z"/><path fill="none" d="m29 34 41 3v27l-41-3z" stroke="#f2c3a7" stroke-width="2"/><path fill="none" d="m33 39 33 2v17l-33-2z" stroke="#9b5e5d" stroke-width="2"/><path fill="#e6b28d" stroke="none" d="m49 45 3 5 6 .8-4.4 3.5 1.3 5.7-5.2-3-5.2 3 1.3-5.7-4.4-3.5 6-.8z"/>`,
  bed: `<ellipse cx="51" cy="84" rx="38" ry="7" fill="#493d33" opacity=".17" stroke="none"/><path fill="url(#wood)" d="M15 28q0-9 8-9h5v62h-8q-5 0-5-5zm57-9h7q7 0 7 8v49q0 5-6 5h-8z"/><path fill="#e0bc8c" d="M21 25h58v12H21z"/><path fill="url(#linen)" d="M23 43h55v30H23z"/><path fill="#fff8ea" d="M26 34q0-4 5-4h15q5 0 5 5v16H26z"/><path fill="#c4d3c0" d="M29 37h18v11H29z"/><path fill="#b77563" d="M23 56h55v17H23z"/><path fill="#d99176" d="M25 59h51v11H25z"/><path fill="none" d="M25 63h50m-26-8v14M21 77h60" stroke="#f2c6a0" stroke-width="1.8"/><path fill="#f4e4c9" d="M31 40h3v3h-3zm0 5h3v2h-3z" stroke="none"/>`,
  shelf: `<ellipse cx="51" cy="85" rx="29" ry="5" fill="#493d33" opacity=".18" stroke="none"/><path fill="url(#wood)" d="M24 13h8v72h-8zm44 0h8v72h-8z"/><path fill="#e8bd82" d="M28 18h44v9H28zm0 21h44v9H28zm0 21h44v9H28zM25 81h50v5H25z"/><path fill="#f0d29e" d="M33 29h8v8h-8zm11 0h14v8H44zm18 0h7v8h-7zM33 50h12v8H33zm16 0h8v8h-8zm13 0h9v8h-9zM33 71h8v8h-8zm12 0h18v8H45z"/><path fill="#648296" d="M34 30h6v6h-6zm28 0h5v6h-5zM34 51h4v6h-4z"/><path fill="#bc7654" d="M47 30h9v7h-9zm4 21h6v7h-6zM45 71h7v7h-7z"/><path fill="none" d="M28 28h44m-44 21h44m-44 21h44" stroke="#79583d" stroke-width="1.5"/>`,
  counter: `<ellipse cx="51" cy="80" rx="34" ry="6" fill="#534538" opacity=".15" stroke="none"/><path fill="#77543e" d="M22 41h7v41h-7zm48 0h7v41h-7z"/><path fill="#b77d50" d="m16 28 12-9h56l-12 9z"/><path fill="#d19c67" d="M16 28h56v15H16z"/><path fill="#986746" d="m72 28 12-9v15L72 43z"/><path fill="#ead2ae" d="M24 32h40v7H24z"/><path fill="none" d="M28 48h41" stroke="#d7a777" stroke-width="2"/>`,
  sofa: `<ellipse cx="51" cy="83" rx="38" ry="7" fill="#34413c" opacity=".18" stroke="none"/><path fill="#587466" d="M18 43q0-11 10-11h9v31H18zm45-11h9q10 0 10 11v20H63z"/><path fill="url(#fabric)" d="M27 28q0-5 7-5h32q7 0 7 5v29H27z"/><path fill="#d1ddc5" d="M32 30h16v22H32z"/><path fill="#aebfae" d="M52 30h16v22H52z"/><path fill="#dfe5cd" d="M35 33h10v2H35zm20 0h10v2H55z" stroke="none"/><path fill="#607f70" d="M17 52h66v20H17z"/><path fill="#a9bda9" d="M24 56h52v12H24z"/><path fill="#d5a36e" d="M22 72h7v8h-7zm51 0h7v8h-7z"/><path fill="none" d="M21 74v7m58-7v7M50 56v12M28 61h18m8 0h18" stroke="#526b5e" stroke-width="2"/><path fill="#e0c694" d="M39 38h5v6h-5zm19 0h5v6h-5z"/>`,
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
