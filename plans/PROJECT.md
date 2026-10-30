# PROJECT.md — Rempel-Elektro website relaunch

Authoritative plan for replacing <http://www.rempel-elektro.de/>. Read `AGENTS.md` for the working
rules; this file holds findings, decisions and page specifications. If a task conflicts with this
plan, update the plan first, then the code.

Repo placement: `AGENTS.md` at repo root, this file at `plans/PROJECT.md`. Both are authored here
in Plan mode and copied into the repository once build mode is enabled.

---

## 1. Findings from the existing site

Extracted from the live site on 2026-10-30.

### Structure and markup

| Aspect | Current state |
| --- | --- |
| Pages | `index.html` + `impressum.html`. Nothing else — no per-service pages. |
| Markup | XHTML 1.0 Transitional, table-based layout, spacer cells, `border="0"` |
| Encoding | `iso-8859-1`, no `lang` attribute |
| Mobile | No `meta name="viewport"` → unusable on phones |
| Body text | Inside `<pre>` tags — preformatted text used as a layout device |
| Assets | `LOGO.gif` (473×125 WordArt, blue→magenta gradient + lightning bolt), `shadowtop.jpg` background |
| Favicon | None |
| Meta / OG / canonical | None |
| CSS | Essentially none |
| JS | None |
| HTTPS, robots.txt, sitemap | Not present |
| Datenschutzerklärung | **Missing** — the biggest legal gap on the current site |

### Content on the current start page

Service list (verbatim): *Planung und Beratung, Kundendienst, Elektroinstallation,
Antennenanlagen, Photovoltaik.* Plus a headline and the contact block. No service descriptions, no
work-region statement, no references, no opening hours, no mention of qualifications beyond the
Impressum title.

### Impressum — canonical facts (verbatim from the live page)

```
Firma:     Rempel-Elektro
Inhaber:   Nikolai Rempel, Dipl. Ing. (FH)
Anschrift: Chemnitzer-Str. 4, 64720 Michelstadt
Telefon:   06061 - 70 31 96
Fax:       06061 - 70 31 97
Mobil:     0170 - 514 562 5
E-Mail:    nikolai.rempel@freenet.de
Kammer:    Handwerkskammer Frankfurt-Rhein-Main, Betriebs-Nr. 4165157 (www.hwk-rhein-main.de)
USt-IdNr.: DE 245119682
```

The old Impressum also contains a link to the EU Streitbeilegungsplattform and references the old
statutes. Both are removed in the rebuild — see section 2.

### Verdict

The existing site is a ~2005-era static page: two URLs, no responsive support, no privacy policy,
no machine-readable contact data. Rebuilding is cheaper than remediating, but all *content* is
already minimal, so the rebuild is mostly a design and structure task, not a migration.

## 2. Legal constraints (verified, not from memory)

Checked against the current statutes and the 2024/2025 changes. These are hard requirements for
this build, not legal advice for the client.

| Rule | Why | How it applies here |
| --- | --- | --- |
| Impressum basis: **§ 5 DDG** + **§ 18 MStV** | The Digitale-Dienste-Gesetz replaced the TMG on 14 May 2024; the old wording is outdated and would look careless. | Never write `§ 5 TMG`; never reference `RStV`. |
| **No EU OS-Streitbeilegungsplattform link** | The platform was shut down on 20 July 2025. A dead or misleading link is competition-law attackable. | Removed from the Impressum entirely. |
| **No § 36 VSBG notice** | Obligatory only for online businesses with **more than 10 employees**. Rempel-Elektro is below that. | Not added — not even "for completeness". |
| Impressum content | Name, ladungsfähige postal address (no PO box, no virtual office), phone, e-mail, Kammer with Betriebs-Nr., USt-IdNr. | All present, Fax included deliberately per client decision. |
| Datenschutzerklärung | Art. 13/14 DSGVO require a privacy notice; the current site has none. | Mandatory page. Content describes reality: nothing happens. |
| Self-hosted fonts | Loading fonts from a CDN transmits the visitor's IP to a third party and needs consent management. | Inter subset served from own `assets/fonts/`, OFL licence. |
| No third-party embeds | Google Fonts, Maps iframe, analytics, social plugins all create DSGVO-relevant data transfers. | None. Address → plain external Google Maps link with `rel="noopener"`. |
| No cookie banner | No tracking, no technically unnecessary cookies → no consent case exists. | Banner not implemented; must stay absent if nothing changes. |
| No contact form | A form would require AVV / data-minimisation wording and a legal basis. | Direct channels only: `tel:`, `mailto:`, Fax, address. |

