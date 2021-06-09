import React from "react";
import strings from "../i18n/definitions";
import * as s from "./ReadingInsightAccordion.sc";
import ViewMoreLessButton from "./ViewMoreLessButton";
import StudentActivityDataCircleWrapper from "./StudentActivityDataCircleWrapper";

const ArticleCard = ({ article, isFirst, openedArticle }) => {
  const formatedDate = (startTime) => {
    return new Date(startTime).toUTCString();
  };
  
  return (
    <s.ReadingInsightAccordion isFirst={isFirst}>
      <div className="content-wrapper">
        <div className="date-title-wrapper">
          {isFirst && <p className="head-title">{strings.title}</p>}

          <div className="left-line">
            <h2 className="article-title">
              {article.title.substring(0, 100)}
              {article.title.length > 100 ? "..." : ""}
            </h2>
            <p className="date">
              {strings.readingDate} {formatedDate(article.start_time)}
            </p>
          </div>
        </div>
        <div className="data-circle-wrapper">
          <StudentActivityDataCircleWrapper
            className="data-circles"
            length={article.word_count}
            difficulty={article.difficulty}
            readingTime={article.duration_in_sec}
            translatedWords={article.translations.length}
            isFirst={isFirst}
          />
          <ViewMoreLessButton
            isFirst={isFirst}
            articleID={article.article_id}
            openedArticle={openedArticle}
          />
        </div>
      </div>
    </s.ReadingInsightAccordion>
  );
};
export default ArticleCard;
