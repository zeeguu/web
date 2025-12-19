import * as s from "./ArticleStatInfo.sc";
import { getStaticPath } from "../utils/misc/staticPath";
import { getHighestCefrLevel } from "../utils/misc/cefrHelpers";
import getDomainName from "../utils/misc/getDomainName";

export default function ArticleStatInfo({ articleInfo }) {
  const cefr_level = articleInfo.metrics?.cefr_level || articleInfo.cefr_level || 'B1';

  // Check if this is a simplified article
  const isSimplified = !!articleInfo.parent_url;
  const originalDomain = isSimplified ? getDomainName(articleInfo.parent_url) : null;
  const originalCefr = articleInfo.parent_cefr_level;

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
        {isSimplified && (
          <span style={{ color: '#666' }}>
            {' · simplified from '}
            <a
              href={articleInfo.parent_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0066cc' }}
            >
              {originalCefr ? `${originalCefr} original` : 'original'}
            </a>
            {` on ${originalDomain}`}
          </span>
        )}
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
    </s.StatContainer>
  );
}
