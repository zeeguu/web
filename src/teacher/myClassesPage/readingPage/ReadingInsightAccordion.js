import { Accordion } from "@reach/accordion";
import { v4 as uuid } from "uuid";
import ReadingInsightAccordionItem from "./ReadingInsightsAccordionItem";

const ReadingInsightAccordion = ({ readingSessions }) => {
  // const [readingSession, setFirstReadingSession] = useState(null);
  // const [restOfReadingSessions, setRestOfReadingSessions] = useState(null);
  return (
    <Accordion collapsible>
      {readingSessions !== null &&
        readingSessions.map((readingSession) => (
          <ReadingInsightAccordionItem
            key={uuid() + readingSession.session_id}
            readingSession={readingSession}
          />
        ))}
    </Accordion>
  );
};
export default ReadingInsightAccordion;
