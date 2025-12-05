import * as Accordion from "@radix-ui/react-accordion";
import { v4 as uuid } from "uuid";
import ReadingInsightAccordionItem from "./ReadingInsightsAccordionItem";

const ReadingInsightAccordion = ({ readingSessions }) => {
  return (
    <Accordion.Root type="single" collapsible>
      {readingSessions !== null &&
        readingSessions.map((readingSession) => (
          <ReadingInsightAccordionItem
            key={uuid() + readingSession.session_id}
            readingSession={readingSession}
          />
        ))}
    </Accordion.Root>
  );
};
export default ReadingInsightAccordion;
