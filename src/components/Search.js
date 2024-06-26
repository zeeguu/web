import React, { useState, useEffect } from "react";
import * as s from './Search.sc';
import * as b from './allButtons.sc';
import { SearchKeyWords } from "./SearchKeyWords";
import useSelectInterest from "../hooks/useSelectInterest";
import { toast } from "react-toastify";

export default function Search( {api, query} ) {
    const {
        subscribedSearches,
        removeSearch,
        subscribeToSearch
    } = useSelectInterest(api);

    // Empty array for the associated keywords
    const associatedKeywords = [];

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [textButton, setTextButton] = useState('');
    const [isSubscribedToSearch, setIsSubscribedToSearch] = useState();

    // useEffect for handling the change in ui when screen is less than 500.
    useEffect(() => {
        const handleResize = () => {setIsMobile(window.innerWidth <= 500);};

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
                toast("Search removed from My Searches!");
            }
        } else {
            subscribeToSearch(query);
            console.log('search added');
            setIsSubscribedToSearch(true);
            toast("Search added to My Searches!");
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
    )
}

