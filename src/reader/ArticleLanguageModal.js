import ChoiceModal from "../components/modal_shared/ChoiceModal";
import { LANGUAGE_CODE_TO_NAME } from "../utils/misc/languageCodeToName";

function langName(code) {
  return LANGUAGE_CODE_TO_NAME[code] || code;
}

export default function ArticleLanguageModal({
  articleTitle,
  articleLanguage,
  articleImage,
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
        heroImage={articleImage}
        message="Do you want it simplified to your level?"
        primaryLabel="Simplify"
        secondaryLabel="Read as is"
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
      heroImage={articleImage}
      message={`This article is in ${articleLangName}. Do you want it translated to ${langName(learnedLanguage)} at your level?`}
      primaryLabel="Translate"
      secondaryLabel="Read original"
      loadingLabel="Translating..."
      onPrimary={onTranslateAndAdapt}
      onSecondary={onReadOriginal}
      isLoading={isLoading}
      primaryFirst={source === "share"}
    />
  );
}
