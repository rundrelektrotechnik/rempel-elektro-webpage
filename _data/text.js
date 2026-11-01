/**
 * Page texts the customer maintains in /kundendaten.txt (sections in [square
 * brackets]): hero, headings, the three steps, the area text, page lead-ins.
 * Available in templates as `text`. See lib/kundendaten.js for the shape and checks.
 */
const { readCustomerFile } = require('../lib/kundendaten.js');

module.exports = function () {
  return readCustomerFile().text;
};
