import * as s from "./ArticleStatInfo.sc";
import { getStaticPath } from "../utils/misc/staticPath";
import { estimateReadingTime } from "../utils/misc/readableTime";

export default function ArticleStatInfo({ articleInfo }) {
  let cefr_level = articleInfo.metrics.cefr_level;
  return (
    <s.StatContainer>
      <s.Difficulty>
        <img
          src={getStaticPath("icons", cefr_level + "-level-icon.png")}
          alt="difficulty icon"
        ></img>
        <span>{cefr_level}</span>
      </s.Difficulty>
      <s.ReadingTimeContainer>
        <img
          src={getStaticPath("icons", "read-time-icon.png")}
          alt="read time icon"
        ></img>
        <span>~ {estimateReadingTime(articleInfo.metrics.word_count)}</span>
      </s.ReadingTimeContainer>
    </s.StatContainer>
  );
}
