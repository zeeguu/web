import React, { useState, useEffect } from "react";
import { Accordion } from "@reach/accordion";
import { v4 as uuid } from "uuid";
import ReadingInsightAccordionItem from "./ReadingInsightsAccordionItem";

const ReadingInsightAccordion = ({ readingSessions }) => {
  const [readingSession, setFirstReadingSession] = useState(null);
  const [restOfReadingSessions, setRestOfReadingSessions] = useState(null);
  const [openedArticle, setOpenedArticle] = useState(null);

  useEffect(() => {
    setFirstReadingSession(readingSessions[0]);
    setRestOfReadingSessions(readingSessions.slice(1, readingSessions.length));
    //eslint-disable-next-line
  }, []);

  return (
    <Accordion collapsible>
      {readingSession !== null && (
        <ReadingInsightAccordionItem
          isFirst={true}
          readingSession={readingSession}
          openedArticle={openedArticle}
          setOpenedArticle={setOpenedArticle}
        />
      )}
      {restOfReadingSessions !== null &&
        restOfReadingSessions.map((article) => (
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
