import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import * as s from "./ReadingInsightAccordion.sc";
import ViewMoreLessButton from "./ViewMoreLessButton";
import StudentActivityDataCircleWrapper from "./StudentActivityDataCircleWrapper";
import StudentTranslations from "./StudentTranslations";

const ReadingInsightAccordion = ({ readArticles }) => {
  const [openedArticle, setOpenedArticle] = useState(null);
  const [firstArticle, setFirstArticle] = useState("");

  useEffect(() => {
    setFirstArticle(readArticles[0].article_id);
  }, [])

  const isFirstArticle = (articleID) => {
    return articleID === firstArticle;
  }

  const handleClick = (articleID) => {
    if (articleID === openedArticle) {
      setOpenedArticle(null);
    } else {
      setOpenedArticle(articleID);
    }
  };

  //TODO could be turned into seperate component
  const formatedDate = (startTime) => {
    const date = new Date(startTime);
    const dateString = date.toString();
    return dateString;
  };
  return (
    <s.ReadingInsightAccordion>
      <Accordion collapsible>
        {readArticles !== null &&
          readArticles.map((article) => (
            <AccordionItem
              key={article.article_id}
              className="accordion-wrapper"
            >
              <AccordionButton onClick={() => handleClick(article.article_id)}>
                <div className="content-wrapper">
                  <div className="date-title-wrapper">
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
                      isFirst={isFirstArticle(article.article_id)}
                    />
                    <ViewMoreLessButton
                      articleID={article.article_id}
                      openedArticle={openedArticle}
                    />
                  </div>
                </div>
              </AccordionButton>
              <AccordionPanel className="panel">
                <StudentTranslations article={article} />
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
    </s.ReadingInsightAccordion>
  );
};
export default ReadingInsightAccordion;
