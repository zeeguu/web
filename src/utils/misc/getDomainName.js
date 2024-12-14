/**
 * From discussion:
 * https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
 *
 * @param {string} url - a URL to a website
 * @returns {string} - returns the domain name without the www
 */
export default function getDomainName(url) {
  var a = document.createElement("a");
  a.href = url;
  return a.hostname.replace("www.", "");
}
