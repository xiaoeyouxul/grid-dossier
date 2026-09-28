import { cases, areaAt, murdererIndex } from './puzzles.js';
import { caseRoom, caseText, clueText, difficultyLabel, formatDate, locales, localeInfo, roleLabel, supportedLocale, t } from './i18n.js';

const state = {
  page: 'cases', difficulty: 'All', sort: 'release', showAll: false,
  caseId: null, selected: 0, grid: [], xmarks: [], undo: [], timer: 0,
  theme: localStorage.theme || 'light', locale: supportedLocale(localStorage.locale || 'en'),
  message: null, modal: null, xMode: false, hintMode: false,
  musicEnabled: false,
};
const app = document.querySelector('#app');
const saved = JSON.parse(localStorage.murdoku || '{}');
let timerInterval;
let musicContext, musicNodes = [], musicInterval, musicStep = 0;
let musicPreference = localStorage.murdokuMusic === 'on';

function playMusicNote(frequency, start, duration, volume, type='sine') {
  const oscillator = musicContext.createOscillator(), envelope = musicContext.createGain();
  oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, start);
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(volume, start + 0.12);
  envelope.gain.setValueAtTime(volume, start + Math.max(0.13, duration - 0.22));
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(envelope); envelope.connect(musicContext.destination);
  oscillator.start(start); oscillator.stop(start + duration + 0.03);
  musicNodes.push(oscillator);
  oscillator.onended = () => { musicNodes = musicNodes.filter(node => node !== oscillator); oscillator.disconnect(); envelope.disconnect(); };
}

function playMusicBar() {
  if (!state.musicEnabled || !musicContext) return;
  const chords = [[110, 164.81, 220], [87.31, 130.81, 174.61], [130.81, 164.81, 196], [98, 146.83, 196]];
  const melodies = [[440, 392, 329.63, 392], [349.23, 392, 440, 392], [329.63, 392, 493.88, 440], [392, 329.63, 293.66, 329.63]];
  const start = musicContext.currentTime + 0.05, chord = chords[musicStep % chords.length], melody = melodies[musicStep % melodies.length];
  chord.forEach((frequency, index) => playMusicNote(frequency, start, 2.65, index ? 0.006 : 0.012, index ? 'sine' : 'triangle'));
  melody.forEach((frequency, index) => playMusicNote(frequency, start + index * 0.62, 0.54, 0.005));
  musicStep++;
}

function setMusic(enabled) {
  state.musicEnabled = enabled;
  musicPreference = enabled;
  document.removeEventListener('click', restoreMusicPreference);
  localStorage.murdokuMusic = enabled ? 'on' : 'off';
  if (enabled) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) { state.musicEnabled = false; localStorage.murdokuMusic = 'off'; return; }
    musicContext ||= new AudioContext();
    musicContext.resume().then(() => {
      if (!state.musicEnabled || musicNodes.length) return;
      playMusicBar();
      musicInterval = setInterval(playMusicBar, 2800);
    }).catch(() => { state.musicEnabled = false; });
  } else if (musicContext) {
    clearInterval(musicInterval);
    musicNodes.forEach(node => { try { node.stop(); } catch {} });
    musicNodes = [];
  }
}

function restoreMusicPreference(event) {
  if (!musicPreference || state.musicEnabled || event.target.closest?.('[data-action="music"]')) return;
  setMusic(true);
  render();
}

const fixtureType = (puzzle, row, column) => {
  if (puzzle.id === 'c01') {
    const clueFixtures = { '0,1':'box', '1,1':'chair', '2,2':'carpet', '4,5':'plant' };
    return clueFixtures[`${row},${column}`] || null;
  }
  const room = String(puzzle.areas[areaAt(puzzle, row, column)]).toLowerCase();
  const index = (row * 7 + column * 3 + cases.indexOf(puzzle)) % 11;
  const preferred = /garden|forest|beach|pool|courtyard|terrace|greenhouse|veranda|balcony|pier|dock/.test(room) ? 'plant'
    : /bed|guest room|cabin|ward/.test(room) ? 'bed'
    : /kitchen|pantry|bar|restaurant|dining/.test(room) ? 'counter'
    : /library|archive|office|study|map room/.test(room) ? 'shelf'
    : /living|lounge|sitting|lobby/.test(room) ? 'sofa' : null;
  const types = ['table', 'chair', 'plant', 'bed', 'shelf', 'counter', 'sofa'];
  return index === 0 || index === 5 ? (preferred || types[(row + column + cases.indexOf(puzzle)) % types.length]) : null;
};

