import { useState, useEffect } from "react";
import { useClickOutside } from "react-click-outside-hook";
import AlterMenu from "./AlterMenu";
import extractDomain from "../utils/web/extractDomain";
import addProtocolToLink from "../utils/web/addProtocolToLink";
import redirect from "../utils/routing/routing";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";


export default function TranslatableWord({
  interactiveText,
  word,
  wordUpdated,
  translating,
  pronouncing,
  disableTranslation,
  highlightedMWEGroupId,
  setHighlightedMWEGroupId,
  loadingMWEGroupId,
  setLoadingMWEGroupId,
  mweGroupColorMap,
  mweGroupsWithTranslations,
}) {
  const [showingAlterMenu, setShowingAlterMenu] = useState(false);
  const [refToTranslation, clickedOutsideTranslation] = useClickOutside();
  const [isClickedToPronounce, setIsClickedToPronounce] = useState(false);
  const [isWordTranslating, setIsWordTranslating] = useState(false);
  const [prevWord, setPreviousWord] = useState("");
  const [isTranslationVisible, setIsTranslationVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedAlternatives, setHasFetchedAlternatives] = useState(false);

  useEffect(() => {
    if (word.isTranslationVisible) {
      setIsTranslationVisible(true);
      return;
    }
    if (word.translation) setIsTranslationVisible(false);
  }, [word]);

  function clickOnWord(e, word) {
    if (word.token.is_like_num || (word.token.is_punct && word.word.length === 1)) return;
    if (word.translation) {
      if (pronouncing) interactiveText.pronounce(word);
      if ((translating && !isTranslationVisible) || (!translating && isTranslationVisible))
        setIsTranslationVisible(!isTranslationVisible);
      return;
    }
    if (translating) {
      if (!disableTranslation) {
        setIsLoading(true);
        setPreviousWord(word.word);
        setIsWordTranslating(true);
        // Set MWE group loading state so all partner words pulse together
        const mweGroupId = word.token?.mwe_group_id;
        if (mweGroupId && setLoadingMWEGroupId) {
          setLoadingMWEGroupId(mweGroupId);
        }
        // For MWE words, update prevWord to fused text and trigger re-render
        // This ensures the loading animation shows "suntem prezenți" not just "suntem"
        const onFusionComplete = mweGroupId ? () => {
          setPreviousWord(word.word); // word.word is now the fused MWE text
          wordUpdated();
        } : null;
        interactiveText.translate(word, true, () => {
          wordUpdated();
          setIsLoading(false);
          setIsWordTranslating(false);
          setIsTranslationVisible(true);
          // Clear MWE loading state
          if (mweGroupId && setLoadingMWEGroupId) {
            setLoadingMWEGroupId(null);
          }
        }, onFusionComplete);
      } else {
        // For non-translatable words in exercises, track the click
        if (interactiveText.trackWordClick) {
          interactiveText.trackWordClick(word);
        }
      }
    }
    if (pronouncing || isClickedToPronounce) {
      setIsClickedToPronounce(true);
      interactiveText.pronounce(word);
    }
  }

  function toggleAlterMenu(e, word) {
    if (showingAlterMenu) {
      setShowingAlterMenu(false);
      return;
    }
    setShowingAlterMenu(true);
    if (!hasFetchedAlternatives)
      interactiveText.alternativeTranslations(
        word,
        () => wordUpdated(word), // Called for each translation as it arrives
        () => setHasFetchedAlternatives(true), // Called when all done
      );
  }

  function unlinkLastWord(e, word) {
    setIsLoading(true);
    interactiveText.api.deleteBookmark(
      word.bookmark_id,
      (response) => {
        if (response === "OK") {
          // delete was successful; log and close
          let withoutLastWord = word.unlinkLastWord();
          interactiveText.translate(withoutLastWord, true, () => {
            withoutLastWord.isTranslationVisible = true;
            let unlinkedWord = withoutLastWord.next;
            interactiveText.translate(unlinkedWord, false, () => {
              unlinkedWord.isTranslationVisible = true;
              wordUpdated();
              setIsLoading(false);
            });
          });
        }
      },
      (error) => {
        // onError
        console.error(error);
      },
    );
  }

  function deleteTranslation(e, word) {
    interactiveText.api.deleteBookmark(
      word.bookmark_id,
      (response) => {
        if (response === "OK") {
          // delete was successful; log and close
          word.splitIntoComponents();
          wordUpdated();
        }
      },
      (error) => {
        // onError
        console.log(error);
        alert("something went wrong and we could not delete the bookmark; try again later.");
      },
    );
  }

  function ungroupMwe(e, word) {
    // Get article_id from context identifier
    const articleId = interactiveText.contextIdentifier?.article_id;
    const mweExpression = word.mweExpression;
    const sentenceText = word.getSentenceText?.() || "";
    const bookmarkId = word.bookmark_id;

    if (!articleId || !mweExpression || !sentenceText || !bookmarkId) {
      console.error("Missing data for MWE ungroup:", { articleId, mweExpression, sentenceText, bookmarkId });
      return;
    }

    interactiveText.api.disableMweGrouping(
      articleId,
      mweExpression,
      sentenceText,
      bookmarkId,
      () => {
        // Success - split the word back into components and clear MWE metadata
        word.splitAndClearMWE();
        setShowingAlterMenu(false);
        wordUpdated();
      },
      (error) => {
        console.error("Failed to ungroup MWE:", error);
        alert("Could not ungroup words. Please try again.");
      },
    );
  }

  function selectAlternative(alternative, preferredSource) {
    interactiveText.selectAlternative(word, alternative, preferredSource, () => {
      wordUpdated();
      setShowingAlterMenu(false);
    });
  }

  function hideAlterMenu() {
    setShowingAlterMenu(false);
  }

  // Check if this word has MWE partners in the same sentence
  function hasMWEPartnersInSameSentence() {
    if (!word.token.mwe_group_id) return false;
    return word.findMWEPartners().length > 1;
  }

  function handleMouseEnter() {
    const groupId = word.token?.mwe_group_id;
    if (hasMWEPartnersInSameSentence() && setHighlightedMWEGroupId) {
      setHighlightedMWEGroupId(groupId);
    }
  }

  function handleMouseLeave() {
    if (hasMWEPartnersInSameSentence() && setHighlightedMWEGroupId) {
      setHighlightedMWEGroupId(null);
    }
  }

  // Check if this word is part of a translated MWE
  function isTranslatedMWE() {
    if (word.token.mwe_group_id && mweGroupsWithTranslations?.has(word.token.mwe_group_id)) return true;
    if (word.mweExpression && word.translation) return true;
    if (word.isMwePartner && word.mweExpression) return true;
    return false;
  }

  // Get color class for separated MWEs (mwe-color-0 through mwe-color-4)
  function getMWEColorClass() {
    if (!word.token.mwe_is_separated) return "";
    if (word.token.mwe_group_id && mweGroupColorMap) {
      const colorIndex = mweGroupColorMap[word.token.mwe_group_id];
      if (colorIndex !== undefined) return `mwe-color-${colorIndex}`;
    }
    return word.mweExpression ? "mwe-color-0" : "";
  }

  // Get CSS classes for special tokens (punctuation, numbers, symbols)
  function getSpecialTokenClasses(word) {
    const classes = [];
    if (word.token.is_like_num) classes.push("number");

    if (word.token.has_space !== undefined) {
      // Stanza tokenizer
      if (word.token.is_punct || word.token.is_like_symbol) classes.push("no-hover");
    } else {
      // NLTK tokenizer
      if (word.token.is_punct) {
        classes.push("punct", "no-hover");
      }
      if (word.token.is_left_punct ||
          (word.token.is_punct && word.prev && [":", ".", ","].includes(word.prev.word.trim()))) {
        classes.push("left-punct");
      }
      if (["–", "—", "\u201c", "\u2019", '"'].includes(word.word.trim())) {
        classes.push("no-margin");
      }
    }
    return classes;
  }

  // Get MWE-related CSS classes
  function getMWEClasses(word) {
    const classes = [];
    const groupId = word.token?.mwe_group_id;
    if (!groupId) return classes;

    const translated = isTranslatedMWE();
    const colorClass = getMWEColorClass();
    const isHighlighted = highlightedMWEGroupId === groupId && hasMWEPartnersInSameSentence();
    const isLoading = loadingMWEGroupId === groupId;

    if (translated) {
      classes.push(colorClass || "mwe-adjacent");
    } else {
      classes.push("mwe-hover-hint", colorClass);
    }

    if (isLoading) classes.push("mwe-loading", colorClass);
    if (isHighlighted) {
      classes.push("mwe-hover-active");
      if (!translated) classes.push(colorClass);
    }

    return classes;
  }

  function getWordClass(word) {
    return [...getSpecialTokenClasses(word), ...getMWEClasses(word)].filter(Boolean).join(" ");
  }

  const wordClass = getWordClass(word);

  // Don't render words that have been fused into an MWE (marked for skip)
  // This prevents duplication during loading animation when fuseMWEPartners
  // has already run but the component is still mounted
  if (word.token?.skipRender) {
    return null;
  }

  if (word.token.is_like_email)
    return (
      <>
        <z-tag>
          <a href={"mailto:" + word.word}>{extractDomain(word.word) + " "}</a>
        </z-tag>
      </>
    );
  if (word.token.is_like_url)
    return (
      <>
        <z-tag onClick={() => redirect(addProtocolToLink(word.word), true)}>
          <span className="link-style">{extractDomain(word.word) + " "}</span>
        </z-tag>
      </>
    );

  // Render simple (non-translated) word: no translation yet, or translation disabled (e.g., in exercises)
  if ((!isWordTranslating && !word.translation && !isClickedToPronounce) || disableTranslation) {
    return (
      <>
        <z-tag
          class={wordClass}
          onClick={(e) => clickOnWord(e, word)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {word.word + (word.token.has_space === true && !word.word.endsWith("-") && !word.next?.word?.startsWith("-") ? " " : "")}
        </z-tag>
      </>
    );
  }

  return (
    <>
      <z-tag class={wordClass} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {word.translation && (isTranslationVisible || word.isTranslationVisible) && (
          <z-tran chosen={word.translation} translation0={word.translation} ref={refToTranslation}>
            <span className="translationContainer">
              <span className="hide low-oppacity translation-icon">
                <VisibilityOffIcon
                  fontSize="8px"
                  onClick={(e) => {
                    // Toggle both React state and word object flag
                    const newVisibility = !(isTranslationVisible || word.isTranslationVisible);
                    setIsTranslationVisible(newVisibility);
                    word.isTranslationVisible = newVisibility;
                    setShowingAlterMenu(false);
                  }}
                />
              </span>
              <span className="translation" onClick={(e) => toggleAlterMenu(e, word)}>
                {word.translation}
              </span>
              <span className="arrow" onClick={(e) => toggleAlterMenu(e, word)}>
                {showingAlterMenu ? "▲" : "▼"}
              </span>
              {word.mergedTokens.length > 1 && (
                <span className="unlink low-oppacity translation-icon">
                  <LinkOffIcon
                    fontSize="8px"
                    onClick={(e) => {
                      unlinkLastWord(e, word);
                    }}
                  />
                </span>
              )}
            </span>
          </z-tran>
        )}
        <z-orig>
          {isWordTranslating ? (
            <span className={isLoading ? " loading" : ""}> {prevWord} </span>
          ) : (
            <span className={isLoading ? " loading" : ""} onClick={(e) => clickOnWord(e, word)}>
              {word.word}{" "}
            </span>
          )}
          {showingAlterMenu && (
            <AlterMenu
              word={word}
              setShowingAlternatives={setShowingAlterMenu}
              selectAlternative={selectAlternative}
              hideAlterMenu={hideAlterMenu}
              clickedOutsideTranslation={clickedOutsideTranslation}
              deleteTranslation={deleteTranslation}
              ungroupMwe={ungroupMwe}
              alternativesLoaded={hasFetchedAlternatives}
            />
          )}
        </z-orig>
      </z-tag>
    </>
  );
}
