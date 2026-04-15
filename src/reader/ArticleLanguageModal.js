import ChoiceModal from "../components/modal_shared/ChoiceModal";
import { LANGUAGE_CODE_TO_NAME } from "../utils/misc/languageCodeToName";

function langName(code) {
  return LANGUAGE_CODE_TO_NAME[code] || code;
}

export default function ArticleLanguageModal({
  articleTitle,
  articleLanguage,
  learnedLanguage,
  source,
  onTranslateAndAdapt,
  onSimplify,
  onReadOriginal,
  onReadAsIs,
  isLoading,
}) {
  const isSameLanguage = articleLanguage === learnedLanguage;
  const articleLangName = langName(articleLanguage);

  if (isSameLanguage) {
    return (
      <ChoiceModal
        title={articleTitle}
        message={`This article is in ${articleLangName}. Do you want it simplified?`}
        primaryLabel="Simplify to my level"
        secondaryLabel="Read without simplification"
        loadingLabel="Simplifying..."
        onPrimary={onSimplify}
        onSecondary={onReadAsIs}
        isLoading={isLoading}
        primaryFirst={source === "share"}
      />
    );
  }

  return (
    <ChoiceModal
      title={articleTitle}
      message={`This article is in ${articleLangName}. You're learning ${langName(learnedLanguage)}.`}
      primaryLabel={`Translate & adapt to ${langName(learnedLanguage)} at my level`}
      secondaryLabel="Read original"
      loadingLabel="Translating..."
      onPrimary={onTranslateAndAdapt}
      onSecondary={onReadOriginal}
      isLoading={isLoading}
      primaryFirst={source === "share"}
    />
  );
}
