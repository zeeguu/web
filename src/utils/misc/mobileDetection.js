function isMobile() {
  // cf: https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
  return /Mobi|Android/i.test(navigator.userAgent);
}

export { isMobile };
