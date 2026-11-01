const fs = require('node:fs');
const path = require('node:path');
const nunjucks = require('nunjucks');

/**
 * Reads an icon from assets/icons and returns markup for inline embedding.
 * Icons are hand-written SVG: stroke based, viewBox 0 0 24 24, no fill.
 * The wrapper is aria-hidden because every icon sits next to real text or
 * inside a labelled link.
 *
 * The result is wrapped in a Nunjucks SafeString: Eleventy turns autoescaping
 * on, and a plain string returned from a filter gets escaped — the markup then
 * reaches the page as literal text instead of an element. Only shortcodes are
 * treated as safe by Eleventy, so filters have to mark it themselves.
 */
function icon(name) {
  const file = path.join(__dirname, 'assets', 'icons', `${name}.svg`);
  if (!fs.existsSync(file)) {
    throw new Error(`icon(): missing icon "${name}" (assets/icons/${name}.svg)`);
  }
  const svg = fs.readFileSync(file, 'utf8').replace(/\s*\n\s*/g, ' ').trim();
  return new nunjucks.runtime.SafeString(`<span class="icon" aria-hidden="true">${svg}</span>`)
}

/**
 * Renders a Date (or whatever a page's `date` resolves to) as the `YYYY-MM-DD`
 * form the sitemap schema expects for `<lastmod>`.
 */
function isoDate(value) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

module.exports = function (eleventy) {
  eleventy.addFilter('icon', icon)
  eleventy.addFilter('isoDate', isoDate)

  // Sitemap entries come from pages that opt in with `sitemap: true`. Eleventy 3
  // passes a collection object here, not an array. Sorting by URL keeps the start
  // page first and the rest alphabetical, so the file stays stable between builds.
  eleventy.addCollection('sitemap', (collection) =>
    collection
      .getAllSorted()
      .filter((item) => item.data.sitemap === true)
      .sort((a, b) => a.url.localeCompare(b.url, 'en'))
  )

  eleventy.setInputDirectory('content')
  eleventy.setIncludesDirectory('../_includes')
  eleventy.setDataDirectory('../_data')
  eleventy.setOutputDirectory('_site')

  // String globs keep their folder structure in the output. Object mappings are
  // only used where a single file needs a fixed target name.
  eleventy.addPassthroughCopy('assets/**')
  eleventy.addPassthroughCopy({
    // Self-hosted Inter: Latin variable subset plus the OFL licence.
    'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2':
      'assets/fonts/inter-latin-wght-normal.woff2',
    'node_modules/@fontsource-variable/inter/LICENSE': 'assets/fonts/OFL.txt',
  })

  // The customer's facts live in one plain text file, read by _data/site.js. Watching it
  // makes `npm run dev` rebuild when the customer's edits are saved.
  eleventy.addWatchTarget('kundendaten.txt')

  eleventy.setServerOptions({ showAllAvailableUrls: true })
}
