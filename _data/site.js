/**
 * Single source of truth for all company and legal data.
 * Never retype a fact in a template: pull it from here.
 *
 * Facts the customer supplies live in /kundendaten.txt, a plain `Name: Wert` file
 * the customer edits without any tooling. lib/kundendaten.js reads and checks it on every
 * data build (this module exports a function, so the dev server picks edits up too);
 * this module derives the rest from the facts: link hrefs, the address line, the maps
 * link. Everything below the derived values is configuration that belongs to the
 * developers, not to the customer.
 *
 * Displayed values keep the German spacing ("06061 - 70 31 96").
 * Link hrefs use the international form without spacing ("tel:+496061703196"):
 * the visible number starts with the German 0, the link works from abroad too.
 */
const { readCustomerFile } = require('../lib/kundendaten.js');

/** "06061 - 70 31 96" -> "6061703196": digits without the leading 0. */
const national = (number) => number.replace(/\D/g, '').slice(1);

/**
 * "06061 - 70 31 96" -> "+49 6061 703196": the dash the customer writes after the area
 * code is kept as the split. Without a dash the number is not split.
 */
function international(number) {
  const parts = number.match(/^0(\d+)\s*[-/]\s*(.+)$/);
  return parts ? `+49 ${parts[1]} ${parts[2].replace(/\D/g, '')}` : `+49 ${national(number)}`;
}

module.exports = function () {
  const { facts: c, text } = readCustomerFile();
  const address = `${c.street}, ${c.zip} ${c.city}`;

  return {
    // --- from kundendaten.txt ---
    name: c.name,
    owner: c.owner,
    title: c.title,

    street: c.street,
    zip: c.zip,
    city: c.city,
    region: 'Odenwald',
    address,

    phone: c.phone,
    phoneIntl: international(c.phone),
    phoneHref: `tel:+49${national(c.phone)}`,
    fax: c.fax,
    faxIntl: international(c.fax),
    faxHref: `tel:+49${national(c.fax)}`,
    mobile: c.mobile,
    mobileHref: `tel:+49${national(c.mobile)}`,

    email: c.email,
    emailHref: `mailto:${c.email}`,

    kammer: c.kammer,
    betriebsnummer: c.betriebsnummer,
    ustIdNr: c.ustIdNr,

    /** Canonical origin. */
    url: c.url,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.street} ${c.zip} ${c.city}`).replace(/%20/g, '+')}`,

    // --- developer copy and configuration ---
    ogImage: '/assets/img/og-image.png',
    ogImageAlt: 'Rempel-Elektro: Blitzsymbol und Schriftzug',

    /** Colour used by the manifest and theme-color meta. */
    themeColor: '#12324e',

    /** Date shown on the legal pages. Edit by hand when the text changes; never derive it from the build. */
    legalStand: 'November 2026',

    /** Year in the footer copyright. Refreshed when the build runs. */
    year: new Date().getFullYear(),

    /** Place names for schema.org/areaServed (the customer's [Einsatzgebiet] section). */
    areaNames: text.region.places,

    /** One-line description of the business: footer and default title. */
    tagline: text.tagline,

    /** Default metadata for pages that set nothing in their frontmatter. */
    metaTitle: `${c.name} – ${text.tagline}`,
    metaDescription:
      'Elektrohandwerk in Michelstadt und im Odenwald: Planung und Beratung, Kundendienst, ' +
      `Elektroinstallation, Antennenanlagen und Photovoltaik. Erreichbar unter ${c.phone}.`,

    /** Main navigation. */
    nav: [
      { text: 'Start', href: '/' },
      { text: 'Leistungen', href: '/leistungen/' },
      { text: 'Kontakt', href: '/kontakt/' },
    ],

    /** Legal links, always in the footer of every page. */
    legalNav: [
      { text: 'Impressum', href: '/impressum/' },
      { text: 'Datenschutz', href: '/datenschutz/' },
    ],
  };
};
