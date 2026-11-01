# AGENTS.md — Rempel-Elektro website

Working instructions for AI agents and human contributors working in this repository.
Read `plans/PROJECT.md` for the full plan, findings and page specifications before changing anything.

## 1. Project purpose

Rebuilding the web presence of **Rempel-Elektro** (Nikolai Rempel, Dipl.-Ing. (FH)) in Michelstadt,
Odenwald, to replace the current live site at <http://www.rempel-elektro.de/>.

The old site is an unstyled HTML 4 table layout: no mobile support, no `Datenschutzerklärung`,
content inside `<pre>` tags, a WordArt `.gif` logo, no favicon, no meta data. The rebuild is a
modern, static, single-language German business site.

The site's job is one thing: **make it easy to reach the business by phone**. Everything else
supports that.

## 2. Stack and tooling

| Area | Decision |
| --- | --- |
| Generator | Eleventy (11ty) 3.x, Nunjucks templates |
| Environment | Node 24, npm 11 (already installed locally) |
| Styling | Plain modern CSS, two sheets: `variables.css` (tokens) + `styles.css` (rules). No Sass, no Tailwind, no CSS-in-JS, no `@import` |
| JavaScript | None, apart from the JSON-LD block. Header nav is always visible and wraps on small screens |
| Fonts | Self-hosted, OFL-licensed, Latin-subset `woff2` via npm |
| Imagery | Inline SVG for icons and logo. Photos: only the five Pexels stock photos on the start-page service tiles (`assets/img/services/`, self-hosted, licence in `CREDITS.md`), as placeholders until the client supplies real ones. No external image CDNs, no hot-linking |
| Build output | `_site/` — never hand-edit, never commit |

## 3. Repository layout

```
/content           source pages, one file per URL
/kundendaten.txt   everything the customer maintains, in a plain `Name: Wert` file: the facts (name, address,
                   phones, e-mail, Kammer, USt-IdNr, domain) and, in [sections], the page texts (hero, headings,
                   the five services' words, the three steps, area text, page lead-ins)
/lib/kundendaten.js  the reader: declares every allowed field and section, checks the file, and fails the
                   build with a German message naming the line
/_data             site.js (facts + derived hrefs), text.js (page texts), services.js (the five services:
                   fixed order/id/photo, words from the file); also the developers' config
/_includes         layouts/ and components/
/assets            css/ (variables.css + styles.css), fonts/, icons/, favicon
/eleventy.config.js
/plans             planning documents (PROJECT.md)
/_site             build output — ignored
/content/site.webmanifest.njk  manifest, built from site.js
```

Every page is generated from `layouts/base.njk`. Navigation, footer and legal links come from
includes, never from duplicated markup.

## 4. Content and copy rules

- All user-facing copy is **German**, formal register, `Sie` throughout.
- Documents and code comments in English.
- **Never invent business claims.** No "Meisterbetrieb", no certifications, no customer reviews,
  no reference projects, no team members, no invented founding year. The existing Impressum
  states `Dipl. Ing. (FH)` only — do not upgrade that into a master-title claim.
- Customer-supplied facts and page texts live in `kundendaten.txt` and reach the templates through `site`, `text`
  and `services` (`_data/`); copy that repeats a fact (address, phone) must pull from there instead of being
  retyped. Any change to contact data or to the hero, headings, service words, steps or area text happens in
  exactly one place: `kundendaten.txt`. Keep that file in plain German for a non-technical editor. Adding a
  customer-owned text means a field entry in `lib/kundendaten.js`, the line in the file and the template using it:
  never a hard-coded string. Structure (order, anchors, photos, button labels) stays in code.
- Service list is fixed: **Planung & Beratung, Kundendienst, Elektroinstallation,
  Antennenanlagen, Photovoltaik.**
- German copy must read as written for this business, not as filler. Placeholder text is
  acceptable only when clearly marked as such, and never shipped.

### Canonical company data (use verbatim, do not paraphrase)

| Field | Value |
| --- | --- |
| Firma | Rempel-Elektro |
| Inhaber | Nikolai Rempel, Dipl.-Ing. (FH) |
| Anschrift | Chemnitzer-Str. 4, 64720 Michelstadt |
| Telefon | 06061 - 70 31 96 |
| Fax | 06061 - 70 31 97 |
| Mobil | 0170 - 514 562 5 |
| E-Mail | nikolai.rempel@freenet.de |
| Kammer | Handwerkskammer Frankfurt-Rhein-Main, Betriebs-Nr. 4165157 |
| USt-IdNr. | DE 245119682 |

Numbers keep their German spacing when displayed; the `tel:` href uses the international
form without spaces or dashes (`tel:+496061703196`, not `tel:06061-70 31 96`). The leading 0 is always shown,
never `+49`, because the site is German-only.

## 5. Legal constraints (German law — treat as hard requirements)

- Impressum basis is **`§ 5 DDG`** (Digitale-Dienste-Gesetz, since 14 May 2024, replaces the TMG)
  together with `§ 18 MStV`. Never write `§ 5 TMG`, never reference `RStV`.
