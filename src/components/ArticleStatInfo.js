import { MetaStrip, MetaItem, MetaLink, MetaTag } from "./MetaStrip.sc";
import getDomainName from "../utils/misc/getDomainName";
import { isSimplifiedArticle } from "../utils/misc/articleHelpers";

export default function ArticleStatInfo({ articleInfo, shareContext }) {
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

  // Opened from a friend's share (SharedArticleRow → router state): credit the
  // *share*, not authorship, and drop the CEFR letter ("to your level"). Verb
  // flexes same- vs cross-language.
  const sharedByName = shareContext?.sharedByName;
  const sharedVerb = shareContext?.sharedTranslated ? "Translated & simplified" : "Simplified";

  let levelTag = null;
  if (sharedByName) {
    levelTag = <MetaTag>{`${sharedVerb} by ${sharedByName} to your level`}</MetaTag>;
  } else if (isSimplified) {
    levelTag = <MetaTag>{targetLevel ? `Simplified to ${targetLevel}` : "Simplified"}</MetaTag>;
  }

  // Source-link label: "See original at" for a share, "Original:" for the
  // user's own simplified copy, "Source:" for a plain article.
  let sourcePrefix = <>Source:&nbsp;</>;
  if (sharedByName) sourcePrefix = <>See original at&nbsp;</>;
  else if (isSimplified) sourcePrefix = <>Original:&nbsp;</>;

  return (
    <MetaStrip>
      {levelTag}
      {sourceDomain && (
        <MetaItem>
          {sourcePrefix}
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