If any analytics or embed is ever added, the Datenschutzerklärung and the consent position must be
rewritten at the same time. That is the trigger condition, not an optional cleanup.

Also deliberately **not** claimed anywhere: "Meisterbetrieb", Meister title, certifications,
Innung membership. The current Impressum states `Dipl. Ing. (FH)` only.

---

## 3. Stack and technical decisions

| Area | Decision | Rationale |
| --- | --- | --- |
| Generator | Eleventy 3.x with Nunjucks | Static output, no runtime, no DB. Small site, few pages — Eleventy's directory/data layer is enough. |
| Environment | Node 24, npm 11 (installed) | Nothing to install beyond dev dependencies. |
| Styling | Single plain modern CSS file, custom properties | No Sass, no Tailwind, no CSS-in-JS. Keeps output inspectable and dependency-free. |
| JavaScript | None, apart from the JSON-LD block | Header nav is always visible and wraps on small screens; nothing needs JS. No bundler. |
| Fonts | Inter, Latin-subset `woff2`, self-hosted via npm | OFL licence, preloaded, `font-display: swap`, no third-party request. |
| Imagery | Hand-written inline SVG icons + SVG logo | `currentColor`, no raster assets, no image CDN. |
| Structured data | `schema.org/Electrician` JSON-LD built from `_data/site.js` | Contact details become machine-readable. |
| Output | `_site/`, never committed, never hand-edited | Standard Eleventy output. |

Dependencies: `@11ty/eleventy`, `@11ty/eleventy-navigation-validator`-free (not needed),
`@fontsource-variable/inter` for the font files. That is the whole list.

## 4. Site structure

Deliberately compact: 5 URLs plus a 404. A handwerk business with five services does not need a
12-page site; more pages means more things to keep legally correct.

```
/                Start              hero, services teaser, ablauf, region, contact
/leistungen/     Leistungen         one page, five anchored sections (h2 + id per service)
/kontakt/        Kontakt            phone, mobile, e-mail, fax, address, Maps link
/impressum/      Impressum          § 5 DDG, § 18 MStV
/datenschutz/    Datenschutz         Art. 13/14 DSGVO
/404.html        Seite nicht gefunden  404, links back to start and contact
```

Why one Leistungen page instead of five: the five services are each a few sentences. Splitting
them into five URLs produces thin, near-duplicate pages that Google disfavours and multiplies the
places where copy can go stale. Anchored sections with `id` give deep links
(`/leistungen/#photovoltaik`) without separate pages.

Permalinks use clean German URLs with trailing slash. Navigation: Start, Leistungen, Kontakt.
Footer always carries Impressum + Datenschutz, because legal pages must be reachable from every
page — that is a convention Google and the law expect.

---

## 5. Page specifications

Every page: `<h1>` exactly once, `<title>` and `meta name="description"` in German, canonical,
Open Graph (`og:title`, `og:description`, `og:url`, `og:type`, `og:image` from the SVG logo → PNG
fallback), `lang="de"`.

### 5.1 Start (`/`)

| Block | Content |
| --- | --- |
| Hero | Short, benefit-led German headline about electric work in Michelstadt and the Odenwald. Sub-line. Primary CTA "Anrufen" (`tel:`), secondary "Kontakt aufnehmen". No photo. |
| Leistungen teaser | Five cards with one inline-SVG icon each, one sentence per service, link to the anchor. |
| So läuft die Zusammenarbeit | 3 steps: contact → assessment → execution. Generic, no invented certifications or hours. |
| Region | Text: Michelstadt, Odenwald, Odenwaldkreis and surrounding communities. Plain text, no map embed. |
| Kontakt block | Phone number as the dominant element; mobile, e-mail, address. |
| Footer | Company name, address, phone, legal links. |

Deliberately absent: trust badges, "Meisterbetrieb" seal, testimonials, reference counters,
opening hours. No empty placeholders for references — the client supplies them later.

### 5.2 Leistungen (`/leistungen/`)

Five `<section>` blocks, each with `id`, `<h2>` and icon:

