import * as s from "./ReadingInsightHeader.sc"

const ReadingInsightHeader = () => {
    //TODO EVERYTHING HERE SHOULD BE LOCALIZED (STRINGS)!!!
  return (
    <s.ReadingInsightHeader>
    <div className="reading-insight-wrapper">
      <p className="title">
        <br />
        Title STRINGS
      </p>
      <div className="circle-wrapper">
        <p className="circle" id="text-level">
          Text level
        </p>
        <p className="circle" id="text-length">
          Text length
        </p>
        <p className="circle" id="reading-time">
          Reading time
        </p>
        <p className="circle" id="translated-words">
          Translated words
        </p>
      </div>
    </div>
    </s.ReadingInsightHeader>
  );
};
export default ReadingInsightHeader
