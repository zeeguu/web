// Links to the app in the stores, tagged with the page they were clicked on.
//
// The stores already split installs into "found by searching the store" and
// "came from a website", but say nothing about which of our pages sent people.
// With these tags, App Store Connect (App Analytics > Campaigns) and Play
// Console (Acquisition > UTM campaigns) report installs per campaign name.

// Apple attributes a campaign (ct) only when the link also carries the
// provider token (pt) of the account that owns the app: App Store Connect >
// App Analytics > Campaigns > Generate a campaign link. It is not a secret;
// it appears in every campaign link the account hands out.
const APPLE_PROVIDER_TOKEN = "1928065";

// The shape App Store Connect generates for campaign links; mt=8 means "app".
const IOS_APP = "https://apps.apple.com/app/apple-store/id6756917355";
const ANDROID_APP = "https://play.google.com/store/apps/details?id=org.zeeguu.app";

/** campaign: where the link is, e.g. "landing", "shared_article". */
export function iosAppUrl(campaign) {
  const params = new URLSearchParams({ pt: APPLE_PROVIDER_TOKEN, ct: campaign, mt: "8" });
  return `${IOS_APP}?${params}`;
}

export function androidAppUrl(campaign) {
  // Play reads the install referrer from one URL-encoded "referrer" parameter.
  const referrer = new URLSearchParams({ utm_source: "zeeguu.org", utm_campaign: campaign });
  return `${ANDROID_APP}&${new URLSearchParams({ referrer: referrer.toString() })}`;
}
