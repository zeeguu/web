import React, { useState, useEffect, useContext } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext.js";
import * as s from "../components/TopMessage.sc";
import * as d from "./MySearches.sc";
import ArticlePreview from "./ArticlePreview";
import { setTitle } from "../assorted/setTitle";
import useSelectInterest from "../hooks/useSelectInterest";
import { useHistory } from "react-router-dom";
import SubscribeSearchButton from "./SubscribeSearchButton.js";
import SearchField from "./SearchField.js";
export default function MySearches() {
  const api = useContext(APIContext);
  const history = useHistory();
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
    return new Promise((resolve, reject) => {
      api.latestSearch(
        searchTerm,
        (articles) => {
          const firstTwoArticles = articles.slice(0, 2);
          resolve({ searchTerm, articles: firstTwoArticles });
        },
        reject,
      );
    });
  }

  async function subscribedSearchesWithTopArticles(subscribedSearches) {
    const promises = subscribedSearches.map((searchTerm) => topArticlesForSearchTerm(searchTerm.search));
    return Promise.all(promises);
  }

  async function fetchData() {
    subscribedSearchesWithTopArticles(subscribedSearches)
      .then((results) => {
        // Sort by most recent article in each search category
        const sortedResults = [...results].sort((a, b) => {
          const aDate = a.articles[0]?.published ? new Date(a.articles[0].published) : new Date(0);
          const bDate = b.articles[0]?.published ? new Date(b.articles[0].published) : new Date(0);
          return bDate - aDate; // Most recent first
        });
        setArticlesBySearchTerm(sortedResults);
        setIsLoading(false);
      })
      .catch(() => {
        // Show what we have on a failed search term, dismiss the spinner.
        setArticlesBySearchTerm([]);
        setIsLoading(false);
      });
  }

  if (isLoading) {
    // Shorter delay than the 1s default: swipe navigation slides the old tab
    // away and leaves a blank panel, so the spinner needs to land sooner.
    return <LoadingAnimation delay={300} />;
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
        <d.SavedSearchBlock key={searchTerm}>
          <d.HeadlineSavedSearches>{searchTerm}</d.HeadlineSavedSearches>
          <SubscribeSearchButton query={searchTerm} />
          {articles.length === 0 && <p>No recent articles were found for this keyword.</p>}
          {articles.map((each) => (
            <ArticlePreview key={each.id} article={each} />
          ))}
          <d.buttonMoreArticles onClick={() => history.push(`/search?search=${encodeURIComponent(searchTerm)}`)}>
            {articles.length === 0 ? "Search for Keyword" : "See more articles"}
          </d.buttonMoreArticles>
        </d.SavedSearchBlock>
      ))}
    </>
  );
}
