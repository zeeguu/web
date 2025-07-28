const MEDIUM_WIDTH = 992;
const MOBILE_WIDTH = 700;

function isMobileScreenWidth(screenWidth) {
  return screenWidth <= MOBILE_WIDTH;
}

function isMediumScreenWidth(screenWidth) {
  return screenWidth <= MEDIUM_WIDTH && screenWidth > MOBILE_WIDTH;
}

function isDesktopScreenWidth(screenWidth) {
  return screenWidth > MEDIUM_WIDTH;
}

export {
  MOBILE_WIDTH,
  MEDIUM_WIDTH,
  isMobileScreenWidth,
  isMediumScreenWidth,
  isDesktopScreenWidth,
};
