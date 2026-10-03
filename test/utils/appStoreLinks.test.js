import { androidAppUrl, iosAppUrl } from "../../src/utils/misc/appStoreLinks";

test("the App Store link names the page it was clicked on", () => {
  const url = new URL(iosAppUrl("shared_article"));
  expect(url.pathname).toBe("/app/zeeguu-news-for-learners/id6756917355");
  expect(url.searchParams.get("ct")).toBe("shared_article");
});

test("the Play link carries the campaign inside a single encoded referrer", () => {
  const url = new URL(androidAppUrl("landing"));
  expect(url.searchParams.get("id")).toBe("org.zeeguu.app");
  const referrer = new URLSearchParams(url.searchParams.get("referrer"));
  expect(referrer.get("utm_source")).toBe("zeeguu.org");
  expect(referrer.get("utm_campaign")).toBe("landing");
});
