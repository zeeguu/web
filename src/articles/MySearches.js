import React, {useState, useEffect, useMemo} from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";

import * as s from "../components/TopMessage.sc";
import * as d from "./MySearches.sc";
import ArticlePreview  from "./ArticlePreview";
import { setTitle } from "../assorted/setTitle";

export default function MySearches ( {api} ){
    const [articlesBySearchTerm, setArticlesBySearchTerm] = useState([]);
    const [loading, setLoading] = useState(true);
    const savedSearches = useMemo(() => ['Misinformation', 'soldat'], []);
    
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
      
          Promise.all(savedSearches.map(fetchArticlesForSearchTerm))
            .then((results) => {
              setArticlesBySearchTerm(results);
              setLoading(false); // Set loading to false after all articles are fetched
            });
      }, [api, savedSearches]);

    console.log('The right list: ');
    console.log(articlesBySearchTerm);

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