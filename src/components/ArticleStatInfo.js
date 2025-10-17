import * as s from "./ArticleStatInfo.sc";
import { getStaticPath } from "../utils/misc/staticPath";
import { estimateReadingTime } from "../utils/misc/readableTime";
import { getHighestCefrLevel } from "../utils/misc/cefrHelpers";

export default function ArticleStatInfo({ articleInfo }) {
  const cefr_level = articleInfo.metrics?.cefr_level || articleInfo.cefr_level || 'B1';
  const word_count = articleInfo.metrics?.word_count || articleInfo.word_count || 0;

  // Check if we have CEFR assessment details (for teachers)
  const assessments = articleInfo.cefr_assessments;
  const hasAssessments = assessments && (assessments.llm?.level || assessments.ml?.level);
  const displayCefr = assessments?.display_cefr || cefr_level;

  const iconLevel = getHighestCefrLevel(displayCefr);

  return (
    <s.StatContainer>
      <s.Difficulty>
        <img
          src={getStaticPath("icons", iconLevel + "-level-icon.png")}
          alt="difficulty icon"
        ></img>
        <span style={{ fontWeight: 'bold' }}>{displayCefr}</span>
        {hasAssessments && (
          <span style={{ marginLeft: '0.5rem', fontSize: '0.85em', color: '#666' }}>
            {assessments.llm?.level && (
              <span>
                <span style={{ color: '#888' }}>LLM:</span>{' '}
                <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{assessments.llm.level}</span>
              </span>
            )}
            {assessments.llm?.level && assessments.ml?.level && <span style={{ margin: '0 0.25rem' }}>|</span>}
            {assessments.ml?.level && (
              <span>
                <span style={{ color: '#888' }}>ML-1:</span>{' '}
                <span style={{ fontWeight: 'bold', color: '#16a34a' }}>{assessments.ml.level}</span>
              </span>
            )}
            {assessments.teacher?.level && (
              <span style={{ marginLeft: '0.25rem', fontSize: '0.9em', color: '#999', fontStyle: 'italic' }}>
                (override)
              </span>
            )}
          </span>
        )}
      </s.Difficulty>
      <s.ReadingTimeContainer>
        <img
          src={getStaticPath("icons", "read-time-icon.png")}
          alt="read time icon"
        ></img>
        <span>~ {estimateReadingTime(word_count)}</span>
      </s.ReadingTimeContainer>
    </s.StatContainer>
  );
}
