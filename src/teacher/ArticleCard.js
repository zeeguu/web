import React, { useState, useEffect } from "react";
import * as s from "./ReadingInsightAccordion.sc";
import ViewMoreLessButton from "./ViewMoreLessButton";
import StudentActivityDataCircleWrapper from "./StudentActivityDataCircleWrapper";
import StudentTranslations from "./StudentTranslations";

const ArticleCard = ({ article, isFirst, openedArticle }) => {

    //TODO could be turned into seperate component
    const formatedDate = (startTime) => {
        const date = new Date(startTime);
        const dateString = date.toString();
        return dateString;
    };
    return (
        <s.ReadingInsightAccordion>
            <div className="content-wrapper">
                <div className="date-title-wrapper">
                    {isFirst && <p>Title</p>}
                    <h2 className="article-title">
                        {article.title.substring(0, 100)}
                        {article.title.length > 100 ? "..." : ""}
                    </h2>
                    <p className="date">
                        STRINGS Reading date: {formatedDate(article.start_time)}
                    </p>
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
                        articleID={article.article_id}
                        openedArticle={openedArticle}
                    />
                </div>
            </div>
        </s.ReadingInsightAccordion>
    );
};
export default ArticleCard;
