import { useState, createElement, useMemo, useEffect } from "react";
import styled from "styled-components";
import TranslatableWord from "../../reader/TranslatableWord";
import * as s from "../../reader/TranslatableText.sc";
import { removePunctuation } from "../../utils/text/preprocessing";
import { orange600 } from "../../components/colors";

// Overrides the reading-view mwe-adjacent styling so the cloze bookmark
// renders in the same bright-bold orange as the pre-reveal
// renderHighlightedWord marker — otherwise the post-reveal chip styling
// drops to the pale `--mwe-adjacent-color` and looks like a step-down.
// Setting the CSS variable on a parent doesn't work because
// s.TranslatableText re-declares it, so override color/decoration-color
// directly. Also hides the chip's "hide translation" eye icon — not
// useful in an exercise where the translation is the point of the
// solution view.
const ExerciseTargetEmphasis = styled.div`
  /* Three bookmark-shape variants the rules cover:
     - Contiguous MWE → z-tag.mwe-adjacent
     - Separated MWE → z-tag[class*="mwe-color-"]
     - Single-word bookmark → plain z-tag with a z-tran child
     The :has(z-tran) selector catches the single-word case (and works
     as a safety net for any future shape). Triple-& bumps specificity
     above the reading-view !important defaults. */
  &&& z-tag.mwe-adjacent z-orig,
  &&& z-tag[class*="mwe-color-"] z-orig,
  &&& z-tag:has(z-tran) z-orig {
    color: ${orange600} !important;
    text-decoration-color: ${orange600} !important;
    font-weight: 700 !important;
  }
  /* Inner-span border-bottom is only needed for single-word bookmarks
     (which don't get a text-decoration underline on the outer z-orig).
     MWE-classified bookmarks already get a dotted underline on z-orig
     itself from TranslatableText.sc.js — adding the inner span border
     stacks two underlines (the "afslået" double-underline symptom). */
  &&& z-tag:has(z-tran):not(.mwe-adjacent):not([class*="mwe-color-"]) z-orig span {
    border-bottom: 2px dotted ${orange600} !important;
    font-weight: 700 !important;
  }
  /* Chip styling — applies to any chip rendered in the exercise
     context. pointer-events:none + hiding the hide-eye and ▼ keeps
     the chip a static study annotation. */
  &&& z-tag z-tran {
    pointer-events: none;
    font-size: 0.95em !important;
    animation: cloze-chip-reveal 280ms ease-out;
  }
  &&& z-tag z-tran .hide,
  &&& z-tag z-tran .arrow {
    display: none !important;
  }

  @keyframes cloze-chip-reveal {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/**
 * Renders translatable text with a "slot" for cloze exercises.
 *
 * The cloze bookmark itself is pre-loaded onto the underlying
 * InteractiveText via its `previousBookmarks` argument (same path
 * ArticleReader uses for `past_bookmarks`), so reading-view's
 * TranslatableWord renders the revealed cloze with chip + dotted
 * underline + MWE-partner styling for free. This component only
 * adds the input slot during the exercise, and flips
 * `isTranslationVisible` on the cloze word(s) when the exercise
 * is over so the chip appears automatically post-reveal.
 */
export function ClozeTranslatableText({
  interactiveText,
  translating,
  pronouncing,
  translatedWords,
  setTranslatedWords,
  leftEllipsis,
  rightEllipsis,
  isExerciseOver,
  clozeWordIds = [],
  nonTranslatableWords,
  renderClozeSlot = null,
}) {
  const [translationCount, setTranslationCount] = useState(0);

  const divType = interactiveText.formatting ? interactiveText.formatting : "div";

  const paragraphs = useMemo(() => {
    return interactiveText ? interactiveText.getParagraphs() : [];
  }, [interactiveText]);

  // Post-reveal: flip isTranslationVisible on every cloze word so the
  // chip auto-shows (ArticleReader's past bookmarks would otherwise
  // require a tap to surface the chip).
  useEffect(() => {
    if (!isExerciseOver || !interactiveText || !clozeWordIds.length) return;
    const clozeIdSet = new Set(clozeWordIds);
    for (const par of interactiveText.paragraphsAsLinkedWordLists) {
      let w = par.linkedWords.head;
      while (w) {
        if (clozeIdSet.has(w.id) && w.translation) {
          w.isTranslationVisible = true;
        }
        w = w.next;
      }
    }
    setTranslationCount((c) => c + 1);
  }, [isExerciseOver, interactiveText, clozeWordIds]);

  const nonTranslatableWordIds = useMemo(() => {
    if (!nonTranslatableWords || !interactiveText || isExerciseOver) return [];

    const targetWords = nonTranslatableWords.split(" ").map((w) => removePunctuation(w).toLowerCase());
    const linkedWordLists = interactiveText.paragraphsAsLinkedWordLists;
    if (!linkedWordLists || !linkedWordLists[0]) return [];

    const foundIds = [];
    let word = linkedWordLists[0].linkedWords.head;

    while (word) {
      if (removePunctuation(word.word).toLowerCase() === targetWords[0]) {
        let currentWord = word;
        let matchedIds = [];
        let matched = true;

        for (const target of targetWords) {
          if (currentWord && removePunctuation(currentWord.word).toLowerCase() === target) {
            matchedIds.push(currentWord.id);
            currentWord = currentWord.next;
          } else {
            matched = false;
            break;
          }
        }

        if (matched) {
          foundIds.push(...matchedIds);
        }
      }
      word = word.next;
    }

    return foundIds;
  }, [interactiveText, nonTranslatableWords, isExerciseOver]);

  function wordUpdated() {
    setTranslationCount(translationCount + 1);
  }

  function renderTranslatableWord(word) {
    return (
      <TranslatableWord
        interactiveText={interactiveText}
        key={word.id}
        word={word}
        wordUpdated={wordUpdated}
        translating={translating}
        pronouncing={pronouncing}
        translatedWords={translatedWords}
        setTranslatedWords={setTranslatedWords}
        disableTranslation={nonTranslatableWordIds.includes(word.id)}
      />
    );
  }

  // Highlight target words for ContextWithExchange-based exercises (no slot,
  // highlight-only) — e.g. TranslateL2toL1 where the user reads the L2
  // sentence and needs the target word visually marked.
  function renderHighlightedWord(word) {
    return (
      <span key={word.id} style={{ color: orange600, fontWeight: "bold" }}>
        {word.word + " "}
      </span>
    );
  }

  function renderWordJSX(word) {
    const isPartOfCloze = clozeWordIds.includes(word.id);

    // Cloze exercises with input slot: render slot for the first cloze
    // word, drop the rest. Post-reveal the bookmark-restoration path
    // (via TranslatableWord) renders the answer.
    if (isPartOfCloze && !isExerciseOver && renderClozeSlot) {
      return clozeWordIds[0] === word.id ? renderClozeSlot(word.id) : "";
    }

    // Highlight-only exercises (no slot): pre-reveal we use a bold-orange
    // marker because the bookmark-restoration dotted underline alone is
    // too subtle to read as "this is the target word". Post-reveal we
    // defer to TranslatableWord so the chip surfaces above the bookmark
    // word (driven by the isTranslationVisible flip in the useEffect).
    if (isPartOfCloze && !renderClozeSlot && !isExerciseOver) {
      return renderHighlightedWord(word);
    }

    return renderTranslatableWord(word);
  }

  const renderedText = paragraphs.map((par, index) =>
    createElement(
      divType,
      { className: "textParagraph", key: index },
      <>
        {index === 0 && leftEllipsis && <>...</>}
        {par.getWords().map((word) => renderWordJSX(word))}
        {index === 0 && rightEllipsis && <>...</>}
      </>,
    ),
  );

  return (
    <ExerciseTargetEmphasis>
      <s.TranslatableText>{renderedText}</s.TranslatableText>
    </ExerciseTargetEmphasis>
  );
}
