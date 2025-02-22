import React, { useState } from "react";
import strings from "../../../i18n/definitions";
import * as s from "../../styledComponents/ReadingInsightAccordion.sc";
import ViewMoreLessButton from "./ViewMoreLessButton";
import StudentActivityDataCircleWrapper from "../cohortsPage/StudentActivityDataCircleWrapper";
import { longFormattedDate } from "../../sharedComponents/FormattedDate";

const ReadingSessionCard = ({ readingSession, isFirst, isOpen }) => {
  const [translationCount] = useState(readingSession.translations.length);
  const maxTitleCharSize = 100;

  return (
    <s.ReadingInsightAccordion isFirst={isFirst}>
      <div className="content-wrapper">
        <div className="date-title-wrapper">
          <div className="left-line">
            <h2 className="article-title">
              {readingSession.title.substring(0, maxTitleCharSize)}
              {readingSession.title.length > maxTitleCharSize && "..."}
            </h2>
            <p className="date">
              {strings.readingDate}{" "}
              {longFormattedDate(readingSession.start_time)}
            </p>
          </div>
        </div>
        <div className="data-circle-wrapper">
          <StudentActivityDataCircleWrapper
            className="data-circles"
            length={readingSession.word_count}
            difficulty={readingSession.difficulty / 10}
            readingTime={readingSession.duration_in_sec}
            translatedWords={translationCount}
            isFirst={isFirst}
          />
          <ViewMoreLessButton
            isFirst={isFirst}
            sessionID={readingSession.session_id}
            isOpen={isOpen}
          />
        </div>
      </div>
    </s.ReadingInsightAccordion>
  );
};
export default ReadingSessionCard;
