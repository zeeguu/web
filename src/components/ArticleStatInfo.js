import { MetaStrip, MetaItem, MetaLink, MetaTag } from "./MetaStrip.sc";
import getDomainName from "../utils/misc/getDomainName";
import { isSimplifiedArticle } from "../utils/misc/articleHelpers";

export default function ArticleStatInfo({ articleInfo }) {
  const isSimplified = isSimplifiedArticle(articleInfo);
  const sourceUrl = articleInfo.parent_url || articleInfo.url;
  const sourceDomain = sourceUrl ? getDomainName(sourceUrl) : null;

  // User-facing CEFR level is suppressed (see feedback_cefr_data_unreliable);
  // teacher-only assessments still surface for classifier debugging.
  const assessments = articleInfo.cefr_assessments;
  const hasAssessments = assessments && (assessments.llm?.level || assessments.ml?.level);

  return (
    <MetaStrip>
      {isSimplified && <MetaTag>Simplified</MetaTag>}
      {sourceDomain && (
        <MetaItem>
          {/* "Original:" prefix only when the user is reading a simplified
              version — without it the link reads as the source of the text
              on screen, which would mislead. For non-simplified articles
              the domain IS what they're reading. */}
          {isSimplified && <>Original:&nbsp;</>}
          <MetaLink href={sourceUrl} target="_blank" rel="noopener noreferrer">
            {sourceDomain}
            <span aria-hidden="true" style={{ marginLeft: '0.2em' }}>↗</span>
          </MetaLink>
        </MetaItem>
      )}
      {hasAssessments && (
        <MetaItem>
          {assessments.llm?.level && (
            <span>
              <span style={{ color: '#888' }}>LLM:</span>{' '}
              <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{assessments.llm.level}</span>
            </span>
          )}
          {assessments.llm?.level && assessments.ml?.level && (
            <span style={{ margin: '0 0.25rem' }}>|</span>
          )}
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
        </MetaItem>
      )}
    </MetaStrip>
  );
}