const fixtureSvg = type => {
  const paths = {
    table:'<path fill="#c49a70" d="m3 7 5-3h13l-5 3z"/><path fill="#b98452" d="m3 7 13 0v3H3z"/><path fill="#d0aa7f" d="m16 7 5-3v3l-5 3z"/><path d="M4 10v10m10-10v10m3-10v7m-13-10h12"/>',
    chair:'<path fill="#a97852" d="M7 4h9v8H7z"/><path fill="#c18a5d" d="M5 11h13v3H5z"/><path d="M7 5v6m8-6v6M6 14v6m11-6v6M6 17h11"/>',
    box:'<path fill="#b98452" d="M3 7.5 12 3l9 4.5v10L12 22l-9-4.5z"/><path d="m3 7.5 9 4.7 9-4.7M12 12.2V22M8 5l9 4.6"/>',
    plant:'<path fill="#75916a" d="M12 12C5 12 4 7 5 4c5 0 8 3 7 8Zm1-1c0-6 4-9 8-8 0 5-2 9-8 9Z"/><path fill="#c88758" d="M8 14h9l-1.4 7h-6.2z"/><path d="M12 14V9m0 4H8"/>',
    carpet:'<path fill="#b97464" d="m5 5 14 1v12l-14 1z"/><path d="m7 7 10 .7v8.6L7 17zM4 8H2m3 4H2m3 4H2m17-8h2m-2 4h2m-2 4h2"/>',
    bed:'<path fill="#d7c2a0" d="m4 13 16-1v7H4z"/><path fill="#eee1ca" d="M5 9h6v5H5z"/><path fill="#b98767" d="M3 14h18v5H3z"/><path d="M3 7v13m18-13v13M3 14h18v5H3zm2-5h6v5H5z"/>', shelf:'<path fill="#9c7659" d="M5 5h14v3H5zm0 6h14v3H5zm0 6h14v3H5z"/><path d="M4 3v18m16-18v18M4 8h16M4 14h16M4 20h16"/>',
    counter:'<path fill="#c69b70" d="m3 6 4-2h14l-3 2z"/><path fill="#a97852" d="m3 6 15 0v4H3z"/><path fill="#d2b08c" d="m18 6 3-2v4l-3 2z"/><path d="M4 10v10m13-10v10M4 15h13"/>',
    sofa:'<path fill="#758b82" d="M6 7h12v6H6z"/><path fill="#90a397" d="M4 12h16v6H4z"/><path fill="#a5b4a7" d="M8 8h8v5H8z"/><path d="M6 8v4m12-4v4m-14 0h16v6H4zm3 6v3m10-3v3M8 13v4m8-4v4"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="#493d34" stroke-width="1.35" stroke-linejoin="round" stroke-linecap="round">${paths[type]}</g></svg>`;
};

const blank = () => Array.from({ length: 6 }, () => Array(6).fill(null));
const tr = (key, values) => t(state.locale, key, values);
const number = value => new Intl.NumberFormat(state.locale).format(value);
const time = () => `${String(Math.floor(state.timer / 60)).padStart(2, '0')}:${String(state.timer % 60).padStart(2, '0')}`;
const formatDuration = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
const caseNumber = puzzle => String(cases.indexOf(puzzle) + 1).padStart(3, '0');
const nextPuzzle = puzzle => cases[cases.indexOf(puzzle) + 1] || null;
const caseLabel = puzzle => `${tr('caseNo')} ${caseNumber(puzzle)}`;
const setMessage = (key, values = {}) => { state.message = { key, values }; };
const musicToggle = () => `<button class="music-toggle" data-action="music" aria-pressed="${state.musicEnabled}" aria-label="${tr(state.musicEnabled ? 'musicOff' : 'musicOn')}">${state.musicEnabled ? '♫' : '♪'} <span>${tr(state.musicEnabled ? 'musicOff' : 'musicOn')}</span></button>`;
const localeSelector = () => `<select class="lang" data-locale aria-label="${tr('language')}">${locales.map(option => `<option value="${option.code}" ${state.locale === option.code ? 'selected' : ''}>${option.label}</option>`).join('')}</select>`;
const portraitIndex = (caseIndex, personIndex) => caseIndex === 0 ? [2, 1, 3, 5, 4, 6][personIndex] : ((caseIndex * 5 + personIndex) % 12) + 1;

function save() {
  saved[state.caseId] = { ...(saved[state.caseId] || {}), grid: state.grid, xmarks: state.xmarks, timer: state.timer };
  localStorage.murdoku = JSON.stringify(saved);
}

function timer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (state.page === 'game') {
      state.timer++;
      const element = document.querySelector('#timer');
      if (element) element.textContent = time();
      save();
    }
  }, 1000);
}

