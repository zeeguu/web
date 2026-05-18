import * as s from "./ArticleStatInfo.sc";
import { getStaticPath } from "../utils/misc/staticPath";
import { getHighestCefrLevel } from "../utils/misc/cefrHelpers";
import getDomainName from "../utils/misc/getDomainName";

const simplifiedPillStyle = {
  fontSize: '0.75rem',
  fontWeight: 500,
  color: '#666',
  background: 'var(--infobox-bg, #f3f3f3)',
  padding: '0.1em 0.55em',
  borderRadius: '999px',
  letterSpacing: '0.02em',
};

const originalLinkWrapStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35em',
  fontSize: '0.9rem',
  color: '#666',
};

const originalLinkStyle = {
  color: '#0066cc',
  textDecoration: 'none',
};

export default function ArticleStatInfo({ articleInfo }) {
  const cefr_level = articleInfo.metrics?.cefr_level || articleInfo.cefr_level || 'B1';

  // Backend marks any AI-simplified article via is_simplified; parent_url
  // is only set when the original article is linkable (some simplifications
  // are produced from uploads and have no parent to point back to).
  const isSimplified = !!articleInfo.is_simplified || !!articleInfo.parent_url;
  const hasOriginalLink = !!articleInfo.parent_url;
  const originalDomain = hasOriginalLink ? getDomainName(articleInfo.parent_url) : null;
  const originalCefr = articleInfo.parent_cefr_level;

  // Check if we have CEFR assessment details (for teachers)
  const assessments = articleInfo.cefr_assessments;
  const hasAssessments = assessments && (assessments.llm?.level || assessments.ml?.level);
  const displayCefr = assessments?.display_cefr || cefr_level;

  const iconLevel = getHighestCefrLevel(displayCefr);

  return (
    <s.StatContainer>
      <s.Difficulty style={{ flexWrap: 'wrap' }}>
        <img
          src={getStaticPath("icons", iconLevel + "-level-icon.png")}
          alt="difficulty icon"
        ></img>
        <span style={{ fontWeight: 'bold' }}>{displayCefr}</span>
        {isSimplified && (
          <>
            <span style={simplifiedPillStyle}>simplified</span>
            {hasOriginalLink && (
              <span style={originalLinkWrapStyle}>
                <span aria-hidden="true" style={{ color: '#bbb' }}>·</span>
                Original:
                <a
                  href={articleInfo.parent_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={originalLinkStyle}
                >
                  {originalDomain}
                  {originalCefr ? ` (${originalCefr})` : ''}
                  <span aria-hidden="true" style={{ marginLeft: '0.2em' }}>↗</span>
                </a>
              </span>
            )}
          </>
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
