import React, {useState, useEffect} from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";

import * as s from "../components/TopMessage.sc";
import { ArticlePreview } from "./ArticlePreview.sc";
import { setTitle } from "../assorted/setTitle";

export default function MySearches ( {api} ){
    const [articlesBySearchTerm, setArticlesBySearchTerm] = useState([]);
    const savedSearches = ['Misinformation', 'soldat'];
    
    useEffect(() => {
        setTitle("Saved Searches");

        savedSearches.forEach(searchTerm =>{
            api.search(searchTerm, (articles) => {
                const limitedArticles = articles.slice(0, 5);
                console.log(limitedArticles);
        
                setArticlesBySearchTerm(prevState => [
                    ...prevState,
                    { searchTerm, articles: limitedArticles },
                ]);
                console.log(articlesBySearchTerm);
            });
        })
      }, []);

    if(articlesBySearchTerm == null){
        return <LoadingAnimation/>
    }

    if(articlesBySearchTerm.length === 0){
        return <s.TopMessage>{strings.NoSavedSearches}</s.TopMessage>
    }

    return (
        <div>
            {articlesBySearchTerm.map(({ searchTerm, articles }) =>
            <div key={searchTerm}>
            <div>{searchTerm}</div>
                {articles.map(each =>
                <ArticlePreview
                api={api}
                key={each.id}
                article={each}
                dontShowSourceIcon={true}/>
                )}
            </div>
            )}
        </div>
    )
}