function render() {
  const info = localeInfo(state.locale);
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.lang = info.code;
  document.documentElement.dir = info.dir;
  document.title = `Murdoku — ${state.page === 'game' ? caseText(state.locale, cases.find(item => item.id === state.caseId), 'title') : tr('caseFiles')}`;
  state.page === 'game' ? renderGame() : renderCases();
}

function openCase(id) {
  state.caseId = id;
  saved[id] = { ...(saved[id] || {}), playCount: (saved[id]?.playCount || 0) + 1, lastPlayed: Date.now() };
  localStorage.murdoku = JSON.stringify(saved);
  state.page = 'game';
  state.message = null;
  state.selected = 0;
  state.xMode = false;
  state.hintMode = false;
  state.modal = null;
  state.timer = saved[id]?.timer || 0;
  state.grid = saved[id]?.grid || blank();
  state.xmarks = saved[id]?.xmarks || blank();
  state.undo = [];
  render();
  window.scrollTo(0, 0);
  timer();
}

function back() {
  clearInterval(timerInterval);
  state.page = 'cases';
  state.modal = null;
  render();
}

function undo() {
  const previous = state.undo.pop();
  if (previous) {
    state.grid = previous.grid;
    state.xmarks = previous.xmarks;
    save();
    render();
  }
}

function snapshot() {
  state.undo.push({ grid: state.grid.map(row => [...row]), xmarks: state.xmarks.map(row => [...row]) });
  if (state.undo.length > 50) state.undo.shift();
}

function setCell(row, column) {
  if (state.xMode) {
    snapshot();
    state.grid[row][column] = null;
    state.xmarks[row][column] = !state.xmarks[row][column];
    save();
    render();
    return;
  }
  const personNumber = state.selected + 1;
  if (state.grid[row][column] === personNumber) {
    snapshot();
    state.grid[row][column] = null;
    state.message = null;
    save();
    render();
    return;
  }
  for (let index = 0; index < 6; index++) {
    if ((index !== column && state.grid[row][index] && state.grid[row][index] !== personNumber)
      || (index !== row && state.grid[index][column] && state.grid[index][column] !== personNumber)) {
      setMessage('conflict');
      render();
      return;
    }
  }
  snapshot();
  for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) if (state.grid[y][x] === personNumber) state.grid[y][x] = null;
  state.grid[row][column] = personNumber;
  state.xmarks[row][column] = false;
  state.message = null;
  save();
  render();
}

function clearBoard() {
  snapshot();
  state.grid = blank();
  state.xmarks = blank();
  state.message = null;
  save();
  render();
}

function hint() {
  const puzzle = cases.find(item => item.id === state.caseId);
  const placementIndex = puzzle.solution.findIndex(([row, column], index) => state.grid[row][column] !== index + 1);
  if (placementIndex < 0) {
    setMessage('allCorrect');
    render();
    return;
  }
  const [row, column] = puzzle.solution[placementIndex];
  snapshot();
  for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) {
    if (state.grid[y][x] === placementIndex + 1 || (y === row && state.grid[y][x]) || (x === column && state.grid[y][x])) state.grid[y][x] = null;
  }
  state.grid[row][column] = placementIndex + 1;
  state.xmarks[row][column] = false;
  state.selected = placementIndex;
  state.message = { type: 'clue', clue: puzzle.clues[placementIndex] };
  save();
  render();
}

