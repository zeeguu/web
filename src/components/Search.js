import React, { useState, useEffect } from "react";
import * as s from './Search.sc';
import * as b from './allButtons.sc';
import { SearchKeyWords } from "./SearchKeyWords";
import useSelectInterest from "../hooks/useSelectInterest";

export default function Search( {api, query} ) {
    const {
        subscribedSearches,
        removeSearch,
        subscribeToSearch
    } = useSelectInterest(api);

    const associatedKeywords = ['Mental health', 'Fitness', 'Nutrition', 'Health Care'];
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [textButton, setTextButton] = useState('');
    const [isSubscribedToSearch, setIsSubscribedToSearch] = useState();

    useEffect(() => {
        const handleResize = () => {setIsMobile(window.innerWidth <= 600);};

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const isSubscribed = subscribedSearches.some(search => search.search === query);
        setIsSubscribedToSearch(isSubscribed);
        setTextButton(isSubscribed ? '- remove search' : '+ add search');
    }, [subscribedSearches, query]);
    

    const togglePopupKeyWords = () => {
        setPopupVisible(!isPopupVisible);
    };

    const toggleSearchSubscription = (query) => {
        if (isSubscribedToSearch) {
            const searchToRemove = subscribedSearches.find(search => search.search === query);
            if (searchToRemove) {
                removeSearch(searchToRemove);
                console.log('search removed');
                setIsSubscribedToSearch(false);
            }
        } else {
            subscribeToSearch(query);
            console.log('search added');
            setIsSubscribedToSearch(true);
        }
    };
    console.log('subscribed searches: ', subscribedSearches);
    console.log('is the searchterm subcribed: ', isSubscribedToSearch);

    return(
        <s.RowHeadlineSearch>
            <s.HeadlineSearch>
            <h1>{query}</h1> 
            <button onClick={(e) => toggleSearchSubscription(query)}>
                {textButton}
            </button>

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
    )
}

