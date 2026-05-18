import ChoiceModal from "../components/modal_shared/ChoiceModal";
import { LANGUAGE_CODE_TO_NAME } from "../utils/misc/languageCodeToName";

function langName(code) {
  return LANGUAGE_CODE_TO_NAME[code] || code;
}

const CEFR_BARS_FILLED = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 4, C2: 4 };
const CEFR_BAR_GEOMETRY = [
  { x: 1, y: 12, h: 3 },
  { x: 5, y: 9, h: 6 },
  { x: 9, y: 6, h: 9 },
  { x: 13, y: 3, h: 12 },
];

function LevelBars({ level }) {
  const filled = CEFR_BARS_FILLED[level] ?? 4;
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      {CEFR_BAR_GEOMETRY.map((bar, i) => (
        <rect
          key={i}
          x={bar.x}
          y={bar.y}
          width={2}
          height={bar.h}
          rx={0.5}
          opacity={i < filled ? 1 : 0.3}
        />
      ))}
    </svg>
  );
}

function LevelChip({ level, caption }) {
  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.3em",
      }}
    >
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
        <LevelBars level={level} />
        {level}
      </span>
      <span
        style={{
          fontSize: "0.75rem",
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          fontWeight: 600,
        }}
      >
        {caption}
      </span>
    </span>
  );
}

function LevelTransition({ articleLevel, userLevel }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "0.9em",
      }}
    >
      <LevelChip level={articleLevel} caption="Article" />
      <span
        style={{
          fontSize: "1.4rem",
          color: "var(--text-secondary)",
          paddingTop: "0.15em",
        }}
      >
        →
      </span>
      <LevelChip level={userLevel} caption="You" />
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
        <div style={{ marginBottom: "0.9em" }}>Article is above your level</div>
        <LevelTransition articleLevel={articleCefrLevel} userLevel={userCefrLevel} />
      </>
    ) : articleCefrLevel ? (
      `This article is${levelClause}. Do you want it simplified to your level?`
    ) : (
      "Do you want it simplified to your level?"
    );
    const simplifyLabel = "Adapt to my level";
    return (
      <ChoiceModal
        title={articleTitle}
        heroImage={articleImage}
        slimHero
        message={message}
        primaryLabel={simplifyLabel}
        secondaryLabel="or read the original"
        secondaryAsLink
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