function submit() {
  const puzzle = cases.find(item => item.id === state.caseId);
  let justSolved = false;
  if (state.grid.flat().filter(Boolean).length !== 6) {
    setMessage('incomplete');
  } else if (puzzle.solution.every(([row, column], person) => state.grid[row][column] === person + 1)) {
    justSolved = true;
    const culprit = murdererIndex(puzzle);
    const victim = puzzle.people.findIndex(person => person[0] === 'V');
    const victimArea = areaAt(puzzle, ...puzzle.solution[victim]);
    setMessage('solvedMessage', {
      culprit: puzzle.people[culprit][1],
      victimArea,
    });
    const record = saved[puzzle.id] || {};
    saved[puzzle.id] = {
      ...record,
      solved: true,
      completionTime: Number.isFinite(record.completionTime) ? record.completionTime : state.timer,
      solvedAt: record.solvedAt || Date.now(),
    };
    clearInterval(timerInterval);
    save();
  } else {
    setMessage('incorrect');
  }
  render();
  if (justSolved) {
    requestAnimationFrame(() => {
      const banner = document.querySelector('.success-banner');
      if (!banner) return;
      const behavior = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      banner.scrollIntoView({ behavior, block: 'start' });
    });
  }
}

function renderCases() {
  const difficulties = ['All', 'Very Easy', 'Easy', 'Medium', 'Hard', 'Expert'];
  const list = cases.filter(puzzle => state.difficulty === 'All' || puzzle.difficulty === state.difficulty);
  if (state.sort === 'difficulty') list.sort((a, b) => difficulties.indexOf(a.difficulty) - difficulties.indexOf(b.difficulty));
  if (state.sort === 'title') list.sort((a, b) => caseText(state.locale, a, 'title').localeCompare(caseText(state.locale, b, 'title'), state.locale));
  if (state.sort === 'recent') list.sort((a, b) => (saved[b.id]?.lastPlayed || 0) - (saved[a.id]?.lastPlayed || 0));
  if (state.sort === 'popular') list.sort((a, b) => (saved[b.id]?.playCount || 0) - (saved[a.id]?.playCount || 0));
  if (state.sort === 'status') list.sort((a, b) => Number(!!saved[b.id]?.solved) - Number(!!saved[a.id]?.solved));
  const visibleCases = state.showAll ? list : list.slice(0, 4);
  const solvedCount = cases.filter(puzzle => saved[puzzle.id]?.solved).length;
  const progressCount = cases.filter(puzzle => !saved[puzzle.id]?.solved && (saved[puzzle.id]?.playCount || saved[puzzle.id]?.lastPlayed)).length;
  app.innerHTML = `
    <header class="top">
      <a class="brand" href="#" data-action="home">MURDOKU<span>®</span></a>
      <div class="top-actions">
        ${localeSelector()}
        ${musicToggle()}
        <button class="icon-btn" data-action="settings" aria-label="${tr('settings')}">⚙</button>
        <button class="icon-btn" data-action="theme" aria-label="${tr('theme')}">${state.theme === 'light' ? '☾' : '☀'}</button>
      </div>
    </header>
    <main class="cases-page">
      <section class="intro">
        <div class="eyebrow">${tr('heroEyebrow')}</div>
        <h1>${tr('heroOne')}<br><em>${tr('heroTwo')}</em></h1>
        <p>${tr('heroDescription')}</p>
      </section>
      <section class="case-section">
        <div class="section-top">
          <div><span class="eyebrow">${tr('investigation')}</span><h2>${tr('caseFiles')} <small>(${number(cases.length)})</small></h2></div>
          <div class="controls">
            <div class="filters">${difficulties.map(value => `<button class="filter ${state.difficulty === value ? 'active' : ''}" data-difficulty="${value}">${difficultyLabel(state.locale, value)}</button>`).join('')}</div>
            <select class="sort" data-sort aria-label="${tr('caseFiles')}">
              <option value="release">${tr('release')}</option><option value="difficulty">${tr('difficulty')}</option>
              <option value="title">${tr('title')}</option><option value="recent">${tr('recent')}</option>
              <option value="popular">${tr('popular')}</option><option value="status">${tr('status')}</option>
            </select>
          </div>
        </div>
        <div class="collection-stats" aria-label="${tr('collectionStats')}" role="status"><span>${tr('totalCases', { count:number(cases.length) })}</span><span>${tr('solvedCount', { count:number(solvedCount) })}</span><span>${tr('progressCount', { count:number(progressCount) })}</span></div>
        <div class="case-grid">${visibleCases.map(puzzle => {
          const record = saved[puzzle.id] || {};
          const solved = !!record.solved;
          const progress = !solved && !!(record.playCount || record.lastPlayed);
          const statusClass = solved ? 'is-solved' : progress ? 'is-progress' : 'is-new';
          const miniGrid = Array.from({ length: 36 }, (_, index) => {
            const row = Math.floor(index / 6), column = index % 6;
            const personIndex = puzzle.solution.findIndex(([r, c]) => r === row && c === column);
            return `<span class="mini-cell" aria-hidden="true">${personIndex >= 0 ? `<span class="mini-person person-${personIndex}">${puzzle.people[personIndex][0]}</span>` : ''}</span>`;
          }).join('');
          const completion = solved && Number.isFinite(record.completionTime) ? `<span class="completion-time">${tr('completedIn', { time:formatDuration(record.completionTime) })}</span>` : '';
          return `<article class="case-card ${statusClass}" style="--card:${puzzle.color}">
            <button class="case-art ${solved ? 'case-preview' : 'case-envelope'}" data-case="${puzzle.id}" aria-label="${solved ? tr('revisitCaseNamed', { title:caseText(state.locale, puzzle, 'title') }) : tr('openCaseNamed', { title:caseText(state.locale, puzzle, 'title') })}">
              <span class="serial">${tr('caseNo')} ${caseNumber(puzzle)}</span>
              ${solved ? `<span class="case-mini-grid" aria-label="${tr('solvedBoard')}">${miniGrid}</span>` : `<span class="art-glyph">${puzzle.symbol}</span><span class="art-place">${caseText(state.locale, puzzle, 'place')}</span>`}
              <span class="case-status">${solved ? `✓ ${tr('solved')}` : progress ? tr('inProgress') : tr('caseAvailable')}</span>
              ${solved ? `<span class="solved-seal" aria-hidden="true">✓</span>` : ''}
            </button>
            <div class="case-info"><div class="case-meta"><span>${formatDate(state.locale, puzzle.date)}</span><span class="difficulty">${difficultyLabel(state.locale, puzzle.difficulty)} · 6×6</span></div>
              <h3>${caseText(state.locale, puzzle, 'title')}</h3><p>${caseText(state.locale, puzzle, 'desc')}</p>
              ${completion}
              <div class="solved-actions"><button class="open-case" data-case="${puzzle.id}">${solved ? tr('revisit') : progress ? tr('continueCase') : tr('open')} <span aria-hidden="true">↗</span></button></div>
            </div></article>`;
        }).join('')}</div>
        ${!state.showAll ? `<button class="load-more" data-action="more">${tr('viewAll')} <span>↓</span></button>` : ''}
      </section>
      <footer class="footer"><span>${tr('copyright')}</span><span>${tr('collection')}</span><button data-action="help">${tr('howToPlayLink')} ↗</button></footer>
    </main>${modal()}`;
  bind();
}

