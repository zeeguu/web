import React, { useState, useEffect } from "react";
import * as s from './Search.sc';
import * as b from '../components/allButtons.sc';
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

function Search( {api} ) {
    const query = useQuery().get("search");
    const [articleList, setArticleList] = useState(null);
    const [originalList, setOriginalList] = useState(null);

    // Empty array for the associated keywords
    const associatedKeywords = [];
    // Setup for ui change from horizontal showing of keywords to button
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
    const [isPopupVisible, setPopupVisible] = useState(false);
    // useEffect for change from horizontal showing of keywords to button
    useEffect(() => {
        const handleResize = () => {setIsMobile(window.innerWidth <= 500);};

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    useEffect(() => {
        setTitle("Search Articles");
    
        if(query){
        api.search(query, (articles) => {
            setArticleList(articles);
            setOriginalList([...articles]);
          });
        }
    }, []);

    const togglePopupKeyWords = () => {
        setPopupVisible(!isPopupVisible);
    };

    if (articleList == null) {
        return <LoadingAnimation />;
    }

    if (query && articleList.length === 0) {
        return <t.TopMessage>{strings.NoSearchMatch}</t.TopMessage>;
    }

    return(
        <div>
            <s.SearchAndSort>
                <SearchField api={api} query={query} />
                <SortingButtons
                articleList={articleList}
                originalList={originalList}
                setArticleList={setArticleList}
                />
            </s.SearchAndSort>
            <s.RowHeadlineSearch>
                <s.HeadlineSearch>
                <h1>{query}</h1> 
                <AddRemoveSearch
                api={api}
                query={query}/>

                {/* The set up for the associated keywords. A button when view on mobile,
                and horizontal list when larger than 500 px. */}
                </s.HeadlineSearch>
                <div className={isMobile ? 'mobile' : 'desktop'}>
                    {isMobile ? (
                        <div className="mobileButtonKeywords">
                            <b.OrangeRoundButton
                                onClick={togglePopupKeyWords}>
                                Keywords
                            </b.OrangeRoundButton>

                            <s.PopUpKeyWords
                            style={{ display: isPopupVisible ? 'block' : 'none'}}>
                                <SearchKeyWords
                                associatedKeywords={associatedKeywords}/>
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
      </div>
    )
}

function AddRemoveSearch( {api, query} ){
    const {
        subscribedSearches,
        removeSearch,
        subscribeToSearch
    } = useSelectInterest(api);

    const [textButton, setTextButton] = useState('');
    const [isSubscribedToSearch, setIsSubscribedToSearch] = useState();

    useEffect(() => {
        const isSubscribed = subscribedSearches.some(search => search.search === query);
        setIsSubscribedToSearch(isSubscribed);
        setTextButton(isSubscribed ? '- remove search' : '+ add search');
    }, [subscribedSearches, query]);

    const toggleSearchSubscription = (query) => {
        if (isSubscribedToSearch) {
            const searchToRemove = subscribedSearches.find(search => search.search === query);
            if (searchToRemove) {
                removeSearch(searchToRemove);
                console.log('search removed');
                setIsSubscribedToSearch(false);
                toast("Search removed from My Searches!");
            }
        } else {
            subscribeToSearch(query);
            console.log('search added');
            setIsSubscribedToSearch(true);
            toast("Search added to My Searches!");
        }
    };
    //console.log('subscribed searches: ', subscribedSearches);
    //console.log('is the searchterm subcribed: ', isSubscribedToSearch);

    return(
        <s.AddRemoveButton onClick={(e) => toggleSearchSubscription(query)}>
            {textButton}
        </s.AddRemoveButton>
    )
}

export { AddRemoveSearch, Search };