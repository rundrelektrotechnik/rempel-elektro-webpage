/**
 * The five services of the business: the fixed list per AGENTS.md section 4.
 * What is fixed here is structure: the order, the anchor `id` and the stock photo
 * (assets/img/services/CREDITS.md). The words come from the customer's
 * /kundendaten.txt, sections [Leistung 1] to [Leistung 5]:
 *   title   heading, start-page tile and Leistungen page
 *   teaser  the few words on the start-page tile
 *   lede    the sentence on the Leistungen page
 *   items   the short checklist on the Leistungen page
 * Never add a service, a certification or a claim the client has not confirmed.
 */
const { readCustomerFile } = require('../lib/kundendaten.js');

const STRUCTURE = [
  { id: 'planung-beratung', image: '/assets/img/services/planung-beratung.jpg', imagePos: '50% 50%' },
  { id: 'kundendienst', image: '/assets/img/services/kundendienst.jpg', imagePos: '50% 50%' },
  { id: 'elektroinstallation', image: '/assets/img/services/elektroinstallation.jpg', imagePos: '50% 30%' },
  { id: 'antennenanlagen', image: '/assets/img/services/antennenanlagen.jpg', imagePos: '50% 50%' },
  { id: 'photovoltaik', image: '/assets/img/services/photovoltaik.jpg', imagePos: '50% 50%' },
];

module.exports = function () {
  const { services } = readCustomerFile();
  return STRUCTURE.map((structure, index) => ({ ...structure, ...services[index] }));
};
