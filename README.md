# Murdoku-inspired logic game

A dependency-free browser game with 36 original 6×6 murder-mystery cases, including 30 additional cases. Each case has one valid solution. Every case opens with a translated how-to-play dialog. Its connected, irregular rooms have distinct floor materials, architectural details, and illustrated fixtures. The board supports placing suspects, marking impossible cells, undo, hints, checking the answer, a timer, and saved progress.

Play online at <https://xiaoeyouxul.github.io/murdoku-inspired/>.

The interface, case details, suspect roles, and clues support English, French, Spanish, Arabic, Russian, Simplified Chinese, and Traditional Chinese. Arabic uses a right-to-left layout. Illustrated suspect portraits are original assets in `assets/portraits/`.

## Open the game on Windows

1. Install Node.js if it is not already installed: <https://nodejs.org/>.
2. Open PowerShell in this project folder (`数独 2`).
3. Run `npm run serve` (or `node serve.mjs`).
4. Keep that PowerShell window open, then visit <http://127.0.0.1:4173/> in your browser.

The server runs on your own computer. If the browser says it refused the connection, the server usually is not running: start it in PowerShell and leave that window open. If port 4173 is already in use, close the other server using it, then try again.

The published site uses GitHub Pages. The page and asset links are relative so the game works from a project repository path.

Run `node --test test/puzzles.test.js test/i18n.test.js` to check solutions and translations.
