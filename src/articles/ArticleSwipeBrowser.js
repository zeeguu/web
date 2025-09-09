import React from "react";
import * as s from "./ArticleSwipeBrowser.sc";
import ArticleCard from "../components/article_swipe/ArticleCard";
import ArticleSwipeControl from "../components/article_swipe/ArticleSwipeControl";

export default function ArticleSwipeBrowser() {
  return (
    <s.PageWrapper>
      <s.CardAndControls>
        <ArticleCard />
        <ArticleSwipeControl />
      </s.CardAndControls>
    </s.PageWrapper>
  );
}
