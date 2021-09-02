import React, { useState, useEffect } from "react";
import strings from "../../../i18n/definitions";
import * as s from "../../styledComponents/ReadingInsightAccordion.sc";
import ViewMoreLessButton from "./ViewMoreLessButton";
import StudentActivityDataCircleWrapper from "../cohortsPage/StudentActivityDataCircleWrapper";
import { longFormattedDate } from "../../sharedComponents/FormattedDate";

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
          <div className="left-line">
            <h2 className="article-title">
              {article.title.substring(0, 100)}
              {article.title.length > 100 ? "..." : ""}
            </h2>
            <p className="date">
              {strings.readingDate} {longFormattedDate(article.start_time)}
            </p>
          </div>
        </div>
        <div className="data-circle-wrapper">
          <StudentActivityDataCircleWrapper
            className="data-circles"
            length={article.word_count}
            difficulty={article.difficulty / 10}
            readingTime={article.duration_in_sec}
            translatedWords={translationCount}
            isFirst={isFirst}
          />
          <ViewMoreLessButton
            isFirst={isFirst}
            sessionID={article.session_id}
            openedArticle={openedArticle}
          />
        </div>
      </div>
    </s.ReadingInsightAccordion>
  );
};
export default ArticleCard;
