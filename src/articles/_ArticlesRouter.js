import { useContext, useEffect } from "react";
import ArticleListBrowser from "./ArticleListBrowser";
import BookmarkedArticles from "./BookmarkedArticles";
import HiddenArticles from "../myArticles/HiddenArticles";

import { useLocation, Switch } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute";
import { Redirect } from "react-router-dom";
import ClassroomArticles from "./ClassroomArticles";
import TopTabs from "../components/TopTabs";
import strings from "../i18n/definitions";

import OwnArticles from "./OwnArticles";
import ReadingHistory from "../words/WordHistory";
import MySearches from "./MySearches";
import Search from "./Search";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import MoveToInboxRoundedIcon from "@mui/icons-material/MoveToInboxRounded";
import NotificationIcon from "../components/NotificationIcon";
import { SharedArticlesContext } from "../contexts/SharedArticlesContext";
import SharedInbox from "./SharedInbox";

import * as columnS from "../components/ColumnWidth.sc";
import * as s from "./_ArticlesRouter.sc";
import LocalStorage from "../assorted/LocalStorage";
import Feature from "../features/Feature";
import { APIContext } from "../contexts/APIContext";
import { BrowsingSessionContext } from "../contexts/BrowsingSessionContext";
import useBrowsingSession from "../hooks/useBrowsingSession";
import useTabbedRoute from "../hooks/useTabbedRoute";
import { UserContext } from "../contexts/UserContext";
import useTranslationOnboarding from "../hooks/useTranslationOnboarding";
import TranslationOnboardingPopup from "../pages/onboarding/notifications/TranslationOnboardingPopup";

const READ_TAB_PATHS = [
  "/articles",
  "/articles/mySearches",
  "/articles/bookmarked",
  "/articles/classroom",
  "/articles/shared",
];

export default function ArticlesRouter({ hasExtension, isChrome }) {
  const api = useContext(APIContext);
  const location = useLocation();
  const { userDetails } = useContext(UserContext);
  const { hasSharedNotification, sharedUnreadCount } = useContext(SharedArticlesContext);
  const { getBrowsingSessionId } = useBrowsingSession();
  const classroomOnly = Feature.classroom_only();
  const isStudent = LocalStorage.isStudent();
  const translationModal = useTranslationOnboarding(api, userDetails);

  useEffect(() => {
    if (READ_TAB_PATHS.includes(location.pathname)) {
      LocalStorage.setLastVisitedReadPath(location.pathname);
    }
  }, [location.pathname]);

  const isHomeScreen = location.pathname === "/articles";

  const iconStyle = { display: "inline-flex", alignItems: "center", padding: "0.4em 0.25em", verticalAlign: "middle" };
  const iconProps = { style: { fontSize: "2.1rem", verticalAlign: "middle" } };

  const homeIcon = (
    <s.IconSpan style={{ verticalAlign: "middle" }}>
      <HomeRoundedIcon {...iconProps} />
    </s.IconSpan>
  );

  const bookmarkIcon = (
    <s.IconSpan style={{ verticalAlign: "middle" }}>
      <BookmarkRoundedIcon {...iconProps} />
    </s.IconSpan>
  );

  const classroomIcon = (
    <s.IconSpan style={{ verticalAlign: "middle" }}>
      <SchoolRoundedIcon {...iconProps} />
    </s.IconSpan>
  );

  const searchIcon = (
    <s.IconSpan style={{ verticalAlign: "middle" }}>
      <SearchRoundedIcon {...iconProps} />
    </s.IconSpan>
  );

  // Inbox of articles friends have shared. Always shown (a visible inbox invites
  // people to share); the badge carries the unread count.
  const inboxIcon = (
    <s.IconSpan style={{ verticalAlign: "middle", position: "relative" }}>
      <MoveToInboxRoundedIcon {...iconProps} />
      {hasSharedNotification && (
        <NotificationIcon position={"top-absolute"} style={{ top: 0, right: 0 }} text={sharedUnreadCount} />
      )}
    </s.IconSpan>
  );

  const tabs = [
    { text: homeIcon, link: "/articles" },
    { text: bookmarkIcon, link: "/articles/bookmarked" },
    isStudent && { text: classroomIcon, link: "/articles/classroom" },
    {
      text: searchIcon,
      link: "/articles/mySearches",
      // Stay active on /search too — results are conceptually the search tab.
      isActive: (_, loc) => loc.pathname === "/articles/mySearches" || loc.pathname === "/search",
    },
    { text: inboxIcon, link: "/articles/shared" },
  ].filter(Boolean);

  // Swipe left/right between the read tabs. Tuned stiffer than the default
  // (and than daily-audio) because the feed is a long vertical scroll: a
  // looser gesture made near-horizontal scrolls feel like accidental tab
  // switches (see revert 0aa59d31).
  const swipeRef = useTabbedRoute(
    tabs.map((t) => t.link),
    {
      pathAliases: { "/search": "/articles/mySearches" },
      swipeOptions: { threshold: 90, deadzone: 12, lockRatio: 1.6, qualifyRatio: 2 },
    },
  );

  // The class asked that its students see only the texts their teacher shares.
  // Every browsing route in the app is mounted under this router -- /search
  // included (see MainAppRouter) -- so the catch-all below is what makes a
  // stale last-visited path, a deep link or the back button land on the class
  // instead of on a surface this mode is meant to hide. No tab bar: there is
  // only one place to be.
  if (classroomOnly) {
    return (
      <BrowsingSessionContext.Provider value={getBrowsingSessionId}>
        <columnS.NarrowColumn>
          <s.ContentContainer>
            <Switch>
              <PrivateRoute path="/articles/classroom" component={ClassroomArticles} />
              <Redirect to="/articles/classroom" />
            </Switch>
          </s.ContentContainer>
        </columnS.NarrowColumn>
        <TranslationOnboardingPopup open={translationModal.open} handleCancel={translationModal.close} />
      </BrowsingSessionContext.Provider>
    );
  }

  return (
    <BrowsingSessionContext.Provider value={getBrowsingSessionId}>
      {/* Rendering top menu first, then routing to corresponding page */}
      <columnS.NarrowColumn>
        <TopTabs title={strings.articles} tabsAndLinks={tabs} hasBackground={false} isCompact={true} />

        <s.ContentContainer ref={swipeRef}>
          <PrivateRoute
            path="/articles"
            exact
            component={ArticleListBrowser}
            hasExtension={hasExtension}
            isChrome={isChrome}
          />
          <PrivateRoute exact path="/articles/bookmarked" component={BookmarkedArticles} />
          <PrivateRoute path="/articles/bookmarked/hidden" component={HiddenArticles} />
          <PrivateRoute path="/articles/classroom" component={ClassroomArticles} />

          <PrivateRoute path="/articles/ownTexts" component={OwnArticles} />

          <PrivateRoute path="/articles/history" component={ReadingHistory} />

          <PrivateRoute path="/articles/mySearches" component={MySearches} />

          <PrivateRoute exact path="/articles/shared" component={SharedInbox} />

          <PrivateRoute path="/search" component={Search} />
        </s.ContentContainer>
      </columnS.NarrowColumn>
      <TranslationOnboardingPopup open={translationModal.open} handleCancel={translationModal.close} />
    </BrowsingSessionContext.Provider>
  );
}

// Having components passed to the Search
// look for a search, boolean
// passing a different prop, to make search
// render s.ContentContainerher search or no search