| `id` | Heading | Copy direction |
| --- | --- | --- |
| `planung-beratung` | Planung und Beratung | Vorab einschätzen, Fördermittel und Normen, klarer Plan. Scope is advice, not engineering sign-off. |
| `kundendienst` | Kundendienst | schnell erreichbar, Fehler finden, Reparaturen, Wartung, Notfälle. |
| `elektroinstallation` | Elektroinstallation | Verteilungen, Leitungen, Steckdosen, Beleuchtung, Prüfungen. |
| `antennenanlagen` | Antennenanlagen | SAT, DAB, Kabel, Empfang, Justierarbeiten. |
| `photovoltaik` | Photovoltaik | PV auf dem Dach, Wechselrichter, Speicher, Anschluss an die Hausinstallation, Einspeisung. |

Each section ends with a phone CTA. Each paragraph states things an electrician of this size can
actually deliver — no claims about guaranteed response times or certifications.

### 5.3 Kontakt (`/kontakt/`)

- Telefon, Mobil, E-Mail, Fax as clickable links. `tel:` hrefs strip spacing.
- Address as `<address>` with a plain Google Maps link (external, `rel="noopener"`), no iframe.
- No form, no opening-hours block, no "Nachricht senden" placeholder.
- A short note on reaching the business by phone is the only filler.

### 5.4 Impressum (`/impressum/`)

Order: Firmeninhaber → ladungsfähige Anschrift → Telefon + Fax + E-Mail → Kammer mit
Betriebs-Nr. → USt-IdNr. → Haftungsausschluss (short) → copyright. Basis: `§ 5 DDG`,
`§ 18 MStV`. No `§ 36 VSBG`, no OS-Streitbeilegung link.

### 5.5 Datenschutz (`/datenschutz/`)

Structured as: Verantwortliche (same block as Impressum) → Grundsatz (keine personenbezogenen
Daten erhoben, keine Cookies, kein Analytics, keine Drittanbieter) → Server-Logdateien with the
honest caveat that hosting determines log storage, phrased so it stays true without naming an
unknown host → Kontaktwege (E-Mail/Telefon as the data processing) → Rechte der Betroffenen
(Art. 13/14 Abs. 2/3) → Recht auf Beschwerde (Art. 77) → Hinweis on keeping it current.
Explicitly states that no cookie banner exists because nothing is tracked.

### 5.6 404 (`/404.html`)

German, short, links back to Start and Kontakt. Served as `404.html` so most hosts pick it up
without configuration.

## 6. Design system

Implemented as custom properties in `assets/css/styles.css`.

### Colour

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | slate-navy `#12202b` | body text, headings |
| `--surface` | `#ffffff` | page background |
| `--surface-soft` | `#f4f7f9` | cards, section bands |
| `--line` | `#d7e0e7` | borders, dividers |
| `--brand` | blue `#1a5fb4` | links, headings accent, nav active |
| `--brand-dark` | `#12447d` | link hover, focus |
| `--accent` | amber `#e08a1f` | fill of the phone CTA, focus ring on dark surfaces — never text on white (2.7:1) |
| `--accent-dark` | `#a35a06` | accent hover, phone number as text — AA on white and `--surface-soft` |

Amber is reserved for things the visitor can act on. Text on amber meets AA at bold `18 px` and
up; body-size text never sits on amber. The old blue→red WordArt gradient survives only as the
gradient inside the SVG lightning bolt in the logo — brand recognition without looking WordArt.

### Type

- Inter, self-hosted Latin-subset `woff2`, variable weights. `font-display: swap`, preloading the
  regular and semibold subsets.
- Fluid scale via `clamp()`: body `1.0625rem`→`1.125rem`, h1 `2rem`→`3rem`, h2 `1.5rem`→`2rem`.
- Line height 1.55 body, 1.15 headings. Max text measure ~68 characters.

### Layout

- Mobile-first, single column. Layout breakpoints at 640 and 768 px. Content max width
  `--maxw: 1024 px`, gutters via `clamp()`. There is deliberately no 1024 px media query: the
  max-width cap already handles it, and the 768 px three-column grid is the final layout state.
  Nothing above 1024 px may break — that is what the cap guarantees.
- Header: logo + three links, no JS. Implemented as an always-visible nav that wraps with
  `flex-wrap` below 640 px instead of a hamburger disclosure — three links are short enough not
  to need one, and a hidden nav would hide the page's most important content.
- Cards: `--surface-soft` background, 1 px `--line` border, radius 10 px, shadow only on hover.
- `prefers-reduced-motion` respected; transitions ≤ 150 ms, none when reduced.

### Icons and logo

