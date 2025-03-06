import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import * as s from "../../styledComponents/ReadingInsightAccordion.sc";
import StudentTranslations from "./StudentTranslations";
import ReadingSessionCard from "./ReadingSessionCard";
import { useState } from "react";

const ReadingInsightAccordionItem = ({ isFirst, readingSession }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <s.ReadingInsightAccordion
      isFirst={isFirst}
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      <AccordionItem className="accordion-wrapper">
        <AccordionButton>
          <ReadingSessionCard readingSession={readingSession} isOpen={isOpen} />
        </AccordionButton>
        <AccordionPanel className="panel">
          {isOpen && <StudentTranslations article={readingSession} />}
        </AccordionPanel>
      </AccordionItem>
    </s.ReadingInsightAccordion>
  );
};
export default ReadingInsightAccordionItem;
