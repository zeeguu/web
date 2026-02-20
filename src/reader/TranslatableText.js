import { useState, useEffect, useMemo, createElement } from "react";
import TranslatableWord from "./TranslatableWord";
import * as s from "./TranslatableText.sc";

/**
 * Renders interactive translatable text for the reader.
 * Users can click words to translate them.
 */
export function TranslatableText({
  interactiveText,
  translating,
  pronouncing,
  setIsRendered,
  leftEllipsis,
  rightEllipsis,
  showMweHints,
  updateBookmarks,
}) {
  const [translationCount, setTranslationCount] = useState(0);
  const [paragraphs, setParagraphs] = useState([]);
  const [highlightedMWEGroupId, setHighlightedMWEGroupId] = useState(null);
  const [loadingMWEGroupId, setLoadingMWEGroupId] = useState(null);
  const [mweGroupColorMap, setMweGroupColorMap] = useState({});
  const [mweGroupsWithTranslations, setMweGroupsWithTranslations] = useState(new Set());
  const divType = interactiveText.formatting ? interactiveText.formatting : "div";

  useEffect(() => {
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
    rightEllipsis,
    leftEllipsis,
    highlightedMWEGroupId,
    loadingMWEGroupId,
    mweGroupColorMap,
    mweGroupsWithTranslations,
  ]);

  useEffect(() => {
    if (setIsRendered) setIsRendered(true);
  }, [setIsRendered]);

  function wordUpdated() {
    setTranslationCount(translationCount + 1);
    updateMweGroupsWithTranslations();
    if (updateBookmarks) updateBookmarks();
  }

  function renderWordJSX(word) {
    return (
      <TranslatableWord
        interactiveText={interactiveText}
        key={word.id}
        word={word}
        wordUpdated={wordUpdated}
        translating={translating}
        pronouncing={pronouncing}
        highlightedMWEGroupId={highlightedMWEGroupId}
        setHighlightedMWEGroupId={setHighlightedMWEGroupId}
        loadingMWEGroupId={loadingMWEGroupId}
        setLoadingMWEGroupId={setLoadingMWEGroupId}
        mweGroupColorMap={mweGroupColorMap}
        mweGroupsWithTranslations={mweGroupsWithTranslations}
      />
    );
  }

  return <s.TranslatableText data-show-mwe-hints={showMweHints === true}>{renderedText}</s.TranslatableText>;
}
