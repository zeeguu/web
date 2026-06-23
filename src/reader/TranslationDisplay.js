import LinkOffIconButton from "../components/Icons/LinkOffIconButton";
import VisibilityOffIconButton from "../components/Icons/VisibilityOffIconButton";

export default function TranslationDisplay({
  translation,
  isTranslationVisible,
  word,
  showingAlterMenu,
  refToTranslation,
  toggleAlterMenu,
  unlinkLastWord,
  onTranslationVisibilityToggle,
}) {
  if (!translation || !(isTranslationVisible || word.isTranslationVisible)) {
    return null;
  }

  return (
    <z-tran chosen={translation} translation0={translation} ref={refToTranslation}>
      <span className="translationContainer">
        <span className="hide low-oppacity translation-icon">
          <VisibilityOffIconButton
            onClick={(e) => {
              e.stopPropagation();
              onTranslationVisibilityToggle();
            }}
          />
        </span>
        <span className="translation" onClick={(e) => toggleAlterMenu(e, word)}>
          {translation}
        </span>
        <span className="arrow" onClick={(e) => toggleAlterMenu(e, word)}>
          {showingAlterMenu ? "▲" : "▼"}
        </span>
        {word.mergedTokens.length > 1 && !word.mweExpression && (
          <span className="unlink low-oppacity translation-icon">
            <LinkOffIconButton
              onClick={(e) => {
                e.stopPropagation();
                unlinkLastWord(e, word);
              }}
            />
          </span>
        )}
      </span>
    </z-tran>
  );
}
