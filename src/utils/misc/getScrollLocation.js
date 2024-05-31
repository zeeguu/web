import ratio from "../basic/ratio";

/**
 *
 * @param {number} shortenPageHeightPixels - [optional] expects a positive int value in Pixels to remove from the total height of the page.
 * @returns {number} - ratio of scrolled pixels to total page height
 */
function getScrollRatio(shortenPageHeightPixels = 0) {
  let scrollElement = document.getElementById("scrollHolder");
  let scrollY = scrollElement.scrollTop;

  let endPage =
    scrollElement.scrollHeight -
    scrollElement.clientHeight -
    shortenPageHeightPixels;
  return ratio(scrollY, endPage);
}

/**
 *
 * @param {number} shortenPageHeightPixels - [optional] expects a positive int value in Pixels to remove from the total height of the page.
 * @returns {number}
 */
function getPixelsFromScrollBarToEnd(shortenPageHeightPixels = 0) {
  let scrollElement = document.getElementById("scrollHolder");
  let scrollY = scrollElement.scrollTop;
  let endPage =
    scrollElement.scrollHeight -
    scrollElement.clientHeight -
    shortenPageHeightPixels;
  return endPage - scrollY;
}

export { getScrollRatio, getPixelsFromScrollBarToEnd };
