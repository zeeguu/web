import { useState, useEffect, useMemo, createElement } from "react";
import TranslatableWord from "./TranslatableWord";
import * as s from "./TranslatableText.sc";
import { removePunctuation } from "../utils/text/preprocessing";
import { orange500 } from "../components/colors";

/**
 * Renders interactive translatable text for the reader.
 * Users can click words to translate them.
 */
export function TranslatableText({
  interactiveText,
  translating,
  pronouncing,
  setIsRendered,
  highlightExpression,
  leftEllipsis,
  rightEllipsis,
  showMweHints,
  nonTranslatableWords, // Word(s) that should not be clickable for translation
  updateBookmarks,
}) {
  const [translationCount, setTranslationCount] = useState(0);
  const [nonTranslatableWordIds, setNonTranslatableWordIds] = useState([]);
  const [paragraphs, setParagraphs] = useState([]);
  const [highlightedMWEGroupId, setHighlightedMWEGroupId] = useState(null);
  const [loadingMWEGroupId, setLoadingMWEGroupId] = useState(null);
  const [mweGroupColorMap, setMweGroupColorMap] = useState({});
  const [mweGroupsWithTranslations, setMweGroupsWithTranslations] = useState(new Set());
  const [highlightSolutionExpression, setHighlightSolutionExpression] = useState(false);
  const divType = interactiveText.formatting ? interactiveText.formatting : "div";

  useEffect(() => {
    if (nonTranslatableWords) {
      findNonTranslatableWords();
    }
    if (interactiveText) {
      setParagraphs(interactiveText.getParagraphs());
      buildMweColorMap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactiveText]);

  function buildMweColorMap() {
    const groupsWithTranslations = new Set();
    const colorMap = {};

    let currentSentI = -1;
    let colorIndex = 0;
    const sentenceMweGroups = new Set();

    for (const par of interactiveText.paragraphsAsLinkedWordLists) {
      let word = par.linkedWords.head;
      while (word) {
        if (word.token.mwe_group_id) {
          const groupId = word.token.mwe_group_id;
          const sentI = word.token.sent_i;

          if (sentI !== currentSentI) {
            currentSentI = sentI;
            colorIndex = 0;
            sentenceMweGroups.clear();
          }

          if (!sentenceMweGroups.has(groupId)) {
            sentenceMweGroups.add(groupId);
            colorMap[groupId] = colorIndex % 5;
            colorIndex++;
          }

          if (word.translation) {
            groupsWithTranslations.add(groupId);
          }
        }
        word = word.next;
      }
    }

    setMweGroupColorMap(colorMap);
    setMweGroupsWithTranslations(groupsWithTranslations);
  }

  function updateMweGroupsWithTranslations() {
    const groupsWithTranslations = new Set();
    for (const par of interactiveText.paragraphsAsLinkedWordLists) {
      let word = par.linkedWords.head;
      while (word) {
        if (word.token.mwe_group_id && word.translation) {
          groupsWithTranslations.add(word.token.mwe_group_id);
        }
        word = word.next;
      }
    }
    setMweGroupsWithTranslations(groupsWithTranslations);
  }

  const renderedText = useMemo(() => {
    return paragraphs.map((par, index) =>
      createElement(
        divType,
        { className: `textParagraph ${divType}`, key: index },
        <>
          {index === 0 && leftEllipsis && <>...</>}
          {par.getWords().map((word) => renderWordJSX(word))}
          {index === 0 && rightEllipsis && <>...</>}
        </>,
      ),
    );
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paragraphs,
    translationCount,
    translating,
    pronouncing,
    nonTranslatableWords,
    nonTranslatableWordIds,
    rightEllipsis,
    leftEllipsis,
    highlightedMWEGroupId,
    loadingMWEGroupId,
    mweGroupColorMap,
    mweGroupsWithTranslations,
    highlightSolutionExpression,
  ]);

  useEffect(() => {
    if (setIsRendered) setIsRendered(true);
  }, [setIsRendered]);

  function wordUpdated() {
    setTranslationCount(translationCount + 1);
    updateMweGroupsWithTranslations();
    if (updateBookmarks) updateBookmarks();
  }

  function findNonTranslatableWords() {
    if (!nonTranslatableWords) return;
    let targetWords = nonTranslatableWords.split(" ");
    let word = interactiveText.paragraphsAsLinkedWordLists[0].linkedWords.head;

    while (word) {
      let wordMatches = false;
      for (let targetWord of targetWords) {
        if (removePunctuation(word.word).toLowerCase() === targetWord.toLowerCase()) {
          wordMatches = true;
          break;
        }
      }

      if (wordMatches) {
        let tempWord = word;
        let tempFoundIds = [];
        let matched = true;

        for (let index = 0; index < targetWords.length && tempWord; index++) {
          if (removePunctuation(tempWord.word).toLowerCase() === targetWords[index].toLowerCase()) {
            tempFoundIds.push(tempWord.id);
            tempWord = tempWord.next;
          } else {
            matched = false;
            break;
          }
        }

        if (matched && tempFoundIds.length === targetWords.length) {
          setNonTranslatableWordIds(tempFoundIds);
          break;
        }
      }
      word = word.next;
    }
  }

  function renderWordJSX(word) {
    const disableTranslation = nonTranslatableWordIds.includes(word.id);

    let isWordHighlighted = false;
    if (highlightExpression && interactiveText && interactiveText.shouldHighlightWord) {
      isWordHighlighted = interactiveText.shouldHighlightWord(word);
    } else if (highlightExpression) {
      const highlightedWords = highlightExpression.split(" ").map((w) => removePunctuation(w).toLowerCase());
      isWordHighlighted = highlightedWords.includes(removePunctuation(word.word).toLowerCase());
    }

    if (isWordHighlighted) {
      return <span key={word.id} style={{ color: orange500, fontWeight: "bold" }}>{word.word + " "}</span>;
    }

    const inExerciseContext = !!nonTranslatableWords;

    return (
      <TranslatableWord
        interactiveText={interactiveText}
        key={word.id}
        word={word}
        wordUpdated={wordUpdated}
        translating={translating}
        pronouncing={pronouncing}
        disableTranslation={disableTranslation}
        highlightedMWEGroupId={inExerciseContext ? null : highlightedMWEGroupId}
        setHighlightedMWEGroupId={inExerciseContext ? null : setHighlightedMWEGroupId}
        loadingMWEGroupId={loadingMWEGroupId}
        setLoadingMWEGroupId={setLoadingMWEGroupId}
        mweGroupColorMap={mweGroupColorMap}
        mweGroupsWithTranslations={mweGroupsWithTranslations}
        solutionWordIds={inExerciseContext ? nonTranslatableWordIds : null}
        highlightSolutionExpression={highlightSolutionExpression}
        setHighlightSolutionExpression={inExerciseContext ? setHighlightSolutionExpression : null}
      />
    );
  }

  return <s.TranslatableText data-show-mwe-hints={showMweHints === true}>{renderedText}</s.TranslatableText>;
}
