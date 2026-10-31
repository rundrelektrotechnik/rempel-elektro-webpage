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

Implemented as custom properties in `assets/css/variables.css` — the only `:root` block and the
only place literal values live. `assets/css/styles.css` holds the component rules and references
tokens through `var(...)`; both sheets are `<link>`ed in the head, tokens first, so neither needs
an `@import`.

Naming: every token is `--lcl-<function>-<name>`, so `--lcl-color-surface` became `--lcl-color-surface`.
`lcl` marks the property as belonging to this project and not to a library, and the second segment
states its function — `color`, `size`, `shadow`, `motion`. Because the project uses `--` modifiers
in class names (`btn--primary`), the prefix also makes a token impossible to confuse with a class
name fragment.

### Colour

| Token | Value | Use |
| --- | --- | --- |
| `--lcl-color-canvas` | blue-grey `#e9f0f7` | page background, the colour floor under everything |
| `--lcl-color-surface` | `#ffffff` | header, cards, sections that sit on the canvas |
| `--lcl-color-surface-soft` | `#d8e6f2` | cards, section bands |
| `--lcl-color-line` | `#c4d6e6` | borders, dividers |
| `--lcl-color-line-soft` | `#dbe8f3` | lighter separation |
| `--lcl-color-ink` | slate-navy `#12202b` | body text, headings |
| `--lcl-color-ink-soft` | `#44586b` | secondary text, meta lines |
| `--lcl-color-brand` | blue `#1a5fb4` | links, headings accent, nav active, focus ring on light surfaces |
| `--lcl-color-brand-dark` | `#12447d` | link hover |
| `--lcl-color-brand-deep` | `#0d2b46` | darkest blue, footer text on dark |
| `--lcl-color-brand-tint` | `#dfebf7` | tinted fill behind inline links |
| `--lcl-color-hero-1/2/3` | `#1d4269`→`#0c2539` | hero gradient, footer band |
| `--lcl-color-on-dark` | `#eaf3fa` | text on the dark surfaces |
| `--lcl-color-on-dark-soft` | `#bccfdf` | secondary text on the dark surfaces |
| `--lcl-color-accent` | amber `#e08a1f` | fill of the phone CTA, focus ring on dark surfaces — never text on white (2.7:1) |
| `--lcl-color-accent-dark` | `#a35a06` | accent hover, phone number as text — AA on white and `--lcl-color-surface-soft` |
| `--lcl-color-accent-light` | `#f6c172` | amber as text on a dark surface (8.0:1 on `--lcl-color-hero-2`) |
| `--lcl-color-accent-ink` | `#0b0702` | text on amber fills (7.5:1) |

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
  `--lcl-size-maxw: 1024 px`, gutters via `clamp()`. There is deliberately no 1024 px media query: the
  max-width cap already handles it, and the 768 px three-column grid is the final layout state.
  Nothing above 1024 px may break — that is what the cap guarantees.
- Header: logo + three links, no JS. Implemented as an always-visible nav that wraps with
  `flex-wrap` below 640 px instead of a hamburger disclosure — three links are short enough not
  to need one, and a hidden nav would hide the page's most important content.
- Cards: `--lcl-color-surface-soft` background, 1 px `--lcl-color-line` border, radius 10 px,
  shadow only on hover.
- `prefers-reduced-motion` respected; transitions ≤ 150 ms, none when reduced.

### Icons and logo

- One inline-SVG stroke system: 24×24 viewBox, 1.5 stroke, round caps, `currentColor`,
  `aria-hidden="true"`. Five service icons plus phone, mail, fax, location, arrow.
- Logo: hand-written SVG wordmark, bolt as the gradient element. Inline in the header so it
  inherits colour and needs no HTTP request. PNG fallback for favicon and OG image.
- Favicon: SVG favicon plus 32/180 px PNG fallbacks, `site.webmanifest` with theme colour.

### Accessibility

- Visible focus ring using `--lcl-color-brand` on white and `--lcl-color-accent` on dark surfaces,
  ≥ 3:1 against background.
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
  css/variables.css   the design tokens — the only :root block, the only literal values
  css/styles.css      component rules + @font-face, 16.7 KiB raw / 5.4 KiB gzip across both sheets
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
| 3 | Design system | `variables.css` tokens + `styles.css` type scale, header/footer, always-visible wrapping nav. Rendered with real data. |
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
      nothing is hidden or reordered, keyboard reachability is structural; it has been measured with
      real key presses on the served site — see the keyboard walk-through below.
