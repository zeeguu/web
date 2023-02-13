import React, { useEffect, useState } from "react";
import ArticlePreview from "./ArticlePreview";
import Interests from "./Interests";
import SearchField from "./SearchField";
import * as s from "./FindArticles.sc";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import ExtensionMessage from "../components/ExtensionMessage";
import LocalStorage from "../assorted/LocalStorage";
import {
  runningInChromeDesktop,
  runningInFirefoxDesktop,
} from "../utils/misc/browserDetection";
import { checkExtensionInstalled } from "../utils/misc/extensionCommunication";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { FiltersWrapper } from "./filters/FiltersWrapper";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function NewArticles({ api }) {
  const query = useQuery();

  const [isLoading, setIsLoading] = useState(true);
  const [articleList, setArticleList] = useState([]);
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

    if (query?.get("search")) {
      return api.search(query.get("search"), (articles) => {
        setIsLoading(false);

        setArticleList(articles);
      });
    }

    return api.getUserArticles((articles) => {
      setIsLoading(false);

      setArticleList(articles);
    });
  }, []);

  useEffect(() => {
    if (!hasExtension) setExtensionMessageOpen(true);
  }, [hasExtension]);

  const searchArticlesBySearchField = async (searchText) => {
    setIsLoading(true);
    if (!searchText) {
      return api.getUserArticles((articles) => {
        setIsLoading(false);

        setArticleList(articles);
      });
    }

    await api.search(searchText, (articles) => {
      setIsLoading(false);

      setArticleList(articles);
    });
  };
  console.log(articleList);
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

      <FiltersWrapper>
        {isLoading ? (
          <CircularProgress
            style={{
              alignSelf: "center",
              marginTop: "50px",
            }}
          />
        ) : articleList?.length !== 0 ? (
          <>
            <s.ArticlesContainer>
              {articleList?.map((article) => (
                <ArticlePreview
                  key={article.id}
                  article={article}
                  api={api}
                  hasExtension={hasExtension}
                />
              ))}
            </s.ArticlesContainer>
          </>
        ) : (
          <p>No articles found that match your search</p>
        )}
      </FiltersWrapper>
    </s.MaterialSelection>
  );
}
