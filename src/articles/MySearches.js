import React, {useState, useEffect} from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";

import * as s from "../components/TopMessage.sc";
import * as d from "./MySearches.sc";
import ArticlePreview  from "./ArticlePreview";
import { setTitle } from "../assorted/setTitle";
import useSelectInterest from "../hooks/useSelectInterest";

export default function MySearches ( {api} ){
    const {
        subscribedSearches
    } = useSelectInterest(api);
    const [articlesBySearchTerm, setArticlesBySearchTerm] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        setTitle("Saved Searches");

        const fetchArticlesForSearchTerm = (searchTerm) => {
            return new Promise((resolve) => {
              api.search(searchTerm, (articles) => {
                const limitedArticles = articles.slice(0, 5);
                resolve({ searchTerm, articles: limitedArticles });
              });
            });
          };
      
          Promise.all(subscribedSearches.map((search) => fetchArticlesForSearchTerm(search.search)))
            .then((results) => {
                setArticlesBySearchTerm(results);
                setLoading(false); // Set loading to false after all articles are fetched
            });
      }, [api, subscribedSearches]);

      console.log(subscribedSearches);


    if(loading){
        return <LoadingAnimation/>
    }

    if(articlesBySearchTerm.length === 0){
        return <s.TopMessage>{strings.NoSavedSearches}</s.TopMessage>
    }

    return (
        <div>
            {articlesBySearchTerm.map(({ searchTerm, articles }) => (
                <div key={searchTerm}>
                    <d.HeadlineSavedSearches>{searchTerm}</d.HeadlineSavedSearches>
                
                        {articles.map(each => (
                        <ArticlePreview
                        key={each.id}
                        api={api}
                        article={each}/>
                    ))}
                </div>
            ))}

        </div>
    )
}