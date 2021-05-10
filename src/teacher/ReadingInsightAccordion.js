import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import "@reach/accordion/styles.css";
import { MdExpandLess, MdExpandMore } from "react-icons/md/";
import { StudentActivityDataCircle } from "./StudentActivityDataCircle.sc";
import { StudentActivityDataCircleWrapper } from "./StudentActivityDataCircleWrapper.sc";
import * as s from "./ReadingInsightAccordion.sc";

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
              <StudentActivityDataCircleWrapper>
                <StudentActivityDataCircle>{length}</StudentActivityDataCircle>
                <StudentActivityDataCircle>
                  {difficulty}
                </StudentActivityDataCircle>
                <StudentActivityDataCircle>
                  {readingTime}
                </StudentActivityDataCircle>
                <StudentActivityDataCircle>
                  {translatedWordsList.length}
                </StudentActivityDataCircle>
              </StudentActivityDataCircleWrapper>
              <AccordionButton onClick={changeButton}>
                {showLessButton ? (
                  <>
                    <p style={{ width: "4.5em", fontWeight: "600" }}>
                      View more
                    </p>
                    <MdExpandMore
                      style={{
                        marginTop: "-.5em",
                        fontSize: "45px",
                        color: "#4492b3",
                      }}
                    />
                  </>
                ) : (
                    <div style={{ width: "4.5em"}}>
                    <p style={{ width: "4.3em", fontWeight: "600" }}>
                      View less
                    </p>
                    <MdExpandLess
                      style={{
                        marginTop: "-.5em",
                        fontSize: "45px",
                        color: "#4492b3",
                      }}
                    />
                  </div>
                )}
              </AccordionButton>
            </div>
            <AccordionPanel
              style={{
                minWidth: "300px",
                maxWidth: "90%",
                marginLeft: "2%",
                marginTop: "1vh",
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
                borderRadius: "10px",
                padding: "1em",
              }}
            >
              <h2 style={{ color: "#4492b3" }}>
                Translated words in the context of their sencences
              </h2>
              {translatedWordsList.map((word) => (
                <p>{word}</p>
              ))}
              {translatedWordsList.length == 0 && (
                <p style={{ textAlign: "center" }}>
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
