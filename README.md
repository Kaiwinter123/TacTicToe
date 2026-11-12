# TacTicToe

FC27 mixed with FM — the perfect mix of a good pack rush with the FM layout and play style.

Create your own club, open packs of real 2026/27 Premier League players, build your
squad, and play a full season home and away against all 20 clubs.

**Play it:** https://kaiwinter123.github.io/tactictoe/

---

### Project structure

The game is one self-contained page. To keep it readable, the source is split into
groups under `src/`, and a small build step stitches them back into the single
`index.html` that GitHub Pages serves.

```
src/
  _head.html        <title>, fonts and page meta
  styles.css        all of the game's CSS
  app.html          the HTML shell (#app mount point)
  js/
    01-data.js      clubs, players, prospects, Europe's Finest, packs, formations
    02-helpers.js   small utilities, game state, save/load persistence
    03-logic.js     squad selection, the league table, badges & shirts
    04-views.js     render loop + every screen (club, packs, squad, table, calendar, updates…)
    05-events.js    button / click handling and pack opening
    06-match.js     match engine, overlays, fan reactions, season flow
    07-boot.js      startup and sign-in
build.py            stitches src/ -> index.html (run after editing src/)
index.html          the built, deployable game (what Pages serves)
```

### Making changes

1. Edit the relevant file(s) in `src/`.
2. Run the build:

```bash
python3 build.py
```

3. Commit `src/` and the regenerated `index.html`.

`build.py` also writes `floodlight-fc.html` (the claude.ai artifact build); it's
generated output and is git-ignored.

---

### Copyright

© 2026 Kai Winterbottom. All Rights Reserved.

This game and its source code are the property of Kai Winterbottom. You may play it
in your browser, but you may **not** copy, modify, redistribute, or host your own
copy of it without written permission. See [LICENSE](LICENSE) for full terms.

Unofficial fan project — not affiliated with the Premier League or any club.
Player and club names belong to their respective owners.
