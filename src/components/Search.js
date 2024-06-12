import React, { useState, useEffect } from "react";
import * as s from './Search.sc';
import * as b from './allButtons.sc';
import { SearchKeyWords } from "./SearchKeyWords";

export default function Search( {query} ) {
    const [isAddedAsKeyword, setKeywords] = useState(false);
    const associatedKeywords = ['Mental health', 'Fitness', 'Nutrition', 'Health Care']
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [isPopupVisible, setPopupVisible] = useState(false);

    useEffect(() => {
        const handleResize = () => {setIsMobile(window.innerWidth <= 600);};

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const togglePopupKeyWords = () => {
        setPopupVisible(!isPopupVisible);
    };

    function handleUpdateKeywordList(){
        if(isAddedAsKeyword === true){
          setKeywords(false);
        }
        else{
          setKeywords(true);
        }
    }

    return(
        <s.RowHeadlineSearch>
            <s.HeadlineSearch>
            <h1>{query}</h1>
            {isAddedAsKeyword &&  
            <p onClick={handleUpdateKeywordList}>
                + add search
            </p>
            }
            {!isAddedAsKeyword &&
                <p onClick={handleUpdateKeywordList}>
                + remove search
                </p>
            }
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

