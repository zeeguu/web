import { useState, useEffect } from "react";
import { useClickOutside } from "react-click-outside-hook";
import AlterMenu from "./AlterMenu";
import extractDomain from "../utils/web/extractDomain";
import addProtocolToLink from "../utils/web/addProtocolToLink";
import redirect from "../utils/routing/routing";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Debug flag: always show MWE indicators (not just on hover)
const MWE_ALWAYS_SHOW_HINTS = true;

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
        // Use setTimeout(0) to allow React to render loading state on ALL MWE words
        // before fuseMWEPartners() mutates the linked list (detaching partner words).
        // Without this, partners are detached before they can show the loading animation.
        const doTranslate = () => {
          interactiveText.translate(word, true, () => {
            wordUpdated();
            setIsLoading(false);
            setIsWordTranslating(false);
            setIsTranslationVisible(true);
            // Clear MWE loading state
            if (mweGroupId && setLoadingMWEGroupId) {
              setLoadingMWEGroupId(null);
            }
          });
        };
        if (mweGroupId) {
          // Delay for MWE words to let React render loading animation first
          setTimeout(doTranslate, 0);
        } else {
          // Non-MWE words: translate immediately
          doTranslate();
        }
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
      interactiveText.alternativeTranslations(word, () => {
        wordUpdated(word);
        setHasFetchedAlternatives(true);
      });
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
  // Only apply MWE styling when there are 2+ MWE words in the same sentence
  function hasMWEPartnersInSameSentence() {
    if (!word.token.mwe_group_id) return false;
    // findMWEPartners returns all partners in the same sentence (including self)
    const partners = word.findMWEPartners();
    return partners.length > 1;
  }

  // MWE (Multi-Word Expression) hover handlers - work for all MWEs (even untranslated)
  function handleMouseEnter() {
    if (hasAnyMWE() && setHighlightedMWEGroupId) {
      setHighlightedMWEGroupId(word.token.mwe_group_id);
    }
  }

  function handleMouseLeave() {
    if (hasAnyMWE() && setHighlightedMWEGroupId) {
      setHighlightedMWEGroupId(null);
    }
  }

  // Check if this word is part of any MWE with partners in same sentence (for hover hints)
  function hasAnyMWE() {
    return hasMWEPartnersInSameSentence();
  }

  // Check if this word is part of a translated MWE (for permanent styling)
  // Always show MWE styling for translated MWEs, even if alone in sentence
  // (the translation is still for the full MWE expression)
  function isMWEWord() {
    // Case 1: Word has mwe_group_id and the group has been translated
    if (word.token.mwe_group_id && mweGroupsWithTranslations?.has(word.token.mwe_group_id)) {
      return true;
    }
    // Case 2: Word has an MWE bookmark (restored from previous session)
    // mweExpression is set when restoring MWE bookmarks
    if (word.mweExpression && word.translation) {
      return true;
    }
    return false;
  }

  // Check if this MWE has separated parts (non-adjacent words)
  // Only separated MWEs need color coding to show which parts belong together
  function isSeparatedMWE() {
    return word.token.mwe_is_separated === true;
  }

  // Get the color class for this MWE word (mwe-color-0 through mwe-color-4)
  // Only returns a color class for separated MWEs - adjacent MWEs don't need colors
  function getMWEColorClass() {
    // Only apply colors for separated MWEs
    if (!isSeparatedMWE()) {
      return "";
    }
    if (word.token.mwe_group_id && mweGroupColorMap) {
      const colorIndex = mweGroupColorMap[word.token.mwe_group_id];
      if (colorIndex !== undefined) {
        return `mwe-color-${colorIndex}`;
      }
    }
    // Fallback for MWE bookmarks without a mapped color
    if (word.mweExpression) {
      return "mwe-color-0"; // Default to violet
    }
    return "";
  }

  // Check if this word should be highlighted as part of an MWE (on hover)
  // Works for all MWE words, even untranslated ones (to hint at the connection)
  function isMWEHighlighted() {
    if (!highlightedMWEGroupId) return false;
    if (word.token.mwe_group_id !== highlightedMWEGroupId) return false;
    return hasMWEPartnersInSameSentence();
  }

  function getWordClass(word) {
    /*
    Function determines which class to be assigned to the word object.
    Mainly, to render the punctuation cases that need to be handled differently.
    By default, all punctuation words are assigned the class "punct", which means they
    are moved slightly to the left, to be close to the previous tokens.
    - left_punct means that the punctuation is moved a bit to the right, for example ( 
    */
    const noMarginPunctuation = ["–", "—", "“", "‘", '"'];
    let allClasses = [];
    if (word.token.has_space !== undefined) {
      // from stanza, has_space property
      if (word.token.is_punct || word.token.is_like_symbol) allClasses.push("no-hover");
      // Note: has_space === false is handled in the render by not adding a trailing space
      // We do NOT add the no-space CSS class here because that adds negative margin
      // which is only appropriate for punctuation, not for regular words like clitics
    } else {
      // we are in NLTK
      if (word.token.is_punct) {
        allClasses.push("punct");
        allClasses.push("no-hover");
      }
      if (
        word.token.is_left_punct ||
        (word.token.is_punct && word.prev && [":", ".", ","].includes(word.prev.word.trim()))
      )
        allClasses.push("left-punct");
      if (noMarginPunctuation.includes(word.word.trim())) allClasses.push("no-margin");
    }
    if (word.token.is_like_num) allClasses.push("number");
    // Add permanent MWE color class only if this MWE has been translated
    if (isMWEWord()) {
      const colorClass = getMWEColorClass();
      if (colorClass) {
        allClasses.push(colorClass);
      } else {
        // Adjacent (non-separated) MWEs get darker orange styling
        allClasses.push("mwe-adjacent");
      }
    }

    // Debug mode: always show MWE hints for untranslated MWEs
    const hasMWEGroup = word.token?.mwe_group_id;
    if (MWE_ALWAYS_SHOW_HINTS && hasMWEGroup && !isMWEWord()) {
      allClasses.push("mwe-hover-hint");
      allClasses.push(getMWEColorClass());
    }

    // Add MWE loading class when this word's MWE group is being translated
    // This makes ALL partner words pulse together in the MWE color
    if (hasMWEGroup && loadingMWEGroupId === hasMWEGroup) {
      allClasses.push("mwe-loading");
      allClasses.push(getMWEColorClass());
    }

    // Add MWE highlight class on hover - works for all MWEs (even untranslated)
    if (isMWEHighlighted()) {
      allClasses.push("mwe-hover-active");
      if (!isMWEWord()) {
        // Untranslated MWEs also need the color class
        allClasses.push(getMWEColorClass());
      }
    }

    return allClasses.join(" ");
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

  //disableTranslation so user cannot translate words that are being tested
  if ((!isWordTranslating && !word.translation && !isClickedToPronounce) || disableTranslation) {
    return (
      <>
        <z-tag
          class={wordClass}
          onClick={(e) => clickOnWord(e, word)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {word.word + (word.token.has_space === true ? " " : "")}
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
            />
          )}
        </z-orig>
      </z-tag>
    </>
  );
}
