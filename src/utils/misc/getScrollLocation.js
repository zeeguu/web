import ratio from "../basic/ratio";

function getScrollRatio(endPageAdjustment = 0) {
  // End page Adjustment means if you have some elements that you want to ignore
  // when calculating the End of the page.
  // This should be a value in Pixels. For example, this is used in the Reader
  // to exclude the elemnts of user feedback in the ratio calculation.
  let scrollElement = document.getElementById("scrollHolder");
  let scrollY = scrollElement.scrollTop;
  let endPage =
    scrollElement.scrollHeight - scrollElement.clientHeight - endPageAdjustment;
  let ratioValue = ratio(scrollY, endPage);
  return ratioValue;
}

function getScrollPixelsToEnd(endPageAdjustment = 0) {
  // End page Adjustment means if you have some elements that you want to ignore
  // when calculating the End of the page.
  // This should be a value in Pixels. For example, this is used in the Reader
  // to exclude the elemnts of user feedback in the ratio calculation.
  let scrollElement = document.getElementById("scrollHolder");
  let scrollY = scrollElement.scrollTop;
  let endPage =
    scrollElement.scrollHeight - scrollElement.clientHeight - endPageAdjustment;
  return endPage - scrollY;
}

export { getScrollRatio, getScrollPixelsToEnd };
