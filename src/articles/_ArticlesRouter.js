import { useContext } from "react";
import ArticleListBrowser from "./ArticleListBrowser";
import BookmarkedArticles from "./BookmarkedArticles";
import HiddenArticles from "../myArticles/HiddenArticles";

import { useHistory } from "react-router-dom";
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

import * as columnS from "../components/ColumnWidth.sc";
import * as s from "./_ArticlesRouter.sc";
import LocalStorage from "../assorted/LocalStorage";
import { APIContext } from "../contexts/APIContext";
import { BrowsingSessionContext } from "../contexts/BrowsingSessionContext";
import useBrowsingSession from "../hooks/useBrowsingSession";
import { UserContext } from "../contexts/UserContext";
import useTranslationOnboarding from "../hooks/useTranslationOnboarding";
import TranslationOnboardingPopup from "../pages/onboarding/notifications/TranslationOnboardingPopup";

export default function ArticlesRouter({ hasExtension, isChrome }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const { userDetails } = useContext(UserContext);
  const { getBrowsingSessionId } = useBrowsingSession();
  const hideRecommendations = LocalStorage.hasFeature("hide_recommendations");
  const isStudent = LocalStorage.isStudent();
  const translationModal = useTranslationOnboarding(api, userDetails);

  const iconStyle = { display: "inline-flex", alignItems: "center", padding: "0.4em 0.25em", verticalAlign: "middle" };
  const iconProps = { style: { fontSize: "1.55rem", verticalAlign: "middle" } };

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

  const tabs = [
    !hideRecommendations && { text: homeIcon, link: "/articles" },
    { text: bookmarkIcon, link: "/articles/bookmarked" },
    isStudent && { text: classroomIcon, link: "/articles/classroom" },
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
        <TopTabs title={strings.articles} tabsAndLinks={tabs} hasBackground={true} isCompact={true} />

        <s.FilterButtonContainer>
          <s.FilterButton onClick={() => history.push("/account_settings/interests")} title="Feed Preferences">
            <img src="/static/icons/Tune.svg" alt="Filter" />
          </s.FilterButton>
        </s.FilterButtonContainer>

        <s.FilterDivider />

        <s.ContentContainer>
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
