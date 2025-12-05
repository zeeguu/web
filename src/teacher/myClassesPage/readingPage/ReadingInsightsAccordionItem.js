import * as Accordion from "@radix-ui/react-accordion";
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
      <Accordion.Item className="accordion-wrapper" value={readingSession.session_id}>
        <Accordion.Trigger>
          <ReadingSessionCard readingSession={readingSession} isOpen={isOpen} />
        </Accordion.Trigger>
        <Accordion.Content className="panel">
          {isOpen && <StudentTranslations article={readingSession} />}
        </Accordion.Content>
      </Accordion.Item>
    </s.ReadingInsightAccordion>
  );
};
export default ReadingInsightAccordionItem;
