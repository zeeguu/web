import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import { v4 as uuid } from "uuid";
import * as s from "./ReadingInsightAccordion.sc";
import StudentTranslations from "./StudentTranslations";
import ArticleCard from "./ArticleCard";

const ReadingInsightAccordion = ({ readArticles }) => {
  const [openedArticle, setOpenedArticle] = useState(null);
  const [firstArticle, setFirstArticle] = useState("");

  useEffect(() => {
    setFirstArticle(readArticles[0].article_id);
    //eslint-disable-next-line
  }, []);

  const isFirstArticle = (articleID) => {
    return articleID === firstArticle;
  };

  const handleClick = (articleID) => {
    if (articleID === openedArticle) {
      setOpenedArticle(null);
    } else {
      setOpenedArticle(articleID);
    }
  };

  return (
    <Accordion collapsible>
      {readArticles !== null &&
        readArticles.map((article) => (
          <s.ReadingInsightAccordion key={uuid() + article.article_id}
            isFirst={isFirstArticle(article.article_id)}
          >
            <AccordionItem
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
