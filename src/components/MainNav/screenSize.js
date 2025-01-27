const MEDIUM_WIDTH = 992;
const MOBILE_WIDTH = 700;

function isMediumScreenWidth(screenWidth) {
  return screenWidth <= MEDIUM_WIDTH && screenWidth > MOBILE_WIDTH;
}

function isDesktopScreenWidth(screenWidth) {
  return screenWidth > MEDIUM_WIDTH;
}

export {
  MOBILE_WIDTH,
  MEDIUM_WIDTH,
  isMediumScreenWidth,
  isDesktopScreenWidth,
};
