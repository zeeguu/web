import { useState, useEffect, useMemo, createElement } from "react";
import TranslatableWord from "./TranslatableWord";
import * as s from "./TranslatableText.sc";
import { removePunctuation } from "../utils/text/preprocessing";
import { orange500 } from "../components/colors";

export function TranslatableText({
  interactiveText,
  translating,
  pronouncing,
  setIsRendered,
  highlightExpression,
  leftEllipsis,
  rightEllipsis,
  showMweHints,
  // exercise related
  isExerciseOver,
  clozeWord, // Word(s) to hide and replace with underlines/placeholders in cloze exercises
  nonTranslatableWords, // Word(s) that should not be clickable for translation
  overrideBookmarkHighlightText, // boldAndDeactivatedText -- used in OrderWords
  updateBookmarks, // callback - should be probably named: notifyWordTranslated --- actually only used once in ArticleReader, in quite a bad way. consider alterantoves
}) {
  const [translationCount, setTranslationCount] = useState(0);
  const [nonTranslatableWordIds, setNonTranslatableWordIds] = useState([]);
  const [clozeWordIds, setClozeWordIds] = useState([]);
  const [paragraphs, setParagraphs] = useState([]);
  const [firstClozeWordId, setFirstClozeWordId] = useState(0);
  const [highlightedMWEGroupId, setHighlightedMWEGroupId] = useState(null);
  const [loadingMWEGroupId, setLoadingMWEGroupId] = useState(null);
  const [mweGroupColorMap, setMweGroupColorMap] = useState({});
  const [mweGroupsWithTranslations, setMweGroupsWithTranslations] = useState(new Set());
  const divType = interactiveText.formatting ? interactiveText.formatting : "div";

  useEffect(() => {
    if (nonTranslatableWords) {
      findNonTranslatableWords();
    }
    if (clozeWord) {
      findClozeWords();
    }
    if (interactiveText) {
      setParagraphs(interactiveText.getParagraphs());
      // Build MWE group to color index mapping
      buildMweColorMap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactiveText]);

  function buildMweColorMap() {
    const groupsWithTranslations = new Set();
    const colorMap = {};

    // Track color assignment per sentence - colors reset for each new sentence
    let currentSentI = -1;
    let colorIndex = 0;
    const sentenceMweGroups = new Set(); // MWE groups seen in current sentence

    for (const par of interactiveText.paragraphsAsLinkedWordLists) {
      let word = par.linkedWords.head;
      while (word) {
        if (word.token.mwe_group_id) {
          const groupId = word.token.mwe_group_id;
          const sentI = word.token.sent_i;

          // Reset color index when entering a new sentence
          if (sentI !== currentSentI) {
            currentSentI = sentI;
            colorIndex = 0;
            sentenceMweGroups.clear();
          }

          // Assign color for this group if not already assigned in this sentence
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

  // Use useMemo instead of useEffect to compute rendered text synchronously
  // This prevents the blink when MWE words are fused (useEffect runs after paint)
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
    isExerciseOver,
    clozeWord,
    clozeWordIds,
    nonTranslatableWords,
    nonTranslatableWordIds,
    rightEllipsis,
    leftEllipsis,
    highlightedMWEGroupId,
    loadingMWEGroupId,
    mweGroupColorMap,
    mweGroupsWithTranslations,
    firstClozeWordId,
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
    let foundIds = [];
    
    while (word) {
      // Check if this word matches any word in the target phrase
      let wordMatches = false;
      for (let targetWord of targetWords) {
        if (removePunctuation(word.word).toLowerCase() === targetWord.toLowerCase()) {
          wordMatches = true;
          break;
        }
      }
      
      if (wordMatches) {
        // Try to match the entire phrase starting from this position
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
          // Found the complete phrase
          foundIds = tempFoundIds;
          setNonTranslatableWordIds(foundIds);
          break;
        }
      }
      word = word.next;
    }
  }

  function findClozeWords() {
    if (!clozeWord) return;
    let targetWords = clozeWord.split(" ");
    let word = interactiveText.paragraphsAsLinkedWordLists[0].linkedWords.head;
    while (word) {
      if (removePunctuation(word.word).toLowerCase() === targetWords[0].toLowerCase()) {
        let copyOfFoundIds = [...clozeWordIds];
        for (let index = 0; index < targetWords.length; index++) {
          if (removePunctuation(word.word).toLowerCase() === targetWords[index].toLowerCase()) {
            if (index === 0) setFirstClozeWordId(word.id);
            copyOfFoundIds.push(word.id);
            word = word.next;
          } else {
            copyOfFoundIds = [...clozeWordIds];
            word = word.next;
            break;
          }
        }
        setClozeWordIds(copyOfFoundIds);
        if (copyOfFoundIds.length === targetWords.length) break;
      } else {
        word = word.next;
      }
    }
  }

  function colorWord(word) {
    return `<span class='highlightedWord'>${word} </span>`;
  }

  function renderWordJSX(word) {
    // If the word is a non-translatable word, it won't be translated when clicked
    const disableTranslation = nonTranslatableWordIds.includes(word.id);
    
    // Check if this word is part of the cloze (hidden) text
    const isClozeWord = clozeWordIds.includes(word.id);

    // Position-based highlighting for exercises
    let isWordHighlighted = false;
    if (isExerciseOver && interactiveText.shouldHighlightWord) {
      isWordHighlighted = interactiveText.shouldHighlightWord(word);
    } else if (highlightExpression) {
      // Fallback to word-based highlighting for non-exercises
      const highlightedWords = highlightExpression.split(" ").map((w) => removePunctuation(w).toLowerCase());
      isWordHighlighted = highlightedWords.includes(removePunctuation(word.word).toLowerCase());
    }

    if (isExerciseOver) {
      if (word.id === firstClozeWordId && overrideBookmarkHighlightText) {
        // In case we want to override the highlighted bookmark
        // with another string. Used in the OrderWords.
        return (
          <span
            key={word.id}
            dangerouslySetInnerHTML={{
              __html: colorWord(overrideBookmarkHighlightText),
            }}
          />
        );
      }
      if (isClozeWord) {
        if (overrideBookmarkHighlightText) {
          return <></>;
        }
        return (
          <span
            key={word.id}
            dangerouslySetInnerHTML={{
              __html: colorWord(word.word),
            }}
          />
        );
      } else if (isWordHighlighted) {
        // Highlight words based on highlightExpression when showing solution
        return <span key={word.id} style={{ color: orange500, fontWeight: "bold" }}>{word.word + " "}</span>;
      } else {
        return (
          <TranslatableWord
            interactiveText={interactiveText}
            key={word.id}
            word={word}
            wordUpdated={wordUpdated}
            translating={translating}
            pronouncing={pronouncing}
            disableTranslation={disableTranslation}
            highlightedMWEGroupId={highlightedMWEGroupId}
            setHighlightedMWEGroupId={setHighlightedMWEGroupId}
            loadingMWEGroupId={loadingMWEGroupId}
            setLoadingMWEGroupId={setLoadingMWEGroupId}
            mweGroupColorMap={mweGroupColorMap}
            mweGroupsWithTranslations={mweGroupsWithTranslations}
          />
        );
      }
    } else {
      if (isWordHighlighted) {
        return <span key={word.id} style={{ color: orange500, fontWeight: "bold" }}>{word.word + " "}</span>;
      }
      if (!clozeWord) {
        return (
          <TranslatableWord
            interactiveText={interactiveText}
            key={word.id}
            word={word}
            wordUpdated={wordUpdated}
            translating={translating}
            pronouncing={pronouncing}
            disableTranslation={disableTranslation}
            highlightedMWEGroupId={highlightedMWEGroupId}
            setHighlightedMWEGroupId={setHighlightedMWEGroupId}
            loadingMWEGroupId={loadingMWEGroupId}
            setLoadingMWEGroupId={setLoadingMWEGroupId}
            mweGroupColorMap={mweGroupColorMap}
            mweGroupsWithTranslations={mweGroupsWithTranslations}
          />
        );
      }

      if (clozeWordIds[0] === word.id) {
        // Fixed-length underline with smooth transition animation
        const fixedUnderlineLength = '4em'; // Fixed length to prevent solution hints
        
        return (
          <span 
            key={word.id}
            style={{ 
              position: 'relative',
              display: 'inline-block',
              minWidth: fixedUnderlineLength,
              textAlign: 'center',
              marginRight: '0.5em'
            }}
          >
            {/* Underline placeholder - visible during exercise */}
            <span 
              style={{
                position: 'absolute',
                opacity: isExerciseOver ? 0 : 1,
                transition: 'opacity 0.6s ease-in-out',
                borderBottom: '2px dotted #333',
                width: fixedUnderlineLength,
                display: 'inline-block',
                height: '1.2em',
                left: '50%',
                transform: 'translateX(-50%)',
                top: 0
              }}
            />
            
            {/* Actual word - revealed when exercise is over */}
            <span 
              style={{
                opacity: isExerciseOver ? 1 : 0,
                transition: 'opacity 0.6s ease-in-out',
                color: orange500,
                fontWeight: 'bold',
                display: 'inline-block'
              }}
            >
              {word.word}
            </span>
          </span>
        );
      }

      if (disableTranslation) {
        return "";
      }

      return (
        <TranslatableWord
          interactiveText={interactiveText}
          key={word.id}
          word={word}
          wordUpdated={wordUpdated}
          translating={translating}
          pronouncing={pronouncing}
          disableTranslation={disableTranslation}
          highlightedMWEGroupId={highlightedMWEGroupId}
          setHighlightedMWEGroupId={setHighlightedMWEGroupId}
          loadingMWEGroupId={loadingMWEGroupId}
          setLoadingMWEGroupId={setLoadingMWEGroupId}
          mweGroupColorMap={mweGroupColorMap}
          mweGroupsWithTranslations={mweGroupsWithTranslations}
        />
      );
    }
  }

  return <s.TranslatableText data-show-mwe-hints={showMweHints === true}>{renderedText}</s.TranslatableText>;
}