- One inline-SVG stroke system: 24×24 viewBox, 1.5 stroke, round caps, `currentColor`,
  `aria-hidden="true"`. Five service icons plus phone, mail, fax, location, arrow.
- Logo: hand-written SVG wordmark, bolt as the gradient element. Inline in the header so it
  inherits colour and needs no HTTP request. PNG fallback for favicon and OG image.
- Favicon: SVG favicon plus 32/180 px PNG fallbacks, `site.webmanifest` with theme colour.

### Accessibility

- Visible focus ring using `--brand` on white and `--accent` on dark surfaces, ≥ 3:1 against
  background.
- `aria-label` on icon-only links; skip link at the top; `aria-current="page"` on active nav.
- Phone CTA is a real link with text, never an icon-only button.

---

## 7. Repository and files

Eleventy 3's default data and includes directories sit at the project root, beside `content/`:

```
package.json          scripts + dev dependencies only
eleventy.config.js    content/data/includes dirs, permalinks, output, asset passthrough,
                      `icon` filter, `isoDate` filter, `sitemap` collection
content/
  index.njk
  leistungen.njk
  kontakt.njk
  impressum.njk
  datenschutz.njk
  404.njk
  sitemap.xml.njk     → sitemap.xml (from the `sitemap` collection + `isoDate` filter)
  robots.txt.njk      → robots.txt
_data/site.js         company data: name, address, phone, fax, mobile, e-mail, Kammer,
                      USt-IdNr, url, nav — single source of truth
_data/services.js     the five services with copy, used by index, leistungen and JSON-LD
_includes/
  layouts/base.njk
  components/header.njk, footer.njk, cta.njk, logo.njk, seo.njk, jsonld.njk
                      icons are inlined via the `icon` filter in eleventy.config.js
                      (its output is a Nunjucks `SafeString`: Eleventy auto-escapes filter
                      results, which would print the markup as text instead of an element)
assets/
  css/styles.css      one file, custom properties, ~15 KB target
  fonts/              Inter subset woff2, copied from node_modules via passthrough
  icons/              .svg sources, inlined into templates at build time
  favicon/            favicon.svg + PNG fallbacks
  img/                og-image.png (rendered from favicon.svg geometry)
site.webmanifest
.gitignore            _site/, node_modules/
AGENTS.md
plans/PROJECT.md
```

`_data/site.js` shape (values as in section 1, displayed with German spacing, hrefs without
spacing):

```js
module.exports = {
  name: 'Rempel-Elektro',
  owner: 'Nikolai Rempel',
  title: 'Dipl.-Ing. (FH)',
  street: 'Chemnitzer-Str. 4',
  zip: '64720',
  city: 'Michelstadt',
  region: 'Odenwald',
  phone: '06061 - 70 31 96',
  phoneHref: 'tel:06061703196',
  fax: '06061 - 70 31 97',
  faxHref: 'tel:06061703197',
  mobile: '0170 - 514 562 5',
  mobileHref: 'tel:01705145625',
  email: 'nikolai.rempel@freenet.de',
  kammer: 'Handwerkskammer Frankfurt-Rhein-Main',
  betriebsnummer: '4165157',
  ustIdNr: 'DE 245119682',
  url: 'https://www.rempel-elektro.de',   // final domain pending client confirmation
};
```

---

## 8. Build phases

Ordered so each phase ends in something verifiable. Nothing starts before the plan is in the repo.

| # | Phase | Output / check |
| --- | --- | --- |
| 1 | Docs into repo | `AGENTS.md`, `plans/PROJECT.md`, `.gitignore`, first commit |
| 2 | Scaffold | `npm init`, Eleventy installed, `eleventy.config.js`, `_data/site.js`, layouts. `npm run build` produces `_site/index.html`. |
| 3 | Design system | `styles.css` with tokens, type scale, header/footer, always-visible wrapping nav. Rendered with real data. |
| 4 | Logo + icons | SVG wordmark, 5 service icons, contact icons, favicon, manifest. Visual check in header. |
| 5 | Fonts | Inter subset installed, passthrough copy, `@font-face`, preload, `font-display: swap`. No FOUC, no layout shift. |
| 6 | Start page | Full German copy, hero, teaser cards, ablauf, region, contact block. |
| 7 | Leistungen | Five anchored sections + icons + per-section CTA. |
| 8 | Kontakt | Contact channels, address, Maps link. |
| 9 | Legal pages | Impressum + Datenschutz, correct statutes, footer links live on both. |
| 10 | SEO + 404 | Titles, descriptions, canonical, OG, JSON-LD, `sitemap.xml`, `robots.txt`, `404.html`. |
| 11 | A11y + responsive pass | Keyboard walk-through, contrast check, widths at 320/640/768/1024/1440, Lighthouse ≥ 90. |
| 12 | Client review round | Copy corrections, open items from section 9, hosting decision. |