- **No link to the EU OS-Streitbeilegungsplattform.** It was shut down 20 July 2025. Keeping the
  link is misleading and competition-law attackable.
- **No `§ 36 VSBG` notice.** Obligatory only for businesses with more than 10 employees;
  Rempel-Elektro is exempt. Do not add it "for completeness".
- Impressum must contain: name, ladungsfähige postal address (no PO box, no virtual office),
  phone, e-mail, Kammer + Betriebs-Nr., USt-IdNr. Fax is included deliberately, per client
  decision.
- `Datenschutzerklärung` (Art. 13/14 DSGVO) is **mandatory** and currently missing from the live
  site. It must state exactly what actually happens: nothing. No cookies, no analytics, no
  third-party requests. If that changes, the document must change with it.
- Fonts are self-hosted. Loading fonts from a CDN sends visitors' IP addresses to a third party
  and requires consent management.
- No third-party embeds at all: no Google Fonts, no Maps iframe, no analytics, no social plugins.
  Address links to Google Maps as a plain external link, `rel="noopener"`.
- A cookie banner is therefore not needed. Do not add one.

These are not legal advice for the client: they are the constraints for this build. If a legal
wording is uncertain, verify the current statute before writing it — do not guess from memory.

## 6. Engineering baseline

- Semantic HTML5, `lang="de"`, single `<h1>` per page, correct heading order, skip link.
- WCAG 2.2 AA: contrast, visible focus styles, keyboard reachable, `aria-label` on icon links,
  text never relies on colour alone, `prefers-reduced-motion` respected.
- Mobile-first fluid layout. Breakpoints at 640 and 768 px; content capped at `--lcl-size-maxw: 1200 px`,
  which is what keeps the layout intact above 1200 px (there is no 1200 px media query).
- `tel:` and `mailto:` as primary contact mechanisms. The one form (Kontakt page) is a `mailto:` form: no server,
  no JavaScript, no third-party form service. It opens the visitor's own mail program with a prepared message and
  transmits nothing to this site, therefore no AVV. A form that posts to a server or a form service would change
  the Datenschutzerklärung and needs a processor agreement: do not add one without updating both.
- Structured data: `schema.org/Electrician` JSON-LD generated from `_data/site.js`.
- Per-page `<title>` and description, canonical, Open Graph, `sitemap.xml`, `robots.txt`,
  SVG favicon with PNG fallback.
- Self-contained CSS, no build step (16.7 KiB raw / 5.4 KiB gzip across `variables.css` +
  `styles.css`), preloaded subset `woff2`, no layout shift on first paint.

## 7. Design system

Defined in `plans/PROJECT.md`, implemented as custom properties in `assets/css/variables.css`.
That file holds the only `:root` block and the only literal values: `styles.css` references
tokens through `var(...)` and never repeats a colour, width or shadow — the exceptions are
pure white and the translucent white overlays that sit on the dark surfaces.

- Palette: slate-navy ink, blue primary, amber accent reserved for actionable elements.
  The old blue→red logo gradient survives only inside the SVG lightning bolt.
- Typography: Inter, self-hosted, Latin-subset.
- Icons: one inline-SVG stroke system, consistent stroke width, `currentColor`, no decorative
  animation.
- Logo: modern SVG wordmark, hand-written, no raster assets.
- Photos: the service tiles carry stock placeholders (see §2 Imagery). Anywhere else, no photos until the client
  supplies them — the layout must not reserve empty photo slots. Stock photos are never presented as
  references or as the business's own work.

## 8. Commands

```bash
npm run dev      # Eleventy --serve with watch, local preview on http://localhost:8081/
npm run build    # production build into _site/
```

`kundendaten.txt` is a watch target and the `_data/*.js` files read it through functions, so edits to the
customer file rebuild live. Edits to the `_data/*.js` or `lib/*.js` files themselves are not reloaded (CommonJS
cache): restart `npm run dev` after changing them, otherwise pages render with the old data.

The dev server is pinned to port 8081 (`--port=8081` in `package.json`): 8080 is already
used by the local strata service, so do not switch this back.

Before finishing any task, run the build and check `_site/` output renders correctly.

## 9. Do not

- Edit `_site/`, `node_modules/` or generated files.
- Add dependencies without a concrete need. No framework, no CSS framework, no JS bundler.
- Add analytics, tracking pixels or third-party widgets "for later".
- Fabricate legal text, certifications, service scope or testimonials.
- Change contact or legal data directly inside a page template.
- Add a cookie banner, consent tool or font CDN.
- Build scaffolding for references or photo galleries that has no real content behind it.

## 10. Open items pending client confirmation

Tracked here so nothing gets silently invented:

- Meistertitel / actual qualification — currently deliberately not stated anywhere.
- Opening hours — not provided by the client; block left out until supplied.
- Real project photos and references — deferred until the client provides them; the service-tile stock photos
  are replaced then. No empty slots.
- Hosting provider for the new build, and whether the old server is reused.
- Trust information (Innung membership, certifications) — deferred, will be provided later.

## 11. Before implementing

The plan in `plans/PROJECT.md` is authoritative. If a task conflicts with it, update the plan
first, then the code. Keep the legal constraints in section 5 non-negotiable.
