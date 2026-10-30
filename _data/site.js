/**
 * Single source of truth for all company and legal data.
 * Never retype a fact in a template: pull it from here.
 *
 * Displayed values keep the German spacing ("06061 - 70 31 96").
 * Link hrefs strip spacing and dashes ("tel:06061703196").
 */
const phone = '06061 - 70 31 96';

module.exports = {
  name: 'Rempel-Elektro',
  owner: 'Nikolai Rempel',
  title: 'Dipl.-Ing. (FH)',

  street: 'Chemnitzer-Str. 4',
  zip: '64720',
  city: 'Michelstadt',
  region: 'Odenwald',
  address: 'Chemnitzer-Str. 4, 64720 Michelstadt',

  phone,
  phonePlain: '06061703196',
  phoneHref: 'tel:06061703196',
  fax: '06061 - 70 31 97',
  faxPlain: '06061703197',
  faxHref: 'tel:06061703197',
  mobile: '0170 - 514 562 5',
  mobilePlain: '01705145625',
  mobileHref: 'tel:01705145625',

  email: 'nikolai.rempel@freenet.de',
  emailHref: 'mailto:nikolai.rempel@freenet.de',

  kammer: 'Handwerkskammer Frankfurt-Rhein-Main',
  betriebsnummer: '4165157',
  ustIdNr: 'DE 245119682',

  /** Canonical origin. Final domain pending client confirmation (AGENTS.md §10). */
  url: 'https://www.rempel-elektro.de',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Chemnitzer+Str.+4+64720+Michelstadt',
  ogImage: '/assets/img/og-image.png',

  /** Colour used by the manifest and theme-color meta. */
  themeColor: '#12202b',

  /** Year in the footer copyright. Refreshed when the build runs. */
  year: new Date().getFullYear(),

  /** Where the business works. Generic on purpose: no invented service list. */
  area: 'Michelstadt, dem Odenwald und den umliegenden Gemeinden des Odenwaldkreises',

  /** Same areas as plain place names, for schema.org/areaServed. */
  areaNames: ['Michelstadt', 'Odenwald', 'Odenwaldkreis'],

  /** Default metadata for pages that set nothing in their frontmatter. */
  metaTitle: 'Rempel-Elektro – Elektrohandwerk in Michelstadt und im Odenwald',
  metaDescription:
    'Elektrohandwerk in Michelstadt und im Odenwald: Planung und Beratung, Kundendienst, ' +
    `Elektroinstallation, Antennenanlagen und Photovoltaik. Erreichbar unter ${phone}.`,

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
