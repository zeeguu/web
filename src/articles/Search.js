import React, { useState, useEffect } from "react";
import * as s from "./Search.sc";
import * as b from "../components/allButtons.sc";
import useQuery from "../hooks/useQuery";
import SubscribeSearchButton from "./SubscribeSearchButton";
import FindArticles from "./FindArticles";
import AssociatedKeywords from "../components/AssociatedKeywords";

export default function Search({ api }) {
  const searchQuery = useQuery().get("search");

  // Empty array for the associated keywords
  const associatedKeywords = [];
  // Setup for ui change from horizontal showing of keywords to button
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
  const [isPopupVisible, setPopupVisible] = useState(false);
  // useEffect for change from horizontal showing of keywords to button
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePopupKeyWords = () => {
    setPopupVisible(!isPopupVisible);
  };

  return (
    <FindArticles
      searchQuery={searchQuery}
      contentSearch={
        <>
          <s.RowHeadlineSearch>
            <s.ContainerH1Subscribe>
              <s.HeadlineSearch>{searchQuery}</s.HeadlineSearch>
            </s.ContainerH1Subscribe>

            {/* The set up for the associated keywords. A button when view on mobile,
                and horizontal list when larger than 500 px. */}
            <div className={isMobile ? "mobile" : "desktop"}>
              {isMobile ? (
                <div className="mobileButtonKeywords">
                  <b.OrangeRoundButton onClick={togglePopupKeyWords}>
                    Keywords
                  </b.OrangeRoundButton>

                  <s.PopUpKeywords
                    style={{ display: isPopupVisible ? "block" : "none" }}
                  >
                    <AssociatedKeywords
                      associatedKeywords={associatedKeywords}
                    />
                  </s.PopUpKeywords>
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
          <SubscribeSearchButton api={api} query={searchQuery} />
        </>
      }
    />
  );
}
