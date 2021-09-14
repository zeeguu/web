import React, { useState, useEffect } from "react";
import { Accordion } from "@reach/accordion";
import { v4 as uuid } from "uuid";
import ReadingInsightAccordionItem from "./ReadingInsightsAccordionItem";

const ReadingInsightAccordion = ({ readArticles }) => {
  const [firstArticle, setFirstArticle] = useState(null);
  const [restOfArticles, setRestOfArticles] = useState(null);
  const [openedArticle, setOpenedArticle] = useState(null);

  useEffect(() => {
    setFirstArticle(readArticles[0]);
    setRestOfArticles(readArticles.slice(1, readArticles.length));
    //eslint-disable-next-line
  }, []);

  return (
    <Accordion collapsible>
      {firstArticle !== null && (
        <ReadingInsightAccordionItem
          isFirst={true}
          article={firstArticle}
          openedArticle={openedArticle}
          setOpenedArticle={setOpenedArticle}
        />
      )}
      {restOfArticles !== null &&
        restOfArticles.map((article) => (
          <ReadingInsightAccordionItem
            key={uuid() + article.session_id}
            isFirst={false}
            article={article}
            openedArticle={openedArticle}
            setOpenedArticle={setOpenedArticle}
          />
        ))}
    </Accordion>
  );
};
export default ReadingInsightAccordion;