---

## 9. Open items (client)

Tracked so nothing gets silently invented. Do not write around them.

| Item | Status | Consequence until resolved |
| --- | --- | --- |
| Meister title / qualification | Unknown | No "Meisterbetrieb" wording anywhere; Impressum shows `Dipl.-Ing. (FH)`. |
| Öffnungszeiten | Not provided | No hours block. Kontakt page states phone contact only. |
| Project photos / references | Deferred, will be provided later | No gallery markup, no empty slots, no placeholder images. |
| Trust info (Innung, certifications) | Will be provided later | No badges, no seals. |
| Hosting provider / final domain | Unknown | Canonical and OG URLs use the known `rempel-elektro.de` domain; revisit after hosting decision. |
| HTTPS on the old server | Unknown | Rebuild assumes HTTPS available. |

---

## 10. Risks and how they are handled

| Risk | Handling |
| --- | --- |
| Outdated legal statutes in templates | Verified in section 2. `§ 5 DDG` / `§ 18 MStV` only; re-check before release. |
| Client adds analytics later | Triggers rewrite of Datenschutzerklärung plus consent management; documented in AGENTS.md § 5. |
| Invented marketing claims | Forbidden by AGENTS.md § 4. Copy review before release. |
| Missing photos making the site look empty | Layout has no photo slots; region + service text carry the page. |
| Font licensing | Inter is OFL; licence file shipped next to the subset. |
| Broken `tel:` links on mobile | Hrefs stripped of spacing and dashes, verified by a manual click test. |

---

## 11. Acceptance checklist

Before hand-off:

- [x] `npm run build` clean, no Nunjucks errors, no dead links in `_site/` (checked: all `href`/`src`
      resolve, all in-page anchors have a matching `id`).
- [x] 5 URLs + 404 reachable; footer legal links present on every page. Verified against the local
      dev server: all five routes return `200`, every referenced asset (CSS, `woff2`, favicons,
      `og-image.png`, manifest, sitemap, robots) returns `200`, an unknown path returns `404`.
      `404.html` is served as the error page by the host, not by Eleventy's dev server — the host
      configuration is part of the hosting decision in phase 12.
- [x] Impressum cites `§ 5 DDG` + `§ 18 MStV`, no `TMG`/`RStV`, no OS link, no `§ 36 VSBG`.
- [x] Datenschutz describes only what actually happens; no cookie banner.
- [x] Zero third-party requests in the HTML (no CDN fonts, no iframe, no pixel). The only external
      reference is the plain Google Maps link on Kontakt, `rel="noopener"`.
- [x] All contact numbers clickable and correct, Fax included (`tel:` hrefs stripped:
      `06061703196`, `06061703197`, `01705145625`).
- [x] `lang="de"`, one `<h1>` per page, heading order intact, skip link, focus visible.
      Verified in the build output: `lang="de"` on every page, exactly one `<h1>`, no heading level
      jumps, skip link present. Focus rings now meet 3:1 (see below). Because the nav has no JS and
      nothing is hidden or reordered, keyboard reachability is structural; a browser walk-through on
      the served site still remains for phase 12.
- [x] Contrast AA; no horizontal scroll. All text pairs computed against WCAG relative luminance:
      body text 16.6:1, secondary text 7.5:1, links 6.3:1, footer 9.5–14.2:1, CTA label 6.5:1 on
      amber and 5.2:1 on `--accent-dark`, skip link 9.8:1. Focus rings: `--brand` 6.3:1 on white,
      5.8:1 on `--surface-soft`, `--accent` 6.2:1 on the dark footer; `outline-offset` keeps the
      ring on the page background, so it never has to beat the element's own fill. The only pair
      below threshold is `--line` 1.3:1 — decorative separation, not a required boundary indicator
      (WCAG 1.4.11 applies to informative boundaries, and cards use headings, borders and spacing
      to structure content, not colour). `--accent` is never used as text on white. No fixed widths
      beyond the `--maxw` cap, `overflow-wrap: break-word` on body, fluid `clamp()` type and
      wrapping flex/grid — so nothing overflows between 320 px and 1440 px.
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
- [ ] JSON-LD parses (Rich Results test), sitemap + robots live.
      JSON-LD parses locally (`Electrician`), sitemap and robots are generated; the Rich Results
      test needs a served URL.
