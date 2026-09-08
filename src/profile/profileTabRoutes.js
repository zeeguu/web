// Each profile tab is a route of its own, so that opening a friend's profile
// from the Friends tab and coming back lands you on Friends again, instead of
// resetting to Badges. The default tab carries no slug: /profile is Badges.
//
// The slugs are reserved words in the /profile/:friendUsername space: they are
// matched before the username route, so a user called "friends" would not be
// reachable at /profile/friends.
export const PROFILE_TABS = {
  BADGES: "badges",
  FRIENDS: "friends",
  LEADERBOARDS: "leaderboards",
};

export const DEFAULT_PROFILE_TAB = PROFILE_TABS.BADGES;

const OWN_PROFILE_TABS = [PROFILE_TABS.BADGES, PROFILE_TABS.FRIENDS, PROFILE_TABS.LEADERBOARDS];
const FRIEND_PROFILE_TABS = [PROFILE_TABS.BADGES, PROFILE_TABS.FRIENDS];

// path-to-regexp alternatives, e.g. ":profileTab(badges|friends)"
const tabParam = (tabs) => `:profileTab(${tabs.join("|")})`;

export const OWN_PROFILE_TAB_PATH = `/profile/${tabParam(OWN_PROFILE_TABS)}`;
export const FRIEND_PROFILE_TAB_PATH = `/profile/:friendUsername/${tabParam(FRIEND_PROFILE_TABS)}`;

export function profileTabPath(friendUsername, tab) {
  const profilePath = friendUsername ? `/profile/${encodeURIComponent(friendUsername)}` : "/profile";
  return tab === DEFAULT_PROFILE_TAB ? profilePath : `${profilePath}/${tab}`;
}
