import { MetaStrip, MetaItem, MetaLink, MetaTag } from "./MetaStrip.sc";
import getDomainName from "../utils/misc/getDomainName";
import { isSimplifiedArticle } from "../utils/misc/articleHelpers";
import { effectiveCefrLevel } from "../utils/misc/articleDifficulty";
import { CEFR_ORDINAL } from "../utils/misc/cefrScale";
import DynamicFlagImage from "./DynamicFlagImage";

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

  // The original's level, shown ON the "Original:" link rather than trailing the
  // AI tag as "from B2": it describes the text at the far end of that link, not
  // the one being read. Only rendered when strictly above the target -- the
  // classifier collapses to A1 often enough that a parent recorded at (or below)
  // the target is a real outcome, and "Original A1: dr.dk" under an A1 article
  // reads as a bug rather than as information (see feedback_cefr_data_unreliable).
  const parentLevel = articleInfo.parent_cefr_level;
  const showsDrop =
    parentLevel &&
    targetLevel &&
    CEFR_ORDINAL[parentLevel] > CEFR_ORDINAL[targetLevel];

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
  // Named as AI work: the adaptation is model output, and Art. 50(4) asks that
  // artificially generated text say so. Matches the card tag (aiProvenanceLabel).
  const adaptVerb = isTranslated ? "AI-translated & simplified" : "AI-simplified";

  // Opened from a friend's share (SharedArticleRow → router state): credit the
  // *share* separately from authorship.
  const sharedByName = shareContext?.sharedByName;

  // Name the level the text was written to, never "your level" — the reader can
  // change their CEFR setting, and from then on "your level" points at the new
  // one while the text still sits at the old. The letter stays true; the
  // possessive goes stale.
  const levelText = targetLevel ? `${adaptVerb} to ${targetLevel}` : adaptVerb;

  let levelTag = null;
  if (sharedByName) {
    // Two tags, not one: the adaptation is the model's and the share is the
    // friend's. "AI-simplified by Anna" would credit one for the other.
    levelTag = (
      <>
        <MetaTag>{levelText}</MetaTag>
        <MetaTag>{`shared by ${sharedByName}`}</MetaTag>
      </>
    );
  } else if (isSimplified || isTranslated) {
    levelTag = <MetaTag>{levelText}</MetaTag>;
  }

  // Source-link label: "Original B2:" for an adapted copy, "Source:" for a plain
  // article. The origin's CEFR level joins the word it qualifies, so the strip
  // reads as a level you are leaving for a level you are at. Shares used to say
  // "See original at" -- unnecessary now that the credit is its own tag, and it
  // had nowhere to hang the level.
  const originLevel = showsDrop ? ` ${parentLevel}` : "";
  const isAdapted = isSimplified || isTranslated || sharedByName;
  const sourcePrefix = isAdapted ? <>Original{originLevel}:&nbsp;</> : <>Source:&nbsp;</>;

  // A translated copy's original is in a language the reader may not have been
  // expecting behind that link. The flag says which in no words at all; the
  // code is only sent when the origin's language actually differs (article.py
  // -> parent_language), so this never renders a redundant same-language flag.
  const originLanguage = articleInfo.parent_language;

  return (
    <MetaStrip>
      {levelTag}
      {sourceDomain && (
        <MetaItem>
          {sourcePrefix}
          {originLanguage && (
            <DynamicFlagImage
              languageCode={originLanguage}
              size={"0.9rem"}
              style={{ marginRight: "0.3em" }}
            />
          )}
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
