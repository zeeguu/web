import { useContext } from "react";
import { useHistory } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";
import { varietyFieldValue } from "../utils/misc/languageVariety";
import strings from "../i18n/definitions";
import EmptyState from "../components/EmptyState";
import { StyledButton } from "../components/allButtons.sc";
import { localisedCountryName } from "../components/LanguageVarietySelector";

/**
 * Why the feed is empty when a learner has asked for one country's sources.
 *
 * A variety preference is a filter, so it can legitimately leave nothing to
 * show -- a thinly supplied language, a narrow set of topics, a quiet day. The
 * emptiness is then the setting working, which is exactly why it has to say so:
 * an unexplained blank page reads as a broken app.
 *
 * It does not offer to widen the variety here. The preference lives in Language
 * Settings and belongs in one place; a second control that silently disagrees
 * with the first is how a setting stops meaning anything.
 *
 * When a topic is also selected, the country is no longer the only suspect, and
 * saying so matters more than picking one: a reader sent to Language Settings
 * over a narrow topic is sent to the wrong screen. The topic needs no button --
 * its pills are on this page, a tap away -- so it is named, and the button still
 * goes to the setting that is not visible from here.
 *
 * Renders nothing when there is no preference -- then an empty feed is the
 * ordinary kind, and ShowLinkRecommendationsIfNoArticles speaks to it.
 */
export default function NoArticlesForVariety({ articleList, isLoading, topicTitle }) {
  const history = useHistory();
  const { userDetails } = useContext(UserContext);

  const learnedLanguage = userDetails?.learned_language;
  const variety = varietyFieldValue(userDetails, learnedLanguage);

  // An empty list while the feed is still arriving is not an empty feed. Without
  // this, every visit opens with "your setting found nothing" for as long as the
  // request takes -- the exact misreading this message exists to prevent.
  if (isLoading || articleList.length > 0 || !variety) return null;

  // The catalogue's name ("Belgian Dutch") is English only, and this sentence is
  // translated -- so name the country the way the pills do, through Intl, which
  // speaks the reader's language.
  const countryName = localisedCountryName(variety);

  return (
    <EmptyState
      title={strings.nothingHereRightNow}
      // Named, because "nothing matches your filter" invites the question the
      // name already answers: which filter?
      message={
        topicTitle
          ? strings.formatString(strings.noArticlesForVarietyAndTopic, countryName, topicTitle)
          : strings.formatString(strings.noArticlesForVariety, countryName)
      }
    >
      <StyledButton $secondary onClick={() => history.push("/account_settings/language_settings")}>
        {strings.goToLanguageSettings}
      </StyledButton>
    </EmptyState>
  );
}
