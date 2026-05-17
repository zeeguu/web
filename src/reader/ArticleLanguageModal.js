import ChoiceModal from "../components/modal_shared/ChoiceModal";
import { LANGUAGE_CODE_TO_NAME } from "../utils/misc/languageCodeToName";
import { getStaticPath } from "../utils/misc/staticPath";

function langName(code) {
  return LANGUAGE_CODE_TO_NAME[code] || code;
}

function LevelChip({ level }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35em",
        padding: "0.3em 0.85em",
        borderRadius: "999px",
        border: "1px solid var(--text-secondary)",
        fontSize: "0.95rem",
        fontWeight: 600,
      }}
    >
      <img
        src={getStaticPath("icons", `${level}-level-icon.png`)}
        alt=""
        style={{ width: "16px", height: "16px" }}
      />
      {level}
    </span>
  );
}

function LevelTransition({ from, to }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.7em",
        marginBottom: "0.6em",
      }}
    >
      <LevelChip level={from} />
      <span style={{ fontSize: "1.4rem", color: "var(--text-secondary)" }}>→</span>
      <LevelChip level={to} />
    </div>
  );
}

export default function ArticleLanguageModal({
  articleTitle,
  articleLanguage,
  articleCefrLevel,
  articleImage,
  learnedLanguage,
  userCefrLevel,
  source,
  onTranslateAndAdapt,
  onSimplify,
  onReadOriginal,
  onReadAsIs,
  isLoading,
}) {
  const isSameLanguage = articleLanguage === learnedLanguage;
  const articleLangName = langName(articleLanguage);
  const levelClause = articleCefrLevel ? ` at ${articleCefrLevel} level` : "";

  if (isSameLanguage) {
    const canShowTransition = articleCefrLevel && userCefrLevel;
    const message = canShowTransition ? (
      <>
        <LevelTransition from={articleCefrLevel} to={userCefrLevel} />
        <div style={{ color: "var(--text-secondary)" }}>Make this fit your level</div>
      </>
    ) : articleCefrLevel ? (
      `This article is${levelClause}. Do you want it simplified to your level?`
    ) : (
      "Do you want it simplified to your level?"
    );
    const simplifyLabel = userCefrLevel ? `Simplify to ${userCefrLevel}` : "Simplify";
    return (
      <ChoiceModal
        title={articleTitle}
        heroImage={articleImage}
        message={message}
        primaryLabel={simplifyLabel}
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
      message={`This article is in ${articleLangName}${levelClause}. Do you want it translated to ${langName(learnedLanguage)} at your level?`}
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
