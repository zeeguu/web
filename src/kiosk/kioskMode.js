import LocalStorage from "../assorted/LocalStorage";

// Kiosk reader mode turns the whole app into a single-purpose, chrome-less
// news reader for the user's learned language: no translations, no settings,
// no navigation — just the feed and the article reader. It's meant for a
// dedicated device (e.g. an elderly relative's phone in iOS Assistive
// Access). Activated from Developer settings; exited via the 5-tap corner
// gesture (see CornerTapExit).
//
// The flag is read once per app boot (MainAppRouter branches on it), so
// entering/exiting does a full reload to cleanly swap the whole UI tree.

export function isKioskMode() {
  return LocalStorage.getKioskReader();
}

export function enterKioskMode() {
  LocalStorage.setKioskReader(true);
  window.location.assign("/articles");
}

export function exitKioskMode() {
  LocalStorage.setKioskReader(false);
  window.location.assign("/articles");
}
