# QA log

Measurements and harness notes moved out of `plans/PROJECT.md` (§11, §13). Recorded 2026-10/11.

## Results

- [x] Visual pass in Chrome (G2): 30 full-page screenshots — 6 routes (`/`, `/leistungen/`,
      `/kontakt/`, `/impressum/`, `/datenschutz/`, `/404.html`) at 320 / 640 / 768 / 1024 / 1440 px,
      captured through the Chrome DevTools Protocol against the local dev server (viewport override,
      `captureBeyondViewport`, no layout hacks or JS emulation). Every capture measured in-page:
      `document.scrollWidth` never exceeds the viewport, no horizontal scrollbar, no element
      overflowing the viewport, no clipped text node, no overlapping text node, no console or
      network error. On top of the measurements, tiles of every page were read by eye at each
      route/width: nothing truncated, no word cut off, header and footer intact at all five widths.
      Findings in the two paragraphs below.
      One fix: the contact rows on Kontakt/Start let a long label break mid-word ("Umsatzsteuer-",
      "Identifikationsnummer") and the value dropped to a ragged second line, so `.contact-list .label`
      is now `flex: none; white-space: nowrap` and the row `flex-wrap: wrap` — the value wraps below
      its label instead of the label wrapping mid-word.
      Recorded, no fix needed: the longest words anywhere in the pages are `nikolai.rempel@freenet.de`,
      `Umsatzsteuer-Identifikationsnummer`, `Datenschutzgrundverordnung`, `Datenschutz-Aufsichtsbehörde`;
      none of them exceeds its box at any width (`overflow-wrap` only kicks in below 320 px, which is
      not a supported width). `document.scrollWidth` equals viewport minus the ~15 px scrollbar gutter
      on scrolling pages; `/404.html` reports the exact viewport width because that page is short
      enough not to scroll — that is the reason it differs, not an overflow.
- [x] Lighthouse ≥ 90 in Chrome (G3): Lighthouse CLI 13.6.0, all four categories, all six routes
      (`/`, `/leistungen/`, `/kontakt/`, `/impressum/`, `/datenschutz/`, `/404.html`), measured
      against two servers on purpose — the Eleventy dev server on port 8081 and a static
      production-like server on port 8091 (harness note in section 13). Mobile form factor with
      Lighthouse's default simulated throttle (4× CPU, 4 Mbps / 55 ms RTT) is the primary evidence:
      **100 / 100 / 100 / 100 on all six routes on both servers**. Desktop form factor as extra
      evidence: 99 performance (98 for `/leistungen/` on the dev server), 100 on the other three
      categories — everything at or above 90. Measured on the production-like run: FCP, LCP, TTI and
      Speed Index all 751–753 ms (identical, because the page paints in one go — there is no JS),
      TBT 0 ms, CLS 0, main-thread work 0.2–0.3 s, total weight 54–56 KiB transferred, of which
      48.4 KiB is the preloaded Inter subset, 2.97 KiB gzip stylesheet, 1.9–4.2 KiB document,
      `script` and `third-party` resources: 0. The dev server reports 73–83 KiB because it injects
      `.11ty/reload-client.js` (10.7 KiB) — harness noise, not page weight. Accessibility 100
      confirms the contrast, focus and heading work above; best practices and SEO 100 confirm no
      console errors, no unused violations and complete meta, `lang`, viewport and link-name data on
      every page. **No repo fix was needed**: every audit below its passing threshold has
      `weight = 0`, so none of them contributes to the performance score. The non-scoring insights
      that remain are `cache-insight` (≈ 51 s / 50 KiB "savings" — the test server sends no cache
      headers on purpose, so that belongs to the hosting decision in phase 12, not to the markup),
      `render-blocking-insight` 65–125 ms (`styles.css` was the single render-blocking stylesheet
      at the time of this measurement, and at 2.97 KiB gzip it is most of the page's transfer cost
      already). Since then the tokens were split out into `variables.css` and renamed with the
      `lcl` prefix, so the insight now covers two small sheets — 1.65 + 3.76 KiB gzip — fetched
      in parallel from the same origin instead of one, still render-blocking by design, with no
      `@import` to serialise them.
      `document-latency-insight` and `network-dependency-tree-insight`, plus on the dev server only
      `unminified-css` ≈ 3 KiB and `unminified-javascript` ≈ 4 KiB, both from the reload client.
      `/404.html` scores 100 on either server: it is a real file, so it returns `200` and
      `http-status-code` passes; the static server still answers a genuine `404` for an unknown path
      (`/keine-seite/` verified).
