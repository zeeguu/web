import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import strings from "../i18n/definitions";
import * as s from "./SortingButtons.sc";

export default function SortingButtons({ articleList, setArticleList, clearStateTrigger }) {
  const [sortOption, setSortOption] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const isOnTeacherSite = useLocation().pathname.includes("teacher");
  const isOnSavedArticles = useLocation().pathname.includes("ownTexts");
  const [originalList, setOriginalList] = useState([]);

  useEffect(() => {
    setSortOption("");
    setOriginalList([]);
  }, [clearStateTrigger]);

  useEffect(() => {
    // Store original list when first sorting
    if (sortOption && originalList.length === 0) {
      setOriginalList([...articleList]);
    }
  }, [articleList, sortOption, originalList]);

  function getReadingCompletion(article) {
    // If the article wasn't open give a negative value so they are first in the list.
    let openAdjustment = article.opened ? 0 : 0.1;
    return article.reading_completion ? article.reading_completion : 0 - openAdjustment;
  }

  function handleSortSelect(value) {
    setSortOption(value);
    setShowDropdown(false);
    
    if (!value || value === "") {
      // Reset to original order
      if (originalList.length > 0) {
        setArticleList([...originalList]);
      }
      return;
    }

    // Store original list if not already stored
    if (originalList.length === 0) {
      setOriginalList([...articleList]);
    }

    let sortedList = [...articleList];
    
    switch (value) {
      case "level-asc":
        sortedList.sort((a, b) => a.metrics.difficulty - b.metrics.difficulty);
        break;
      case "level-desc":
        sortedList.sort((a, b) => b.metrics.difficulty - a.metrics.difficulty);
        break;
      case "length-asc":
        sortedList.sort((a, b) => 
          (a.video && b.video ? a.duration - b.duration : a.metrics.word_count - b.metrics.word_count)
        );
        break;
      case "length-desc":
        sortedList.sort((a, b) => 
          (b.video && a.video ? b.duration - a.duration : b.metrics.word_count - a.metrics.word_count)
        );
        break;
      case "progress-asc":
        sortedList.sort((a, b) => getReadingCompletion(a) - getReadingCompletion(b));
        break;
      case "progress-desc":
        sortedList.sort((a, b) => getReadingCompletion(b) - getReadingCompletion(a));
        break;
      default:
        break;
    }
    
    setArticleList(sortedList);
  }

  function getSortDisplayText() {
    switch (sortOption) {
      case "level-asc": return "Level ↑";
      case "level-desc": return "Level ↓";
      case "length-asc": return "Length ↑";
      case "length-desc": return "Length ↓";
      case "progress-asc": return "Progress ↑";
      case "progress-desc": return "Progress ↓";
      default: return "None";
    }
  }

  return (
    <s.SortingButtons $isOnTeacherSite={isOnTeacherSite}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <span 
          style={{ 
            fontSize: window.innerWidth <= 768 ? "0.8em" : "0.9em", 
            color: "#666", 
            cursor: "pointer",
            textDecoration: "underline"
          }}
          title="Click to change sorting"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          Sorting: {getSortDisplayText()}
        </span>
        
        {showDropdown && (
          <div style={{
            position: "absolute",
            top: "100%",
            right: "0",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 1000,
            minWidth: "120px"
          }}>
            <div 
              style={{ padding: "0.5rem", cursor: "pointer", borderBottom: "1px solid #eee" }}
              onClick={() => handleSortSelect("")}
            >
              None
            </div>
            <div 
              style={{ padding: "0.5rem", cursor: "pointer", borderBottom: "1px solid #eee" }}
              onClick={() => handleSortSelect("level-asc")}
            >
              Level ↑
            </div>
            <div 
              style={{ padding: "0.5rem", cursor: "pointer", borderBottom: "1px solid #eee" }}
              onClick={() => handleSortSelect("level-desc")}
            >
              Level ↓
            </div>
            <div 
              style={{ padding: "0.5rem", cursor: "pointer", borderBottom: "1px solid #eee" }}
              onClick={() => handleSortSelect("length-asc")}
            >
              Length ↑
            </div>
            <div 
              style={{ padding: "0.5rem", cursor: "pointer", borderBottom: isOnSavedArticles ? "1px solid #eee" : "none" }}
              onClick={() => handleSortSelect("length-desc")}
            >
              Length ↓
            </div>
            {isOnSavedArticles && (
              <>
                <div 
                  style={{ padding: "0.5rem", cursor: "pointer", borderBottom: "1px solid #eee" }}
                  onClick={() => handleSortSelect("progress-asc")}
                >
                  Progress ↑
                </div>
                <div 
                  style={{ padding: "0.5rem", cursor: "pointer" }}
                  onClick={() => handleSortSelect("progress-desc")}
                >
                  Progress ↓
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </s.SortingButtons>
  );
}
