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
import Filters from "../utils/filters/filters";
import { MobileFilters } from "./filters/MobileFilters";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function NewArticles({ api }) {
  const query = useQuery();

  const [isLoading, setIsLoading] = useState(true);
  const [articleList, setArticleList] = useState([{}]);
  const [hasExtension, setHasExtension] = useState(true);
  const [extensionMessageOpen, setExtensionMessageOpen] = useState(false);
  const [displayedExtensionPopup, setDisplayedExtensionPopup] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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

        Filters.setArticlesList(articles);
        Filters.setCurrentFilter(null);
        setArticleList(articles);
      });
    }

    return api.getUserArticles((articles) => {
      setIsLoading(false);

      Filters.setArticlesList(articles);
      Filters.setCurrentFilter(null);
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

        Filters.setArticlesList(articles);
        Filters.setCurrentFilter(null);
        setArticleList(articles);
      });
    }

    await api.search(searchText, (articles) => {
      setIsLoading(false);

      Filters.setArticlesList(articles);
      Filters.setCurrentFilter(null);
      setArticleList(articles);
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

      <SearchField
        onOpenFilters={() => setIsFiltersOpen(true)}
        searchFunc={searchArticlesBySearchField}
      />

      <Interests setArticles={setArticleList} />

      {/* Article example */}
      <ArticlePreview
        key={123}
        article={{
          title: "aaaaaa",
          summary:
            "Nostrud velit tempor cupidatat excepteur eiusmod irure incididunt veniam nulla magna ipsum exercitation cupidatat. Aliqua amet quis deserunt voluptate voluptate quis velit commodo sint do. Cillum nostrud cupidatat exercitation voluptate sit velit aute. Ullamco et sit id consequat ex Lorem nisi consequat velit ut dolor reprehenderit culpa. Dolor ea exercitation sit nisi cupidatat adipisicing velit et aliquip ut est ut amet. Nisi proident cillum elit sunt eiusmod exercitation ut. Pariatur officia laborum officia aute duis excepteur aliquip.",
          metrics: { difficulty: 4 },
        }}
        api={api}
        hasExtension={false}
        isTwoColumns={false}
      />

      <FiltersWrapper setArticles={setArticleList}>
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
                  isTwoColumns={true}
                />
              ))}
            </s.ArticlesContainer>
          </>
        ) : (
          <p>No articles found that match your search</p>
        )}
      </FiltersWrapper>
      <MobileFilters
        setArticles={setArticleList}
        isFiltersOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />
    </s.MaterialSelection>
  );
}
