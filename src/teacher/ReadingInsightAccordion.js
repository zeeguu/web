import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import { v4 as uuid } from "uuid";
import strings from "../i18n/definitions";
import * as s from "./ReadingInsightAccordion.sc";
import ViewMoreLessButton from "./ViewMoreLessButton";
import StudentActivityDataCircleWrapper from "./StudentActivityDataCircleWrapper";
import StudentTranslations from "./StudentTranslations";
import ArticleCard from "./ArticleCard";

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

    <Accordion collapsible>
      {readArticles !== null &&
        readArticles.map((article) => (
          <s.ReadingInsightAccordion isFirst={isFirstArticle(article.article_id)}>
            <AccordionItem
              key={uuid() + article.article_id}
              className="accordion-wrapper"
            >
              <AccordionButton onClick={() => handleClick(article.article_id)}>
                <ArticleCard
                  isFirst={isFirstArticle(article.article_id)}
                  article={article}
                  openedArticle={openedArticle}
                />
              </AccordionButton>
              <AccordionPanel className="panel">
                <StudentTranslations article={article} />
              </AccordionPanel>
            </AccordionItem>
          </s.ReadingInsightAccordion>
        ))}
    </Accordion>

  );
};
export default ReadingInsightAccordion;
