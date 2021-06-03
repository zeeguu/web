import strings from "../i18n/definitions";
import * as s from "./ReadingInsightHeader.sc";

const ReadingInsightHeader = () => {
  return (
    <s.ReadingInsightHeader>
      <div className="reading-insight-wrapper">
        <p className="title">
          <br />
          {strings.title}
        </p>
        <div className="circle-wrapper">
          <p className="circle" id="text-level">
            {strings.textLevel}
          </p>
          <p className="circle" id="text-length">
            {strings.textLength}
          </p>
          <p className="circle" id="reading-time">
            {strings.readingTime}
          </p>
          <p className="circle" id="translated-words">
            {strings.translatedWords}
          </p>
        </div>
      </div>
    </s.ReadingInsightHeader>
  );
};
export default ReadingInsightHeader;