function renderGame() {
  const puzzle = cases.find(item => item.id === state.caseId);
  const placed = state.grid.flat();
  const messageValues = state.message?.key === 'solvedMessage'
    ? { ...state.message.values, room: caseRoom(state.locale, puzzle, state.message.values.victimArea).toLocaleLowerCase(state.locale) }
    : state.message?.values;
  const message = state.message?.type === 'clue'
    ? clueText(state.locale, puzzle, state.message.clue)
    : state.message ? tr(state.message.key, messageValues) : '';
  const successBanner = state.message?.key === 'solvedMessage' ? `<section class="success-banner" role="status" aria-live="polite"><span class="success-mark" aria-hidden="true">✓</span><div><span class="eyebrow">${tr('caseClosed')}</span><h2>${tr('solvedHeadline')}</h2><p>${message}</p></div><div class="success-actions"><button class="primary-btn" data-action="back">${tr('backToCases')}</button>${nextPuzzle(puzzle) ? `<button class="secondary-btn" data-case="${nextPuzzle(puzzle).id}">${tr('nextCase')}</button>` : ''}</div></section>` : '';
  app.innerHTML = `
    <header class="top game-top">
      <button class="back-link" data-action="back">← <span>${tr('back')}</span></button>
      <b class="game-title">${caseText(state.locale, puzzle, 'title')}</b>
      <div class="top-actions">${localeSelector()}<span id="timer" class="timer ${state.clockHidden ? 'hidden' : ''}">${time()}</span>${musicToggle()}<button class="icon-btn" data-action="help" aria-label="${tr('help')}">?</button><button class="icon-btn" data-action="settings" aria-label="${tr('settings')}">⚙</button></div>
    </header>
    <main class="game-page">
      ${successBanner}
      <div class="game-layout">
      <section class="map-panel" aria-label="${caseText(state.locale, puzzle, 'place')}">
      <div class="scene-board">${Array.from({ length: 36 }, (_, index) => {
        const row = Math.floor(index / 6), column = index % 6, value = state.grid[row][column], marked = state.xmarks[row][column], area = areaAt(puzzle, row, column);
        const ariaLabel = `${caseRoom(state.locale, puzzle, area)}, ${tr('row')} ${number(row + 1)}, ${tr('column')} ${number(column + 1)}`;
        const fixture = fixtureType(puzzle, row, column);
        return `<button class="scene-cell area-${area} edge-col-${column % 2} edge-row-${row % 2} ${value ? 'filled' : ''} ${marked ? 'xmarked' : ''}" data-cell="${row},${column}" aria-label="${ariaLabel}">${fixture ? `<span class="scene-fixture fixture-${fixture}" aria-hidden="true">${fixtureSvg(fixture)}</span>` : ''}${value
          ? `<span class="person-avatar cell-person">${puzzle.people[value - 1][0]}</span><small>${puzzle.people[value - 1][1].split(' ')[0]}</small>`
          : marked ? '<span class="xmark" aria-hidden="true">×</span>' : `<span class="cell-coordinate">${number(row + 1)}·${number(column + 1)}</span>`}</button>`;
      }).join('')}</div>
      <div class="mobile-tools"><button data-action="xmode" class="${state.xMode ? 'tool-active' : ''}" aria-label="${tr('markImpossible')}">×</button><button data-action="clear" aria-label="${tr('clear')}">⌫</button><button data-action="undo" aria-label="${tr('undo')}" ${state.undo.length ? '' : 'disabled'}>↶</button><button data-action="hint" aria-label="${tr('hint')}">✦</button><button class="submit" data-action="submit">${tr('submit')}</button></div>
      </section>
      <section class="investigation-panel">
      <div class="map-details"><div class="game-location"><span class="eyebrow">${caseLabel(puzzle)} · ${difficultyLabel(state.locale, puzzle.difficulty)}</span><span>${caseText(state.locale, puzzle, 'place')}</span></div><div class="area-legend">${puzzle.areas.map((area, index) => `<span><i class="area-swatch area-${index}"></i>${caseRoom(state.locale, puzzle, index)}</span>`).join('')}</div></div>
      <div class="suspect-heading"><span class="eyebrow">${tr('suspects')}</span><span>${tr('suspectPrompt')}</span></div>
      <div class="suspect-list">${puzzle.people.map((person, index) => { const clue = puzzle.clues.find(item => item.person === index); const information = clueText(state.locale, puzzle, clue); const displayName = person[1].trim().split(/\s+/u)[0] || person[1]; return `<button class="suspect ${state.selected === index ? 'selected' : ''} ${placed.includes(index + 1) ? 'placed' : ''}" data-person="${index}" aria-label="${tr('selectPerson', { name:person[1] })}. ${information}"><span class="suspect-portrait-card"><span class="person-avatar"><img class="suspect-portrait" src="./assets/portraits/portrait-${portraitIndex(cases.indexOf(puzzle), index)}.webp" alt=""><span class="person-initial">${person[0]}</span></span><span class="person-copy"><b>${displayName}</b><small>${roleLabel(state.locale, person[2], puzzle, index)}</small></span><span class="person-check">${placed.includes(index + 1) ? '✓' : ''}</span></span><span class="suspect-clue">${information}</span></button>`; }).join('')}</div>
      ${message && state.message?.key !== 'solvedMessage' ? `<div class="notice">${message}</div>` : ''}
      </section>
      </div>
    </main>
    ${modal()}`;
  bind();
}

