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
    const [isSubscribed, setIsSubscribed] = useState();


    useEffect(() => {
        const handleResize = () => {setIsMobile(window.innerWidth <= 600);};

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setIsSubscribed(subscribedSearches.some(search => search.search === query));
        if(isSubscribed){
            setTextButton('- remove search');
        }
        else{
            setTextButton('+ add search');
        }
    }, [subscribedSearches, query, isSubscribed]);
    

    const togglePopupKeyWords = () => {
        setPopupVisible(!isPopupVisible);
    };

    const toggleSearchSubscription = (query) => {
        if(subscribedSearches.length === 0){
            subscribeToSearch(query);
            setIsSubscribed(true);
        }
        subscribedSearches.forEach((search) =>{
            if(search.search === query){
                removeSearch(search);
                setIsSubscribed(false);
            }
            else{
                subscribeToSearch(query);
                setIsSubscribed(true);
            }
        });
    };
    console.log(subscribedSearches);

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

