import ratio from "../basic/ratio";

/*
  shortenPageHeightPixels: int (OPTIONAL), expects a positive int value in Pixels 
  to remove from the total height of the page.
  For example, this is used in the reader to ignore the InfoBoxes at the end
  which are not part of the article. One can pass in the height of the divs,
  removing it from the calculation of the ScrollHeight.

  Implemented using "named-parameters": https://byby.dev/js-named-parameters
  To call method without defining parameter use: getScrollRatio({})
*/

function getScrollRatio({ shortenPageHeightPixels = 0 }) {
  let scrollElement = document.getElementById("scrollHolder");
  let scrollY = scrollElement.scrollTop;
  let endPage =
    scrollElement.scrollHeight -
    scrollElement.clientHeight -
    shortenPageHeightPixels;
  let ratioValue = ratio(scrollY, endPage);
  return ratioValue;
}

function getPixelsFromScrollBarToEnd({ shortenPageHeightPixels = 0 }) {
  let scrollElement = document.getElementById("scrollHolder");
  let scrollY = scrollElement.scrollTop;
  let endPage =
    scrollElement.scrollHeight -
    scrollElement.clientHeight -
    shortenPageHeightPixels;
  return endPage - scrollY;
}

export { getScrollRatio, getPixelsFromScrollBarToEnd };
