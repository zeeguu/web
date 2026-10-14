import { Link } from "react-router-dom";
import { MetaStrip, MetaItem } from "../../../components/MetaStrip.sc";
import { StyledButton } from "../../styledComponents/TeacherButtons.sc";
import { estimateReadingTime, timeAgo } from "../../../utils/misc/readableTime";
import { effectiveCefrLevel } from "../../../utils/misc/articleDifficulty";
import { classReadingSummary } from "./classTextLines";
import * as s from "./ClassTexts.sc";

/**
 * One text in the class Texts tab: how the class read it, not what it says.
 * The teacher chose or wrote the text, so a preview of its first lines told
 * them nothing; who read it and which words they needed is what they come for.
 */
export default function ClassTextCard({ article, cohortID, studentCount }) {
  const detailPath = `/teacher/classes/viewClass/${cohortID}/texts/${article.id}`;
  // Absent from an API older than the web (cohort_text_overview, Oct 2026).
  const reading = article.class_reading && classReadingSummary(article.class_reading, studentCount);
  const level = effectiveCefrLevel(article.cefr_assessments);
  const wordCount = article.metrics?.word_count;

  return (
    <s.TextCard>
      <s.TextName>
        <Link to={detailPath}>{article.title}</Link>
      </s.TextName>
      <MetaStrip>
        {article.published && <MetaItem>Added {timeAgo(article.published)}</MetaItem>}
        {level && <MetaItem>{level}</MetaItem>}
        {wordCount > 0 && <MetaItem>{estimateReadingTime(wordCount).replace(/ minutes?/, " min")}</MetaItem>}
      </MetaStrip>

      {reading && (
        <>
          <s.ReadShare aria-hidden="true">
            <span style={{ width: `${Math.round(reading.share * 100)}%` }} />
          </s.ReadShare>
          <s.ReadingLine>{reading.line}</s.ReadingLine>
        </>
      )}
      {reading?.topWords && (
        <s.TopWords>
          Most looked up: <em>{reading.topWords}</em>
        </s.TopWords>
      )}

      <Link to={detailPath}>
        <StyledButton $secondary>Details</StyledButton>
      </Link>
    </s.TextCard>
  );
}
