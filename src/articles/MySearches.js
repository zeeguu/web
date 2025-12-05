import React, { useState, useEffect, useContext } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext.js";
import * as s from "../components/TopMessage.sc";
import * as d from "./MySearches.sc";
import ArticlePreview from "./ArticlePreview";
import { setTitle } from "../assorted/setTitle";
import useSelectInterest from "../hooks/useSelectInterest";
import redirect from "../utils/routing/routing.js";
import SubscribeSearchButton from "./SubscribeSearchButton.js";
import SearchField from "./SearchField.js";
import useBrowsingSession from "../hooks/useBrowsingSession";

export default function MySearches() {
  const api = useContext(APIContext);
  useBrowsingSession("my_searches");
  const { subscribedSearches } = useSelectInterest(api);
  const [articlesBySearchTerm, setArticlesBySearchTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (subscribedSearches) {
      setTitle("Saved Searches");
      fetchData();
    }

    return () => {
      setIsLoading(true);
    };
    // eslint-disable-next-line
  }, [subscribedSearches]);

  async function topArticlesForSearchTerm(searchTerm) {
    return new Promise((resolve) => {
      api.latestSearch(searchTerm, (articles) => {
        const firstTwoArticles = articles.slice(0, 2);
        resolve({ searchTerm, articles: firstTwoArticles });
      });
    });
  }

  async function subscribedSearchesWithTopArticles(subscribedSearches) {
    const promises = subscribedSearches.map((searchTerm) => topArticlesForSearchTerm(searchTerm.search));
    return Promise.all(promises);
  }

  async function fetchData() {
    subscribedSearchesWithTopArticles(subscribedSearches).then((results) => {
      setArticlesBySearchTerm(results);
      setIsLoading(false);
    });
  }

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (subscribedSearches && subscribedSearches.length === 0) {
    return (
      <>
        <div>
          <SearchField />
        </div>
        <s.YellowMessageBox>{strings.NoSavedSearches}</s.YellowMessageBox>
      </>
    );
  }

  return (
    <>
      <SearchField />
      {articlesBySearchTerm.map(({ searchTerm, articles }) => (
        <div key={searchTerm}>
          <d.HeadlineSavedSearches>{searchTerm}</d.HeadlineSavedSearches>
          <SubscribeSearchButton query={searchTerm} />
          {articles.length === 0 && <p>No recent articles were found for this keyword.</p>}
          {articles.map((each) => (
            <ArticlePreview key={each.id} article={each} />
          ))}
          <d.buttonMoreArticles onClick={(e) => redirect(`/search?search=${searchTerm}`)}>
            {articles.length === 0 ? "Search for Keyword" : "See more articles"}
          </d.buttonMoreArticles>
        </div>
      ))}
    </>
  );
}
