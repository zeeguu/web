import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import * as s from "./ReadingInsightAccordion.sc";
import ViewMoreLessButton from "./ViewMoreLessButton";
import StudentActivityDataCircles from "./StudentActivityDataCircles";

const ReadingInsightAccordion = ({
  title,
  length,
  difficulty,
  readingTime,
  translatedWordsList,
}) => {
  const [showLessButton, setShowLessButton] = useState(false);
  const changeButton = () => {
    setShowLessButton(!showLessButton);
  };
  return (
    <s.ReadingInsightAccordion>
      <div className="accordion-wrapper">
        <Accordion collapsible>
          <AccordionItem>
            <div className="content-wrapper">
              <h2 className="article-title">{title}</h2>
              <StudentActivityDataCircles
                length={length}
                difficulty={difficulty}
                readingTime={readingTime}
                translatedWords={translatedWordsList.length}
              />
              <AccordionButton onClick={changeButton}>
                <ViewMoreLessButton showLessButton={showLessButton} />
              </AccordionButton>
            </div>
            <AccordionPanel className="panel">
              <h2 className="panel-headline">
                Translated words in the context of their sencences
              </h2>
              {translatedWordsList.map((word) => (
                <p>{word}</p>
              ))}
              {translatedWordsList.length == 0 && (
                <p className="panel-no-words">
                  No words were translated in this reading session.
                </p>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </s.ReadingInsightAccordion>
  );
};
export default ReadingInsightAccordion;
