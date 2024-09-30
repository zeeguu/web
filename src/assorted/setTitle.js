/**
 * Sets the document's title to the specified title followed by ": Zeeguu".
 *
 * @param {string} title - The title to set for the document.
 * This title will be appended with ": Zeeguu".
 *
 * @example
 * // Sets the document title to "Home: Zeeguu"
 * setTitle("Home");
 */

export function setTitle(title) {
  document.title = title + ": Zeeguu";
}
