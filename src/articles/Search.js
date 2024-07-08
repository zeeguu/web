import React, { useState, useEffect } from "react";
import * as s from "./Search.sc";
import * as b from "../components/allButtons.sc";
import * as d from "./FindArticles.sc";
import { SearchKeyWords } from "../components/SearchKeyWords";
import useSelectInterest from "../hooks/useSelectInterest";
import { toast } from "react-toastify";
import useQuery from "../hooks/useQuery";
import { setTitle } from "../assorted/setTitle";
import ArticlePreview from "./ArticlePreview";
import SortingButtons from "./SortingButtons";
import SearchField from "./SearchField";
import LoadingAnimation from "../components/LoadingAnimation";
import * as t from "../components/TopMessage.sc";
import strings from "../i18n/definitions";
import { getPixelsFromScrollBarToEnd } from "../utils/misc/getScrollLocation";
import useShadowRef from "../hooks/useShadowRef";
import LocalStorage from "../assorted/LocalStorage";
import ExtensionMessage from "./ExtensionMessage";
import useExtensionCommunication from "../hooks/useExtensionCommunication";

function Search({ api }) {
  const searchQuery = useQuery().get("search");
  const [articleList, setArticleList] = useState(null);
  const [originalList, setOriginalList] = useState(null);
  const [isWaitingForNewArticles, setIsWaitingForNewArticles] = useState(false);
  const isWaitingForNewArticlesRef = useShadowRef(isWaitingForNewArticles);
  const [currentPage, setCurrentPage] = useState(0);
  const articleListRef = useShadowRef(articleList);
  const currentPageRef = useShadowRef(currentPage);
  const [displayedExtensionPopup, setDisplayedExtensionPopup] = useState(false);
  const [isExtensionAvailable] = useExtensionCommunication();
  const [extensionMessageOpen, setExtensionMessageOpen] = useState(false);

  // Empty array for the associated keywords
  const associatedKeywords = [];
  // Setup for ui change from horizontal showing of keywords to button
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
  const [isPopupVisible, setPopupVisible] = useState(false);
  // useEffect for change from horizontal showing of keywords to button
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setTitle("Search Articles");

    if (searchQuery) {
      api.search(searchQuery, (articles) => {
        setArticleList(articles);
        setOriginalList([...articles]);
      });
    }
  }, []);

  function handleScroll() {
    let scrollBarPixelDistToPageEnd = getPixelsFromScrollBarToEnd();
    if (
      scrollBarPixelDistToPageEnd <= 50 &&
      !isWaitingForNewArticlesRef.current
    ) {
      setIsWaitingForNewArticles(true);
      document.title = "Getting more articles...";
      let newCurrentPage = currentPageRef.current + 1;
      let newArticles = [...articleListRef.current];
      if (searchQuery) {
        api.searchMore(searchQuery, newCurrentPage, (articles) => {
          insertNewArticlesIntoArticleList(
            articles,
            newCurrentPage,
            newArticles,
          );
        });
      } else {
        api.getMoreUserArticles(20, newCurrentPage, (articles) => {
          insertNewArticlesIntoArticleList(
            articles,
            newCurrentPage,
            newArticles,
          );
        });
      }
    }
  }

  useEffect(() => {
    setDisplayedExtensionPopup(LocalStorage.displayedExtensionPopup());
    console.log(
      "Localstorage displayed extension: " +
        LocalStorage.displayedExtensionPopup(),
    );
    api.getUserArticles((articles) => {
      setArticleList(articles);
      setOriginalList([...articles]);
    });

    window.addEventListener("scroll", handleScroll, true);
    document.title = "Recommend Articles: Zeeguu";
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  function insertNewArticlesIntoArticleList(
    fetchedArticles,
    newCurrentPage,
    newArticles,
  ) {
    newArticles = newArticles.concat(fetchedArticles);
    setArticleList(newArticles);
    setOriginalList([...newArticles]);
    setCurrentPage(newCurrentPage);
    setIsWaitingForNewArticles(false);
    document.title = "Recommend Articles: Zeeguu";
  }

  useEffect(() => {
    if (!isExtensionAvailable) {
      setExtensionMessageOpen(true);
    }
  }, [isExtensionAvailable]);

  const togglePopupKeyWords = () => {
    setPopupVisible(!isPopupVisible);
  };

  if (articleList == null) {
    return <LoadingAnimation />;
  }

  if (searchQuery && articleList.length === 0) {
    return <t.TopMessage>{strings.NoSearchMatch}</t.TopMessage>;
  }

  return (
    <div>
      <ExtensionMessage
        open={extensionMessageOpen}
        hasExtension={isExtensionAvailable}
        displayedExtensionPopup={displayedExtensionPopup}
        setExtensionMessageOpen={setExtensionMessageOpen}
        setDisplayedExtensionPopup={setDisplayedExtensionPopup}
      ></ExtensionMessage>

      <d.Search>
        <SearchField api={api} query={searchQuery} />
      </d.Search>

      <d.Sort>
        <SortingButtons
          articleList={articleList}
          originalList={originalList}
          setArticleList={setArticleList}
        />
      </d.Sort>

      <s.RowHeadlineSearch>
        <s.HeadlineSearch>
          <h1>{searchQuery}</h1>
          <AddRemoveSearch api={api} query={searchQuery} />

          {/* The set up for the associated keywords. A button when view on mobile,
                and horizontal list when larger than 500 px. */}
        </s.HeadlineSearch>
        <div className={isMobile ? "mobile" : "desktop"}>
          {isMobile ? (
            <div className="mobileButtonKeywords">
              <b.OrangeRoundButton onClick={togglePopupKeyWords}>
                Keywords
              </b.OrangeRoundButton>

              <s.PopUpKeyWords
                style={{ display: isPopupVisible ? "block" : "none" }}
              >
                <SearchKeyWords associatedKeywords={associatedKeywords} />
              </s.PopUpKeyWords>
            </div>
          ) : (
            <s.Keywords>
              {associatedKeywords.map((associatedKeywords) => (
                <span key={associatedKeywords}>{associatedKeywords}</span>
              ))}
            </s.Keywords>
          )}
        </div>
      </s.RowHeadlineSearch>

      {articleList?.map((each) => (
        <ArticlePreview
          api={api}
          key={each.id}
          article={each}
          dontShowSourceIcon={true}
        />
      ))}

      {isWaitingForNewArticles && (
        <LoadingAnimation delay={0}></LoadingAnimation>
      )}
    </div>
  );
}

function AddRemoveSearch({ api, query }) {
  const { subscribedSearches, removeSearch, subscribeToSearch } =
    useSelectInterest(api);

  const [textButton, setTextButton] = useState("");
  const [isSubscribedToSearch, setIsSubscribedToSearch] = useState();

  useEffect(() => {
    if (subscribedSearches) {
      const isSubscribed = subscribedSearches.some(
        (search) => search.search === query,
      );
      setIsSubscribedToSearch(isSubscribed);
      setTextButton(isSubscribed ? "- remove search" : "+ add search");
    }
  }, [subscribedSearches, query]);

  const toggleSearchSubscription = (query) => {
    if (isSubscribedToSearch) {
      const searchToRemove = subscribedSearches.find(
        (search) => search.search === query,
      );
      if (searchToRemove) {
        removeSearch(searchToRemove);
        setIsSubscribedToSearch(false);
        toast("Search removed from My Searches!");
      }
    } else {
      subscribeToSearch(query);
      setIsSubscribedToSearch(true);
      toast("Search added to My Searches!");
    }
  };

  return (
    <s.AddRemoveButton onClick={(e) => toggleSearchSubscription(query)}>
      {textButton}
    </s.AddRemoveButton>
  );
}

export { AddRemoveSearch, Search };