- [x] No empty reference/photo placeholder markup.
- [x] Open items in section 9 untouched, no invented facts.

---

## 12. Progress

One checkbox per build phase from section 8, ticked when that phase is done and verified.
`[~]` marks a phase that is partly done: what can be verified offline is done and recorded, the
rest needs a served URL.

- [x] 1 Docs + first commit — `AGENTS.md`, this file, `.gitignore`
- [x] 2 Scaffold — Eleventy 3 config, `_data/site.js`, `_data/services.js`, layouts
- [x] 3 Design system — `styles.css` tokens, type scale, header/footer/nav
- [x] 4 Logo + icons — SVG wordmark, 10 icons, favicon + PNG fallbacks, manifest
- [x] 5 Fonts — Inter variable Latin subset self-hosted, preloaded, OFL file shipped
- [x] 6 Start page — hero, service teasers, Ablauf, Region, contact block
- [x] 7 Leistungen — five anchored sections with icons and per-section CTA
- [x] 8 Kontakt — phone/e-mail/-address blocks, Fax, Maps link
- [x] 9 Legal pages — Impressum (§ 5 DDG, § 18 MStV) and Datenschutz
- [x] 10 SEO + 404 — titles, canonical, OG image, JSON-LD, sitemap, robots, 404
- [~] 11 A11y + responsive pass — contrast computed (all AA/3:1), focus rings fixed, skip-link
           overflow fixed; responsive pass done in Chrome (G2): 30 full-page screenshots, 6 routes
           × 5 widths (320–1440 px), measured clean and reviewed by eye; contact-row label wrap
           fixed. Keyboard walk-through + Lighthouse in the browser still pending (G3, G4)
- [ ] 12 Client review round — copy corrections, open items, hosting decision

---

## 13. Goals — remaining work

One goal per step. Each goal is small enough to hold in context, ends in a check, and gets its own
commit. Work them in order; a goal is not started before the previous one is committed.

| Goal | Scope | Done when | Status |
| --- | --- | --- | --- |
| G1 | Docs commit: record this goal list + the served-routes finding in § 11 | `git status` clean, docs commit | done |
| G2 | Visual pass in Chrome against the local dev server: screenshots of every page at 320 / 640 / 768 / 1024 / 1440 px | No overlap, truncation or horizontal scrollbar; findings either fixed or recorded | done — § 11 |
| G3 | Lighthouse ≥ 90 on the served local site (all five routes): performance, accessibility, best practices, SEO | Scores ≥ 90, fixes applied, summary recorded in § 11 | next |
| G4 | Keyboard + focus walk-through in Chrome: Tab order, visible focus ring, skip link, icon-link labels | Tab order matches reading order, ring visible everywhere, no trap | open |
| G5 | Hosting decision: final domain, HTTPS, `404.html` as error page, `sitemap:` line reachable | Canonical + OG URLs match the live domain; live smoke test | open |
| G6 | Copy review round with the client | Corrections applied, no invented claims, final German wording | open |
| G7 | Open items from section 9 (Meistertitel, Öffnungszeiten, photos/references, trust info) | Each item either supplied and integrated, or explicitly marked not applicable | open |
| G8 | Release check on the live site: Rich Results test, OG scrape, sitemap + robots live, 404 behaviour | § 11 fully `[x]`, ready for hand-off | open |

Order: G1 → G2 → G3 → G4 are offline-verifiable now (local dev server + installed Chrome).
G5 → G8 need the client's hosting decision and copy feedback, so they wait.

G2 was run outside the repo: a plain Node script driving headless Chrome over the DevTools Protocol
(no dependency added, no Puppeteer), with a per-route, per-width viewport override, a full-page
`captureBeyondViewport` screenshot and an in-page audit of `scrollWidth`, overflowing, clipped and
overlapping elements, plus console and network errors. Two harness artefacts worth remembering for
G3/G4: a horizontal-scrollbar the harness once reported came from a dev server still serving markup
from before the icon fix — a stale build, not a layout bug, gone after a rebuild; and the dark band
at the top of the full-page PNGs is a `captureBeyondViewport` artefact, not a page bug. The tiles
reviewed by eye were clipped to legible slices instead of full pages, which is what makes them sharp.
