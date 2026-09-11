import { useContext } from "react";
import { useHistory } from "react-router-dom";

import { SystemLanguagesContext } from "../contexts/SystemLanguagesContext";
import { UserContext } from "../contexts/UserContext";
import { varietyFieldValue } from "../utils/misc/languageVariety";
import strings from "../i18n/definitions";
import EmptyState from "../components/EmptyState";
import { StyledButton } from "../components/allButtons.sc";

/**
 * Why the feed is empty when a learner has asked for one country's sources.
 *
 * A variety preference is a filter, so it can legitimately leave nothing to
 * show -- a thinly supplied language, a narrow set of topics, a quiet day. The
 * emptiness is then the setting working, which is exactly why it has to say so:
 * an unexplained blank page reads as a broken app.
 *
 * It does not offer to widen the filter here. The preference lives in Language
 * Settings and belongs in one place; a second control that silently disagrees
 * with the first is how a setting stops meaning anything.
 *
 * Renders nothing when there is no preference -- then an empty feed is the
 * ordinary kind, and ShowLinkRecommendationsIfNoArticles speaks to it.
 */
export default function NoArticlesForVariety({ articleList }) {
  const history = useHistory();
  const { userDetails } = useContext(UserContext);
  const { sortedSystemLanguages } = useContext(SystemLanguagesContext);

  const learnedLanguage = userDetails?.learned_language;
  const variety = varietyFieldValue(userDetails, learnedLanguage);

  if (articleList.length > 0 || !variety) return null;

  const varietyName = (sortedSystemLanguages?.varieties?.[learnedLanguage] || []).find(
    (each) => each.country === variety,
  )?.name;

  return (
    <EmptyState
      title={strings.nothingHereRightNow}
      // Named, because "nothing matches your filter" invites the question the
      // name already answers: which filter?
      message={strings.formatString(strings.noArticlesForVariety, varietyName || variety)}
    >
      <StyledButton $secondary onClick={() => history.push("/account_settings/language_settings")}>
        {strings.goToLanguageSettings}
      </StyledButton>
    </EmptyState>
  );
}
