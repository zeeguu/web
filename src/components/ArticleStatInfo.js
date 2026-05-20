import * as s from "./ArticleStatInfo.sc";
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
  color: '#555',
  textDecoration: 'underline',
};

export default function ArticleStatInfo({ articleInfo }) {
  // Backend marks any AI-simplified article via is_simplified; parent_url
  // is only set when the original article is linkable (some simplifications
  // are produced from uploads and have no parent to point back to).
  const isSimplified = !!articleInfo.is_simplified || !!articleInfo.parent_url;
  const hasOriginalLink = !!articleInfo.parent_url;
  const originalDomain = hasOriginalLink ? getDomainName(articleInfo.parent_url) : null;

  // Teacher-only CEFR assessment details — kept so the dashboard surface
  // can still debug classifier output. User-facing CEFR level is suppressed
  // (see feedback_cefr_data_unreliable: classifier collapses too often for
  // the level alone to be trustworthy).
  const assessments = articleInfo.cefr_assessments;
  const hasAssessments = assessments && (assessments.llm?.level || assessments.ml?.level);

  return (
    <s.StatContainer>
      <s.Difficulty style={{ flexWrap: 'wrap' }}>
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
