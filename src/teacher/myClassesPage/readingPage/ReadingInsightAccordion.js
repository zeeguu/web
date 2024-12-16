import React, { useState, useEffect } from "react";
import { Accordion } from "@reach/accordion";
import { v4 as uuid } from "uuid";
import ReadingInsightAccordionItem from "./ReadingInsightsAccordionItem";

const ReadingInsightAccordion = ({ readingSessions }) => {
  // const [readingSession, setFirstReadingSession] = useState(null);
  // const [restOfReadingSessions, setRestOfReadingSessions] = useState(null);
  const [openedArticle, setOpenedArticle] = useState(null);

  return (
    <Accordion collapsible>
      {readingSessions !== null &&
        readingSessions.map((readingSession) => (
          <ReadingInsightAccordionItem
            key={uuid() + readingSession.session_id}
            isFirst={false}
            readingSession={readingSession}
            openedArticle={openedArticle}
            setOpenedArticle={setOpenedArticle}
          />
        ))}
    </Accordion>
  );
};
export default ReadingInsightAccordion;
