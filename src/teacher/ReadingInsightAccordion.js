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
  const [firstArticle, setFirstArticle] = useState(null);
  const [restOfArticles, setRestOfArticles] = useState(null);

  useEffect(() => {
    setFirstArticle(readArticles[0]);
    setRestOfArticles(readArticles.slice(1, readArticles.length));
    //eslint-disable-next-line
  }, []);

  const handleClick = (articleID) => {
    if (articleID === openedArticle) {
      setOpenedArticle(null);
    } else {
      setOpenedArticle(articleID);
    }
  };

  return (
    <Accordion collapsible>
      {firstArticle !== null &&
        <s.ReadingInsightAccordion
          isFirst={true}
        >
          <AccordionItem
            className="accordion-wrapper"
          >
            <AccordionButton onClick={() => handleClick(firstArticle.article_id)}>
              <ArticleCard
                isFirst={true}
                article={firstArticle}
                openedArticle={openedArticle}
              />
            </AccordionButton>
            <AccordionPanel className="panel">
              <StudentTranslations article={firstArticle} />
            </AccordionPanel>
          </AccordionItem>
        </s.ReadingInsightAccordion>}

      {restOfArticles !== null &&
        restOfArticles.map((article) => (
          <s.ReadingInsightAccordion key={uuid() + article.article_id}
            isFirst={false}
          >
            <AccordionItem
              className="accordion-wrapper"
            >
              <AccordionButton onClick={() => handleClick(article.article_id)}>
                <ArticleCard
                  isFirst={false}
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
