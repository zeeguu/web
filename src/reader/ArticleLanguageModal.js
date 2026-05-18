import ChoiceModal from "../components/modal_shared/ChoiceModal";
import { LANGUAGE_CODE_TO_NAME } from "../utils/misc/languageCodeToName";
import { CEFR_ORDINAL } from "../utils/misc/cefrHelpers";

function langName(code) {
  return LANGUAGE_CODE_TO_NAME[code] || code;
}

const CEFR_BAR_COUNT = 4;
const CEFR_BAR_GEOMETRY = [
  { x: 1, y: 12, h: 3 },
  { x: 5, y: 9, h: 6 },
  { x: 9, y: 6, h: 9 },
  { x: 13, y: 3, h: 12 },
];

function LevelBars({ level }) {
  const filled = Math.min(CEFR_ORDINAL[level] ?? CEFR_BAR_COUNT, CEFR_BAR_COUNT);
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      style={{ color: "var(--cefr-bar-color)" }}
      fill="currentColor"
      aria-hidden="true"
    >
      {CEFR_BAR_GEOMETRY.map((bar, i) => (
        <rect
          key={i}
          x={bar.x - 0.25}
          y={bar.y}
          width={2.5}
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
    let message;
    if (canShowTransition) {
      message = (
        <>
          <div style={{ marginBottom: "0.9em" }}>Article is above your level</div>
          <LevelTransition articleLevel={articleCefrLevel} userLevel={userCefrLevel} />
          <div style={{ marginTop: "1.1em" }}>
            Do you want to adapt it before saving?
          </div>
        </>
      );
    } else if (articleCefrLevel) {
      message = `This article is${levelClause}. Do you want to adapt it before saving?`;
    } else {
      message = "Do you want to adapt it before saving?";
    }
    return (
      <ChoiceModal
        title={articleTitle}
        heroImage={articleImage}
        slimHero
        message={message}
        primaryLabel="Adapt and save"
        secondaryLabel="or save original"
        secondaryAsLink
        loadingLabel="Adapting..."
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
      message={`This article is in ${articleLangName}${levelClause}. Do you want it translated to ${langName(learnedLanguage)} at your level before saving?`}
      primaryLabel="Translate and save"
      secondaryLabel="Save original"
      loadingLabel="Translating..."
      onPrimary={onTranslateAndAdapt}
      onSecondary={onReadOriginal}
      isLoading={isLoading}
      primaryFirst={source === "share"}
    />
  );
}
