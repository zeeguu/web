import { MetaStrip, MetaItem, MetaLink, MetaTag } from "./MetaStrip.sc";
import getDomainName from "../utils/misc/getDomainName";
import { isSimplifiedArticle } from "../utils/misc/articleHelpers";

export default function ArticleStatInfo({ articleInfo }) {
  const isSimplified = isSimplifiedArticle(articleInfo);
  const sourceUrl = articleInfo.parent_url || articleInfo.url;
  const sourceDomain = sourceUrl ? getDomainName(sourceUrl) : null;

  // The *target* level the article was simplified to (reliable, unlike the
  // suppressed effective CEFR level). Only sent by the API for simplified
  // articles; may be absent for older ones, so the tag degrades to "Simplified".
  const targetLevel = articleInfo.target_cefr_level;

  // User-facing CEFR level is suppressed (see feedback_cefr_data_unreliable);
  // teacher-only assessments still surface for classifier debugging.
  const assessments = articleInfo.cefr_assessments;
  const hasAssessments = assessments && (assessments.llm?.level || assessments.ml?.level);

  return (
    <MetaStrip>
      {isSimplified && (
        <MetaTag>{targetLevel ? `Simplified to ${targetLevel}` : "Simplified"}</MetaTag>
      )}
      {sourceDomain && (
        <MetaItem>
          {/* Label the source link so the bare domain reads as metadata rather
              than a stray link. "Original:" for simplified articles (the text on
              screen is adapted; the real thing is here); "Source:" otherwise
              (the domain IS what they're reading, so "Original" would misread). */}
          {isSimplified ? <>Original:&nbsp;</> : <>Source:&nbsp;</>}
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
