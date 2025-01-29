/**
 * Adds the protocol (https://) in case the link comes in the form of "dr.dk"
 *
 * @param {string} link - Link to add the protocol to.
 *
 * @returns {string} - Link with the add protocoll if needed.
 *
 * Usage:
 *  - addProtocolToLink('dr.dk'); -> https://dr.dk
 *  - addProtocolToLink('https://www.dr.dk/'); -> https://www.dr.dk/
 */

export default function addProtocolToLink(link) {
  if (link.includes("https://") || link.includes("http://")) return link;
  else return "https://" + link;
}