- [x] Contrast AA; no horizontal scroll. All text pairs computed against WCAG relative luminance:
      body text 16.6:1, secondary text 7.5:1, links 6.3:1, footer 9.5–14.2:1, CTA label 6.5:1 on
      amber and 5.2:1 on `--lcl-color-accent-dark`, skip link 9.8:1. Focus rings: `--lcl-color-brand` 6.3:1 on white,
      5.8:1 on `--lcl-color-surface-soft`, `--lcl-color-accent` 6.2:1 on the dark footer; `outline-offset` keeps the
      ring on the page background, so it never has to beat the element's own fill. The only pair
      below threshold is `--lcl-color-line` 1.3:1 — decorative separation, not a required boundary indicator
      (WCAG 1.4.11 applies to informative boundaries, and cards use headings, borders and spacing
      to structure content, not colour). `--lcl-color-accent` is never used as text on white. No fixed widths
      beyond the `--lcl-size-maxw` cap, `overflow-wrap: break-word` on body, fluid `clamp()` type and
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
- [x] 3 Design system — `variables.css` tokens, `styles.css` type scale, header/footer/nav
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
           fixed; Lighthouse done (G3): 100 / 100 / 100 / 100 on all six routes, on both servers;
           keyboard walk-through done (G4): 12 runs, 172 focus stops, 0 problems on both servers —
           Tab order equals reading order, skip link first and working, ring visible on every stop,
           no focus trap. Only the Rich Results test (section 11) still needs a served URL.
- [ ] 12 Client review round — copy corrections, open items, hosting decision

---

## 13. Goals — remaining work

One goal per step. Each goal is small enough to hold in context, ends in a check, and gets its own
commit. Work them in order; a goal is not started before the previous one is committed.

| Goal | Scope | Done when | Status |
| --- | --- | --- | --- |
| G1 | Docs commit: record this goal list + the served-routes finding in § 11 | `git status` clean, docs commit | done |
| G2 | Visual pass in Chrome against the local dev server: screenshots of every page at 320 / 640 / 768 / 1024 / 1440 px | No overlap, truncation or horizontal scrollbar; findings either fixed or recorded | done — § 11 |
| G3 | Lighthouse ≥ 90 on the served local site (all five routes): performance, accessibility, best practices, SEO | Scores ≥ 90, fixes applied, summary recorded in § 11 | done — § 11 |
| G4 | Keyboard + focus walk-through in Chrome: Tab order, visible focus ring, skip link, icon-link labels | Tab order matches reading order, ring visible everywhere, no trap | done — § 11 |
| G5 | Hosting decision: final domain, HTTPS, `404.html` as error page, `sitemap:` line reachable | Canonical + OG URLs match the live domain; live smoke test | next |
| G6 | Copy review round with the client | Corrections applied, no invented claims, final German wording | open |
| G7 | Open items from section 9 (Meistertitel, Öffnungszeiten, photos/references, trust info) | Each item either supplied and integrated, or explicitly marked not applicable | open |
| G8 | Release check on the live site: Rich Results test, OG scrape, sitemap + robots live, 404 behaviour | § 11 fully `[x]`, ready for hand-off | open |

Order: G1 → G2 → G3 → G4 were offline-verifiable (local dev server + installed Chrome) and are all
done. G5 → G8 need the client's hosting decision and copy feedback, so they wait.

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

**Maintenance note — token split.** All design tokens now live in `assets/css/variables.css`, the
only `:root` block in the project; `styles.css` contains the component rules and only the literals
documented in section 7. Two consequences worth remembering:

- Both sheets are `<link>`ed in `layouts/base.njk`, tokens first. Custom properties resolve at
  computed-value time, so the order does not change what `var(...)` picks up; it is there so the
  head reads in the same order the cascade does, and so no `@import` is needed — an `@import` would
  make the second sheet a serial, slower request.
- The token inventory is a useful check: 30 properties defined, 30 used across `styles.css` and the
  templates, none undefined and none unused. Run the same comparison (`--lcl-[a-z0-9-]+\s*:` against
  `var\(\s*--lcl-`) after adding or removing a token. Sizes after the rename: 3.68 KiB + 13.04 KiB raw
  (1.65 + 3.76 KiB gzip, 16.7 KiB raw / 5.4 KiB transferred). The longer names cost about 1.4 KiB of
  raw bytes; gzip compresses the repeated prefix well, so the two sheets still stay self-contained
  and small on the wire.
