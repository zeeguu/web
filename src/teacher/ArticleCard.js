import React, { useState, useEffect } from "react";
import strings from "../i18n/definitions";
import * as s from "./ReadingInsightAccordion.sc";
import ViewMoreLessButton from "./ViewMoreLessButton";
import StudentActivityDataCircleWrapper from "./StudentActivityDataCircleWrapper";
import { longFormatedDate } from "./FormatedDate";

const ArticleCard = ({ article, isFirst, openedArticle }) => {
  const [translationCount, setTranslationCount] = useState(0);

  useEffect(() => {
    setTranslationCount(0);
    let previousTranslation = {};
    article.translations.forEach((translation) => {
      if (
        previousTranslation === {} ||
        (previousTranslation !== {} &&
          translation.id !== previousTranslation.id)
      ) {
        setTranslationCount((prev) => prev + 1);
        previousTranslation = translation;
      }
    });
    //eslint-disable-next-line
  }, []);

  return (
    <s.ReadingInsightAccordion isFirst={isFirst}>
      <div className="content-wrapper">
        <div className="date-title-wrapper">
          {isFirst && <p className="head-title">{strings.title}</p>}
          <div className="left-line" isFirst={isFirst}>
            <h2 className="article-title">
              {article.title.substring(0, 100)}
              {article.title.length > 100 ? "..." : ""}
            </h2>
            <p className="date">
              {strings.readingDate} {longFormatedDate(article.start_time)}
            </p>
          </div>
        </div>
        <div className="data-circle-wrapper">
          <StudentActivityDataCircleWrapper
            className="data-circles"
            length={article.word_count}
            difficulty={article.difficulty}
            readingTime={article.duration_in_sec}
            translatedWords={translationCount}
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
