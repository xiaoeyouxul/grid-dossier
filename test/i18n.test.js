import test from 'node:test';
import assert from 'node:assert/strict';
import { cases } from '../src/puzzles.js';
import { caseRoom, caseText, clueText, difficultyLabel, localeInfo, roleLabel, supportedLocale, t } from '../src/i18n.js';
import { caseLocales } from '../src/case-locales.js';

test('all required interface locales have labels and Arabic uses RTL', () => {
  const interfaceKeys = ['caseNo', 'language', 'caseFiles', 'settings', 'theme', 'heroEyebrow', 'heroOne', 'heroTwo', 'heroDescription', 'investigation', 'release', 'difficulty', 'title', 'recent', 'popular', 'status', 'solved', 'revisit', 'open', 'viewAll', 'copyright', 'collection', 'howToPlayLink', 'back', 'help', 'row', 'column', 'suspects', 'suspectPrompt', 'selectPerson', 'evidence', 'clues', 'markImpossible', 'clear', 'undo', 'hint', 'submit', 'helpIntro', 'helpSelect', 'helpX', 'helpUndo', 'helpSubmit', 'toggle', 'clock', 'close', 'rules', 'preferences', 'gotIt', 'done', 'collectionStats', 'totalCases', 'solvedCount', 'progressCount', 'inProgress', 'caseAvailable', 'continueCase', 'solvedBoard', 'completedIn', 'caseClosed', 'solvedHeadline', 'backToCases', 'nextCase', 'revisitCaseNamed', 'openCaseNamed'];
  for (const locale of ['en', 'fr', 'es', 'ar', 'ru', 'zh-CN', 'zh-TW']) {
    for (const key of interfaceKeys) {
      assert.ok(t(locale, key), `${locale} should provide ${key}`);
      if (locale !== 'en') assert.notEqual(t(locale, key), key, `${locale} should translate ${key}`);
    }
    if (locale !== 'en') assert.notEqual(difficultyLabel(locale, 'Very Easy'), 'Very Easy');
  }
  assert.equal(localeInfo('ar').dir, 'rtl');
  assert.equal(localeInfo('zh-TW').dir, 'ltr');
  assert.equal(supportedLocale('fr'), 'fr');
  assert.equal(supportedLocale('unsupported'), 'en');
});

test('the original six cases also use localized titles, descriptions, places, rooms, and roles', () => {
  for (const locale of ['fr', 'es', 'ar', 'ru', 'zh-CN', 'zh-TW']) {
    for (const puzzle of cases.slice(0, 6)) {
      for (const field of ['title', 'place', 'desc']) {
        assert.ok(caseText(locale, puzzle, field), `${locale} ${puzzle.id} needs ${field}`);
        assert.notEqual(caseText(locale, puzzle, field), puzzle[field], `${locale} ${puzzle.id} ${field} should be localized`);
      }
      for (let index = 0; index < puzzle.areas.length; index++) {
        assert.ok(caseRoom(locale, puzzle, index), `${locale} ${puzzle.id} needs room ${index}`);
        if (index >= 3) assert.notEqual(caseRoom(locale, puzzle, index), puzzle.areas[index], `${locale} ${puzzle.id} room ${index} should be localized`);
      }
      for (const person of puzzle.people) assert.ok(roleLabel(locale, person[2], puzzle), `${locale} ${puzzle.id} needs role ${person[2]}`);
    }
  }
});

test('every added case has translated visible copy, rooms, and suspect roles in each supported locale', () => {
  const nonEnglishLocales = ['fr', 'es', 'ar', 'ru', 'zh-CN', 'zh-TW'];
  for (const locale of nonEnglishLocales) {
    for (const puzzle of cases.slice(6)) {
      const translation = caseLocales[locale]?.[puzzle.id];
      assert.ok(translation, `${locale} should contain ${puzzle.id}`);
      for (const field of ['title', 'place', 'desc']) {
        assert.ok(translation[field], `${locale} ${puzzle.id} needs a ${field}`);
        assert.equal(caseText(locale, puzzle, field), translation[field], `${locale} ${puzzle.id} should use its localized ${field}`);
        if (field !== 'place') assert.notEqual(caseText(locale, puzzle, field), puzzle[field], `${locale} ${puzzle.id} ${field} should not remain English`);
      }
      assert.equal(translation.areas?.length, puzzle.areas.length, `${locale} ${puzzle.id} should translate every room`);
      puzzle.areas.forEach((room, index) => assert.notEqual(caseRoom(locale, puzzle, index), room, `${locale} ${puzzle.id} room ${room} should be translated`));
      for (const person of puzzle.people) {
        assert.ok(translation.roles?.[person[2]], `${locale} ${puzzle.id} should translate role ${person[2]}`);
        assert.equal(roleLabel(locale, person[2], puzzle), translation.roles[person[2]], `${locale} ${puzzle.id} should use the localized role for ${person[2]}`);
      }
    }
  }
});

test('structured clue constraints render localized text instead of case-authored English prose', () => {
  const puzzle = cases[6];
  const clue = puzzle.clues[1];
  const translated = clueText('fr', puzzle, clue);
  assert.match(translated, /ligne/);
  assert.match(translated, /colonne/);
  assert.doesNotMatch(translated, /row \d|same two-column section|never shared/);
});

test('structured clues across all cases are rendered from constraints in every non-English locale', () => {
  for (const locale of ['fr', 'es', 'ar', 'ru', 'zh-CN', 'zh-TW']) {
    for (const puzzle of cases) {
      for (const clue of puzzle.clues) {
        const rendered = clueText(locale, puzzle, clue);
        assert.ok(rendered, `${locale} ${puzzle.id} should render clue ${clue.person}`);
        assert.notEqual(rendered, clue.text, `${locale} ${puzzle.id} should not show its English source clue verbatim`);
      }
    }
  }
});