function modal() {
  if (!state.modal) return '';
  const help = state.modal === 'help';
  const languageSelect = localeSelector();
  const body = help
    ? `<p>${tr('helpIntro')}</p><ul><li>${tr('helpSelect')}</li><li>${tr('helpX')}</li><li>${tr('helpUndo')}</li><li>${tr('helpSubmit')}</li></ul>`
    : `<div class="setting-row"><span>${tr('language')}</span>${languageSelect}</div><div class="setting-row"><span>${tr('theme')}</span><button data-action="theme">${tr(state.theme)} · ${tr('toggle')}</button></div><div class="setting-row"><span>${tr('clock')}</span><button data-action="clock">${tr(state.clockHidden ? 'hidden' : 'visible')} · ${tr('toggle')}</button></div>`;
  return `<div class="modal-backdrop" data-action="close"><div class="modal"><button class="modal-close" data-action="close" aria-label="${tr('close')}">×</button><span class="eyebrow">${help ? tr('rules') : tr('preferences')}</span><h2>${help ? tr('help') : tr('settings')}</h2>${body}<button class="primary-btn" data-action="close">${help ? tr('gotIt') : tr('done')}</button></div></div>`;
}

function bind() {
  document.querySelector('.modal')?.addEventListener('click', event => event.stopPropagation());
  document.querySelectorAll('[data-action]').forEach(element => element.addEventListener('click', () => {
    const action = element.dataset.action;
    if (action === 'back' || action === 'home') back();
    if (action === 'theme') { state.theme = state.theme === 'light' ? 'dark' : 'light'; localStorage.theme = state.theme; render(); }
    if (action === 'help' || action === 'settings') { state.modal = action; render(); }
    if (action === 'close') { state.modal = null; render(); }
    if (action === 'more') { state.showAll = true; render(); }
    if (action === 'xmode') { state.xMode = !state.xMode; render(); }
    if (action === 'clear') clearBoard();
    if (action === 'undo') undo();
    if (action === 'hint') hint();
    if (action === 'submit') submit();
    if (action === 'clock') { state.clockHidden = !state.clockHidden; render(); }
    if (action === 'music') { setMusic(!state.musicEnabled); render(); }
  }));
  document.querySelectorAll('[data-locale]').forEach(element => element.addEventListener('change', event => {
    state.locale = supportedLocale(event.target.value);
    localStorage.locale = state.locale;
    render();
  }));
  document.querySelectorAll('[data-case]').forEach(element => { element.onclick = () => openCase(element.dataset.case); });
  document.querySelectorAll('[data-difficulty]').forEach(element => { element.onclick = () => { state.difficulty = element.dataset.difficulty; render(); }; });
  document.querySelectorAll('[data-person]').forEach(element => { element.onclick = () => { state.selected = Number(element.dataset.person); state.xMode = false; render(); }; });
  document.querySelectorAll('[data-cell]').forEach(element => { element.onclick = () => { const [row, column] = element.dataset.cell.split(',').map(Number); setCell(row, column); }; });
  const sort = document.querySelector('[data-sort]');
  if (sort) { sort.value = state.sort; sort.onchange = () => { state.sort = sort.value; render(); }; }
}

render();
document.addEventListener('click', restoreMusicPreference);
