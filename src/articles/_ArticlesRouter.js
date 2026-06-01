import { useEffect, useContext, useState, useRef } from "react";
import ArticleListBrowser from "./ArticleListBrowser";
import BookmarkedArticles from "./BookmarkedArticles";
import HiddenArticles from "../myArticles/HiddenArticles";

import { useHistory, useLocation } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute";
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
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

import * as columnS from "../components/ColumnWidth.sc";
import LocalStorage from "../assorted/LocalStorage";
import { APIContext } from "../contexts/APIContext";
import { BrowsingSessionContext } from "../contexts/BrowsingSessionContext";
import useBrowsingSession from "../hooks/useBrowsingSession";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import useTranslationOnboarding from "../hooks/useTranslationOnboarding";
import TranslationOnboardingPopup from "../pages/onboarding/notifications/TranslationOnboardingPopup";

const READ_TAB_PATHS = ["/articles", "/articles/mySearches", "/articles/bookmarked", "/articles/classroom"];

export default function ArticlesRouter({ hasExtension, isChrome }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const { userDetails } = useContext(UserContext);
  const { getBrowsingSessionId } = useBrowsingSession();
  const location = useLocation();
  const hideRecommendations = LocalStorage.hasFeature("hide_recommendations");
  const isStudent = LocalStorage.isStudent();
  const dropdownRef = useRef(null);
  const [showTopicsDropdown, setShowTopicsDropdown] = useState(false);
  const [subscribedTopics, setSubscribedTopics] = useState(null);
  const translationModal = useTranslationOnboarding(api, userDetails);

  useEffect(() => {
    api.getSubscribedTopics((data) => setSubscribedTopics(data || []));
  }, [api]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTopicsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSettingsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTopicsDropdown(!showTopicsDropdown);
  };

  const handleTopicMenuClick = (path) => {
    history.push(path);
    setShowTopicsDropdown(false);
  };

  const iconStyle = { display: "inline-flex", alignItems: "center", padding: "0.4em 0.25em", verticalAlign: "middle" };
  const iconProps = { style: { fontSize: "1.55rem", verticalAlign: "middle" } };

  const homeIcon = (
    <span style={iconStyle}>
      <HomeRoundedIcon {...iconProps} />
    </span>
  );

  const bookmarkIcon = (
    <span style={iconStyle}>
      <BookmarkRoundedIcon {...iconProps} />
    </span>
  );

  const classroomIcon = (
    <span style={iconStyle}>
      <SchoolRoundedIcon {...iconProps} />
    </span>
  );

  const searchIcon = (
    <span style={iconStyle}>
      <SearchRoundedIcon {...iconProps} />
    </span>
  );

  const settingsIcon = (
    <span style={iconStyle}>
      <SettingsRoundedIcon {...iconProps} />
    </span>
  );

  const tabs = [
    !hideRecommendations && { text: homeIcon, link: "/articles" },
    { text: bookmarkIcon, link: "/articles/bookmarked" },
    isStudent && { text: classroomIcon, link: "/articles/classroom" },
    !hideRecommendations && {
      text: settingsIcon,
      onClick: handleSettingsClick,
      isDropdown: true,
    },
    !hideRecommendations && {
      text: searchIcon,
      link: "/articles/mySearches",
      // Stay active on /search too — results are conceptually the search tab.
      isActive: (_, loc) => loc.pathname === "/articles/mySearches" || loc.pathname === "/search",
    },
  ].filter(Boolean);

  return (
    <BrowsingSessionContext.Provider value={getBrowsingSessionId}>
      {/* Rendering top menu first, then routing to corresponding page */}
      <columnS.NarrowColumn>
        <TopTabs
          title={strings.articles}
          tabsAndLinks={tabs}
          hasBackground={true}
          topicsDropdown={{
            ref: dropdownRef,
            showDropdown: showTopicsDropdown,
            subscribedTopics,
            handleTopicMenuClick,
          }}
        />

        <div style={{ minHeight: "70vh" }}>
          {hideRecommendations ? (
            <Redirect from="/articles" exact to="/articles/classroom" />
          ) : (
            <PrivateRoute
              path="/articles"
              exact
              component={ArticleListBrowser}
              hasExtension={hasExtension}
              isChrome={isChrome}
            />
          )}
          <PrivateRoute exact path="/articles/bookmarked" component={BookmarkedArticles} />
          <PrivateRoute path="/articles/bookmarked/hidden" component={HiddenArticles} />
          <PrivateRoute path="/articles/classroom" component={ClassroomArticles} />

          <PrivateRoute path="/articles/ownTexts" component={OwnArticles} />

          <PrivateRoute path="/articles/history" component={ReadingHistory} />

          <PrivateRoute path="/articles/mySearches" component={MySearches} />

          <PrivateRoute path="/search" component={Search} />
        </div>
      </columnS.NarrowColumn>
      <TranslationOnboardingPopup open={translationModal.open} handleCancel={translationModal.close} />
    </BrowsingSessionContext.Provider>
  );
}

// Having components passed to the Search
// look for a search, boolean
// passing a different prop, to make search
// render either search or no search
