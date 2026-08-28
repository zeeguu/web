import { MetaStrip, MetaItem, MetaLink, MetaTag } from "./MetaStrip.sc";
import getDomainName from "../utils/misc/getDomainName";
import { isSimplifiedArticle } from "../utils/misc/articleHelpers";
import { effectiveCefrLevel } from "../utils/misc/articleDifficulty";

// `children` are extra MetaItems appended to the same strip -- the teacher's
// texts list adds language and word count there. Passing them in rather than
// building a second strip keeps MetaStrip's "·" separators doing their job.
export default function ArticleStatInfo({ articleInfo, shareContext, children }) {
  const isSimplified = isSimplifiedArticle(articleInfo);
  const sourceUrl = articleInfo.parent_url || articleInfo.url;
  const sourceDomain = sourceUrl ? getDomainName(sourceUrl) : null;

  // The *target* level the article was simplified to (reliable, unlike the
  // suppressed effective CEFR level). Only sent by the API for simplified
  // articles; may be absent for older ones, so the tag degrades to "Simplified".
  const targetLevel = articleInfo.target_cefr_level;

  // User-facing CEFR level is suppressed (see feedback_cefr_data_unreliable);
  // teachers still get one. It is the level the server computed and stored
  // (ArticleCefrAssessment.update_effective_cefr_level), which is also what the
  // article editor shows under "Automatically assessed difficulty" -- the two
  // screens must never print different numbers for the same text.
  const teacherLevel = effectiveCefrLevel(articleInfo.cefr_assessments);
  const isTeacherSet = Boolean(articleInfo.cefr_assessments?.teacher?.level);

  // Cross-language derivatives are translated AND adapted to a level; same-
  // language ones are just simplified. The verb comes from the article's own
  // flags — correct for the user's own translated copies, not only shares.
  const isTranslated = articleInfo.is_translated;
  const adaptVerb = isTranslated ? "Translated & simplified" : "Simplified";

  // Opened from a friend's share (SharedArticleRow → router state): credit the
  // *share*, not authorship, and drop the CEFR letter ("to your level").
  const sharedByName = shareContext?.sharedByName;

  let levelTag = null;
  if (sharedByName) {
    levelTag = <MetaTag>{`${adaptVerb} by ${sharedByName} to your level`}</MetaTag>;
  } else if (isSimplified || isTranslated) {
    levelTag = <MetaTag>{targetLevel ? `${adaptVerb} to ${targetLevel}` : adaptVerb}</MetaTag>;
  }

  // Source-link label: "See original at" for a share, "Original:" for an
  // adapted copy (simplified or translated), "Source:" for a plain article.
  let sourcePrefix = <>Source:&nbsp;</>;
  if (sharedByName) sourcePrefix = <>See original at&nbsp;</>;
  else if (isSimplified || isTranslated) sourcePrefix = <>Original:&nbsp;</>;

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
      {teacherLevel && (
        <MetaItem>
          Difficulty:&nbsp;<b>{teacherLevel}</b>
          {isTeacherSet && <>&nbsp;(set by you)</>}
        </MetaItem>
      )}
      {children}
    </MetaStrip>
  );
}
