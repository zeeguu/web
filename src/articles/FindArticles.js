import React, { useEffect, useState } from "react";
import ArticlePreview from "./ArticlePreview";
import SortingButtons from "./SortingButtons";
import Interests from "./Interests";
import SearchField from "./SearchField";
import * as s from "./FindArticles.sc";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Reminder from "./Reminder";
import ExtensionMessage from "../components/ExtensionMessage";
import LocalStorage from "../assorted/LocalStorage";
import {
  runningInChromeDesktop,
  runningInFirefoxDesktop,
} from "../utils/misc/browserDetection";
import { checkExtensionInstalled } from "../utils/misc/extensionCommunication";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

export default function NewArticles({ api }) {
  const searchQuery = useLocation().search;

  const [isLoading, setIsLoading] = useState(true);
  const [articleList, setArticleList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [hasExtension, setHasExtension] = useState(true);
  const [extensionMessageOpen, setExtensionMessageOpen] = useState(false);
  const [displayedExtensionPopup, setDisplayedExtensionPopup] = useState(false);

  useEffect(() => {
    setTitle(strings.findArticles);

    setDisplayedExtensionPopup(LocalStorage.displayedExtensionPopup());
    console.log(
      "Localstorage displayed extension: " +
        LocalStorage.displayedExtensionPopup()
    );

    if (runningInChromeDesktop() || runningInFirefoxDesktop()) {
      checkExtensionInstalled(setHasExtension);
    }

    setIsLoading(true);
    if (searchQuery) {
      api.search(searchQuery, (articles) => {
        setIsLoading(false);

        setArticleList(articles);
        setOriginalList([...articles]);
      });
    } else {
      api.getUserArticles((articles) => {
        setIsLoading(false);

        setArticleList(articles);
        setOriginalList([...articles]);
      });
    }
  }, []);

  useEffect(() => {
    if (!hasExtension) {
      setExtensionMessageOpen(true);
    }
  }, [hasExtension]);

  //when the user changes interests...
  function articlesListShouldChange() {
    setArticleList(null);
    api.getUserArticles((articles) => {
      setArticleList(articles);
      setOriginalList([...articles]);
    });
  }

  const searchArticlesBySearchField = async (searchText) => {
    setIsLoading(true);
    if (!searchText) {
      return api.getUserArticles((articles) => {
        setIsLoading(false);

        setArticleList(articles);
        setOriginalList([...articles]);
      });
    }

    await api.search(searchText, (articles) => {
      setIsLoading(false);

      setArticleList(articles);
      setOriginalList([...articles]);
    });
  };

  return (
    <s.MaterialSelection>
      <ExtensionMessage
        open={extensionMessageOpen}
        hasExtension={hasExtension}
        displayedExtensionPopup={displayedExtensionPopup}
        setExtensionMessageOpen={setExtensionMessageOpen}
        setDisplayedExtensionPopup={setDisplayedExtensionPopup}
      ></ExtensionMessage>

      <SearchField searchFunc={searchArticlesBySearchField} />

      <Interests />

      {isLoading ? (
        <CircularProgress style={{ alignSelf: "center" }} />
      ) : articleList?.length !== 0 ? (
        <>
          <SortingButtons
            articleList={articleList}
            originalList={originalList}
            setArticleList={setArticleList}
          />
          <Reminder hasExtension={hasExtension}></Reminder>
          {articleList?.map((each) => (
            <ArticlePreview
              key={each.id}
              article={each}
              api={api}
              hasExtension={hasExtension}
            />
          ))}
        </>
      ) : (
        <p>No articles found that match your search</p>
      )}
    </s.MaterialSelection>
  );
}
