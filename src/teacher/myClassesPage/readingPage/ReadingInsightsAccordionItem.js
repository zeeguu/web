import React from "react";
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import * as s from "../../styledComponents/ReadingInsightAccordion.sc";
import StudentTranslations from "./StudentTranslations";
import ReadingSessionCard from "./ReadingSessionCard";

const ReadingInsightAccordionItem = ({
  isFirst,
  readingSession,
  setOpenedArticle,
  openedArticle,
}) => {
  const handleClick = (sessionID) => {
    if (sessionID === openedArticle) {
      setOpenedArticle(null);
    } else {
      setOpenedArticle(sessionID);
    }
  };

  return (
    <s.ReadingInsightAccordion isFirst={isFirst}>
      <AccordionItem className="accordion-wrapper">
        <AccordionButton onClick={() => handleClick(readingSession.session_id)}>
          <ReadingSessionCard
            isFirst={isFirst}
            readingSession={readingSession}
            openedArticle={openedArticle}
          />
        </AccordionButton>
        <AccordionPanel className="panel">
          <StudentTranslations article={readingSession} />
        </AccordionPanel>
      </AccordionItem>
    </s.ReadingInsightAccordion>
  );
};
export default ReadingInsightAccordionItem;