- [x] Keyboard walk-through in Chrome (G4): real key presses, not programmatic focus. Headless
      Chrome over the DevTools Protocol (`Input.dispatchKeyEvent`), all six routes at two sizes each —
      mobile 390×720 and desktop 1280×900 — measured on the same two servers as G3 (static
      production-like server on 8091, Eleventy dev server on 8081): **12 runs, 172 focus stops,
      0 problems on both servers**. Tab order matches reading order: every stop is recorded by its
      document-order index, and each run stepped through `0..n-1` with no missing or extra stop
      (20 stops on `/` and `/404.html`, 16 on `/leistungen/`, 15 on `/kontakt/`, 12 on `/impressum/`,
      11 on `/datenschutz/`). No focus trap and nothing to leave: Tab on the last stop cycles back to
      the first element, and the Shift+Tab walk down from the end cycles the same way, in both
      directions and both sizes. The skip link is the first stop and works — Tab lands on it, Enter
      moves focus to `main#inhalt` and scrolls it into view (118 px on mobile, 76 px on desktop, 0 on
      `/404.html` because that page does not scroll). Focus visible on every stop: exactly two ring
      styles exist in the build — `3px solid` in `--lcl-color-brand`, and `3px solid` in `--lcl-color-accent` inside the
      dark footer, both `outline-offset: 2px`. Measured against the painted page the weakest ring is
      6.17:1 (footer links on `--lcl-color-ink`), the lowest overall 5.84:1 (Kontakt links on `--lcl-color-surface-soft`),
      so every ring clears the 3:1 non-text minimum by a wide margin. Chrome's own accessibility tree
      (`Accessibility.getFullAXTree`) names every link: **0 unnamed links**, because the `icon` filter
      already wraps each icon in an `aria-hidden` span and the logo is `aria-hidden` /
      `focusable="false"` — no markup change was needed. No stop was invisible, no stop sat outside
      the viewport, no run produced a console error or a failed request, and `document.scrollWidth`
      matched the viewport on every run (390 mobile, 1265 desktop with the scrollbar gutter, 1280 on
      `/404.html`). Nothing in the CSS reorders content — no `order`, `grid-area`, `direction` or
      `*-reverse`, no `tabindex` above 0 — which is why document order is reading order.

## Harness notes

G2 was run outside the repo: a plain Node script driving headless Chrome over the DevTools Protocol
(no dependency added, no Puppeteer), with a per-route, per-width viewport override, a full-page
`captureBeyondViewport` screenshot and an in-page audit of `scrollWidth`, overflowing, clipped and
overlapping elements, plus console and network errors. Two harness artefacts worth remembering for
G3/G4: a horizontal-scrollbar the harness once reported came from a dev server still serving markup
from before the icon fix — a stale build, not a layout bug, gone after a rebuild; and the dark band
at the top of the full-page PNGs is a `captureBeyondViewport` artefact, not a page bug. The tiles
reviewed by eye were clipped to legible slices instead of full pages, which is what makes them sharp.

G3 was run the same way: outside the repo, nothing added to the project's dependencies. Lighthouse
CLI 13.6.0 lives in a temp directory and is invoked from there with
`--only-categories=performance,accessibility,best-practices,seo --output=json --chrome-flags=--headless=new`.
Two servers were measured on purpose. Eleventy's `--serve` injects `.11ty/reload-client.js`
(10.7 KiB), which Lighthouse counts as page weight plus two "unminified" assets, and it answers
every path with `200`; so the production-like numbers come from a zero-dependency Node static server
on port 8091 — real MIME types, gzip for text assets, `nosniff`, no cache headers, a genuine `404`
for unknown paths. Mobile with the default simulated throttle is the acceptance figure; desktop was
added as extra evidence. Two harness notes worth remembering for the next audit run:
`--form-factor=desktop` alone throws — it needs `--screen-emulation.mobile=false` — and the report
directory must exist before `--output-path` will write into it.

G4 used the same pattern: a plain Node script in the temp directory driving headless Chrome over the
DevTools Protocol (debug port 9335, its own profile directory, no Puppeteer, nothing added to the
project). Three things make it differ from a scripted focus check. It walks with **real key presses**
— `Input.dispatchKeyEvent` for Tab and Enter, never `element.focus()` — and reads each stop from the
live `document.activeElement`. It keys stops by their index in the focusable inventory
(`a[href],button,input,select,textarea,summary,[tabindex]:not([tabindex="-1"])`) instead of by class
or href, because those keys collide on repeated stops (`card__link` appears several times, the same
`tel:` href twice). Shift+Tab needs the `modifiers` bitmask — `modifiers: 8` — `shiftKey` is ignored.
The reverse walk runs on a freshly loaded page primed to the last stop with real Tab presses, and a
wrap back to the first element counts as "focus cycles, no trap" rather than a truncated walk. Ring
contrast is computed against the background colour painted under the ring, not the element's own
fill, and accessible names come from `Accessibility.getFullAXTree` rather than a heuristic. Both
servers were measured: the dev server's injected reload client adds no focusable element, so both
report identical stop counts.

