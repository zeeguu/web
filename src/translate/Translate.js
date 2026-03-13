import React, { useContext, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import { ExercisesCounterContext } from "../exercises/ExercisesCounterContext";
import { setTitle } from "../assorted/setTitle";
import { numericToCefr } from "../utils/misc/cefrHelpers";
import useSpeech from "../hooks/useSpeech";
import InputField from "../components/InputField";
import LoadingAnimation from "../components/LoadingAnimation";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { LANGUAGE_CODE_TO_NAME } from "../utils/misc/languageCodeToName";
import { needsVirtualKeyboard } from "../utils/misc/languageScripts";
import VirtualKeyboard from "../components/VirtualKeyboard/VirtualKeyboard";
import SpecialCharacterBar, { hasSpecialCharacters } from "../components/VirtualKeyboard/SpecialCharacterBar";
import * as s from "./Translate.sc";

const DIRECTION_STORAGE_KEY = "zeeguu_translate_direction";

// Highlight the target word(s) in a sentence - handles MWEs (multi-word expressions)
function highlightTargetWord(sentence, targetWord) {
  if (!sentence || !targetWord) return sentence;

  // Split target into individual words for MWE support
  const targetWords = targetWord.trim().split(/\s+/);

  // Build stems for each word (first 4 chars for fuzzy matching)
  const stems = targetWords.map((word) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return escaped.slice(0, Math.min(4, escaped.length)).toLowerCase();
  });

  // Build regex that matches any of the word stems
  const stemPatterns = stems.map((stem) => `\\b${stem}\\p{L}*`).join("|");
  const regex = new RegExp(`(${stemPatterns})`, "giu");

  return sentence.split(regex).map((part, index) => {
    const partLower = part.toLowerCase();
    // Check if this part matches any of our stems
    const isMatch = stems.some((stem) => partLower.startsWith(stem) && part.match(/^\p{L}+$/u));

    if (isMatch) {
      return (
        <span key={index} style={{ color: "#ff8c42", fontWeight: "bold" }}>
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function Translate() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const { updateExercisesCounter } = useContext(ExercisesCounterContext);
  const location = useLocation();

  const learnedLang = userDetails?.learned_language;
  const nativeLang = userDetails?.native_language;
  // Get user's CEFR level for the learned language (stored as numeric 1-6)
  const userCefrLevel = numericToCefr(userDetails?.[learnedLang + "_max"]);

  // Direction: "toNative" means learned→native, "toLearned" means native→learned
  const [direction, setDirection] = useState(() => {
    const saved = localStorage.getItem(DIRECTION_STORAGE_KEY);
    return saved === "toNative" || saved === "toLearned" ? saved : "toLearned";
  });

  const [searchWord, setSearchWord] = useState("");
  const [translations, setTranslations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  // Examples state: { translationKey: { loading: bool, examples: [], error: string } }
  const [examplesState, setExamplesState] = useState({});
  // Learning card previews: { translationKey: { loading: bool, card: {...}, error: string } }
  const [cardPreviews, setCardPreviews] = useState({});
  // Added translations: Set of translation keys
  const [addedTranslations, setAddedTranslations] = useState(new Set());
  // Which translation is currently being added (loading state)
  const [addingKey, setAddingKey] = useState(null);
  // Reported translations: Set of translation keys
  const [reportedTranslations, setReportedTranslations] = useState(new Set());

  const { speak, isSpeaking } = useSpeech();
  const searchWordRef = useRef("");
  const inputRef = useRef(null);

  const sourceLang = direction === "toNative" ? learnedLang : nativeLang;
  const targetLang = direction === "toNative" ? nativeLang : learnedLang;

  const showVirtualKeyboard = needsVirtualKeyboard(sourceLang);
  const showSpecialCharBar = !showVirtualKeyboard && hasSpecialCharacters(sourceLang);
  const [isKeyboardCollapsed, setIsKeyboardCollapsed] = useState(false);

  useEffect(() => {
    setTitle("Translate");
  }, []);

  // Blur input when virtual keyboard is expanded to suppress OS keyboard on mobile
  useEffect(() => {
    if (showVirtualKeyboard && !isKeyboardCollapsed && inputRef.current) {
      inputRef.current.blur();
    }
  }, [isKeyboardCollapsed, showVirtualKeyboard]);

  // Handle searchWord passed from history navigation
  useEffect(() => {
    if (location.state?.searchWord) {
      const word = location.state.searchWord;
      setSearchWord(word);
      performSearch(word, true); // Skip logging - already in history
      // Clear the state so refreshing doesn't re-trigger
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  function swapDirection() {
    const newDirection = direction === "toNative" ? "toLearned" : "toNative";
    setDirection(newDirection);
    localStorage.setItem(DIRECTION_STORAGE_KEY, newDirection);
    // Clear results when swapping
    setTranslations([]);
    setHasSearched(false);
    setExamplesState({});
    setCardPreviews({});
    setAddedTranslations(new Set());
    setAddingKey(null);
  }

  function getTranslationKey(translation) {
    return translation.toLowerCase();
  }

  // Check if input looks like a real word (not gibberish)
  function isValidWord(word) {
    if (!word || word.length < 2) return false;

    // Check each word in potential MWE
    const words = word.split(/\s+/);
    for (const w of words) {
      // Too short
      if (w.length < 2) return false;

      // Repeated character pattern (e.g., "lalalal", "aaaa")
      if (/^(.)\1{3,}$/.test(w)) return false; // same char 4+ times
      if (/^(.{1,2})\1{2,}$/.test(w)) return false; // pattern repeats 3+ times
    }

    return true;
  }

  // Check if translation is valid (not just echoing input)
  function isValidTranslation(translation, originalWord) {
    if (!translation) return false;
    // If translation equals input, translation service found nothing
    if (translation.toLowerCase() === originalWord.toLowerCase()) return false;
    // Single letter translations are usually garbage
    if (translation.length === 1) return false;
    return true;
  }

  function performSearch(word, skipHistory = false) {
    if (!word || !isValidWord(word)) {
      setError("Please enter a valid word or phrase");
      return;
    }

    searchWordRef.current = word;

    setIsLoading(true);
    setError("");
    setHasSearched(true);
    setTranslations([]);
    setExamplesState({});
    setCardPreviews({});
    setAddedTranslations(new Set());
    setAddingKey(null);

    // Helper to filter valid translations
    const filterTranslations = (data, inputWord) => {
      if (!data || !data.translations) return [];
      const seen = new Set();
      return data.translations.filter((t) => {
        if (t.translation.length > 100) return false;
        const key = t.translation.toLowerCase();
        if (seen.has(key)) return false;
        if (!isValidTranslation(t.translation, inputWord)) return false;
        seen.add(key);
        return true;
      });
    };

    // Call only the selected direction
    api
      .getMultipleTranslations(sourceLang, targetLang, word, "", 10, null, null, null, false, null)
      .then((r) => r.json())
      .then((data) => {
        setIsLoading(false);

        const results = filterTranslations(data, word);
        setTranslations(results);

        // Log to history (only for new searches, not from history navigation)
        if (!skipHistory && results.length > 0) {
          api.logTranslationSearch(word);
        }

        // Auto-fetch examples for each translation (skip for long phrases)
        const wordCount = word.split(/\s+/).length;
        if (wordCount <= 3 && results.length > 0) {
          results.forEach((t) => {
            const displayKey = getTranslationKey(t.translation);
            if (direction === "toNative") {
              // User searched in learned language, got native translation
              fetchExamplesForTranslation(displayKey, word, t.translation, learnedLang, nativeLang);
            } else {
              // User searched in native language, got learned translation
              fetchExamplesForTranslation(displayKey, t.translation, word, learnedLang, nativeLang);
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setError("Failed to get translations. Please try again.");
        console.error(err);
      });
  }

  function handleSearch(e) {
    e.preventDefault();
    const word = searchWord.trim();
    if (!word) return;
    performSearch(word);
  }

  // displayKey: the key used for caching (based on what's displayed in UI)
  // word: the word in learned language (for generating examples)
  // translation: the translation in native language
  function fetchExamplesForTranslation(displayKey, word, translation, fromLang, toLang) {
    setExamplesState((prev) => ({
      ...prev,
      [displayKey]: { loading: true, examples: [], error: "" },
    }));

    api.getGeneratedExamples(
      word,
      fromLang,
      toLang,
      (examples) => {
        // Extract just the sentence text from examples (may be objects or strings)
        const exampleSentences = (examples || []).map((ex) => (typeof ex === "string" ? ex : ex.sentence || ex));
        setExamplesState((prev) => ({
          ...prev,
          [displayKey]: { loading: false, examples: exampleSentences, error: "" },
        }));

        // Now fetch the learning card preview with the examples
        fetchCardPreview(displayKey, word, translation, fromLang, toLang, exampleSentences);
      },
      () => {
        setExamplesState((prev) => ({
          ...prev,
          [displayKey]: { loading: false, examples: [], error: "Could not load examples" },
        }));
      },
      translation, // Pass translation for meaning-specific examples
      userCefrLevel, // Pass user's CEFR level for appropriate difficulty
    );
  }

  function fetchCardPreview(displayKey, word, translation, fromLang, toLang, examples) {
    setCardPreviews((prev) => ({
      ...prev,
      [displayKey]: { loading: true, card: null, error: "" },
    }));

    api.previewLearningCard(
      word,
      translation,
      fromLang,
      toLang,
      examples,
      (card) => {
        setCardPreviews((prev) => ({
          ...prev,
          [displayKey]: { loading: false, card: card, error: "" },
        }));
      },
      () => {
        setCardPreviews((prev) => ({
          ...prev,
          [displayKey]: { loading: false, card: null, error: "" },
        }));
      },
    );
  }

  function handleAdd(translation) {
    const key = getTranslationKey(translation);
    const state = examplesState[key];

    if (state?.loading) {
      toast.error("Please wait for examples to load");
      return;
    }

    const examples = state?.examples || [];
    const searchedWord = searchWordRef.current;

    // Always add word in learned language with translation in native language
    const wordToLearn = direction === "toNative" ? searchedWord : translation;
    const nativeTranslation = direction === "toNative" ? translation : searchedWord;

    setAddingKey(key);

    api.addWordToLearning(
      wordToLearn,
      nativeTranslation,
      learnedLang,
      nativeLang,
      examples,
      (result) => {
        setAddingKey(null);
        setAddedTranslations((prev) => new Set([...prev, key]));
        updateExercisesCounter();

        const card = result.learning_card;
        const bookmarkId = result.bookmark_id;

        const handleUndo = () => {
          api.deleteBookmark(bookmarkId, () => {
            setAddedTranslations((prev) => {
              const newSet = new Set(prev);
              newSet.delete(key);
              return newSet;
            });
            updateExercisesCounter();
            toast.info("Removed from exercises");
          });
        };

        toast.success(
          <span>
            Added "{card.word}" to exercises{" "}
            <span
              onClick={handleUndo}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              Undo
            </span>
          </span>
        );
      },
      (error) => {
        setAddingKey(null);
        const message = error?.detail || error?.error || "Failed to add word";
        toast.error(message);
      },
    );
  }

  function handleReport(translation) {
    const key = getTranslationKey(translation);
    const searchedWord = searchWordRef.current;

    const wordToReport = direction === "toNative" ? searchedWord : translation;
    const translationToReport = direction === "toNative" ? translation : searchedWord;

    api.reportMeaning(
      wordToReport,
      translationToReport,
      learnedLang,
      nativeLang,
      "bad_examples",
      null,
      () => {
        setReportedTranslations((prev) => new Set([...prev, key]));
        toast.success("Thanks for the feedback!");
      },
      () => {
        toast.error("Failed to submit report");
      },
    );
  }

  return (
    <>
      <s.DirectionSelector>
        <s.LanguageLabel>{LANGUAGE_CODE_TO_NAME[sourceLang] || sourceLang}</s.LanguageLabel>
        <s.SwapButton type="button" onClick={swapDirection} title="Swap languages">
          <SwapHorizIcon />
        </s.SwapButton>
        <s.LanguageLabel>{LANGUAGE_CODE_TO_NAME[targetLang] || targetLang}</s.LanguageLabel>
      </s.DirectionSelector>

      <form onSubmit={handleSearch}>
        <s.SearchContainer>
          <InputField
            id="translate-input"
            placeholder={`Type in ${LANGUAGE_CODE_TO_NAME[sourceLang] || sourceLang}...`}
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            autoFocus
            lang={sourceLang}
            spellCheck={true}
            inputRef={inputRef}
            inputMode={showVirtualKeyboard && !isKeyboardCollapsed ? "none" : undefined}
          />

          {showVirtualKeyboard && (
            <VirtualKeyboard
              languageCode={sourceLang}
              onInput={(newValue) => setSearchWord(newValue)}
              currentValue={searchWord}
              inputRef={inputRef}
              onCollapsedChange={setIsKeyboardCollapsed}
            />
          )}

          {showSpecialCharBar && (
            <SpecialCharacterBar
              languageCode={sourceLang}
              onKeyPress={(newValue) => setSearchWord(newValue)}
              currentValue={searchWord}
              inputRef={inputRef}
            />
          )}

          <s.TranslateButton type="submit" disabled={isLoading || !searchWord.trim()}>
            {isLoading ? "..." : "Translate"}
          </s.TranslateButton>
        </s.SearchContainer>
      </form>

      {error && <s.ErrorMessage>{error}</s.ErrorMessage>}

      {isLoading && <LoadingAnimation />}

      {!isLoading && hasSearched && translations.length === 0 && (
        <s.NoResults>No translations found for "{searchWord}"</s.NoResults>
      )}

      {!isLoading && translations.length > 0 && (
        <s.ResultsContainer>
          <s.ResultsHeader>
            Translations for <b>{searchWordRef.current}</b>
            {direction === "toNative" && (
              <s.SpeakButton
                onClick={() => speak(searchWordRef.current, learnedLang)}
                disabled={isSpeaking}
                title="Listen to pronunciation"
              >
                <VolumeUpIcon fontSize="small" />
              </s.SpeakButton>
            )}
          </s.ResultsHeader>

          {translations.map((t, index) => {
            const key = getTranslationKey(t.translation);
            const isAdded = addedTranslations.has(key);
            const isAdding = addingKey === key;
            const state = examplesState[key] || { loading: false, examples: [], error: "" };
            const cardState = cardPreviews[key] || { loading: false, card: null, error: "" };
            const examplesLoading = state.loading;
            const hasExamples = state.examples.length > 0;
            const card = cardState.card;
            // Skip examples for long phrases (4+ words)
            const isLongPhrase = searchWordRef.current.split(/\s+/).length > 3;
            const isReported = reportedTranslations.has(key);
            const isCardLoading = examplesLoading || cardState.loading;

            return (
              <s.TranslationCard key={index}>
                <s.TranslationHeader>
                  <s.TranslationInfo>
                    <s.TranslationRow>
                      <s.TranslationText>{t.translation}</s.TranslationText>
                      {direction === "toLearned" && (
                        <s.SpeakButton
                          onClick={() => speak(t.translation, learnedLang)}
                          disabled={isSpeaking}
                          title="Listen to pronunciation"
                        >
                          <VolumeUpIcon fontSize="small" />
                        </s.SpeakButton>
                      )}
                    </s.TranslationRow>
                    <s.TranslationSource>{t.service_name}</s.TranslationSource>
                  </s.TranslationInfo>

                  {isAdded ? (
                    <s.AddedBadge>
                      <CheckCircleOutlineIcon fontSize="small" />
                      Added
                    </s.AddedBadge>
                  ) : !isLongPhrase ? (
                    <s.AddButton
                      onClick={() => handleAdd(t.translation)}
                      disabled={examplesLoading || cardState.loading || isAdding}
                    >
                      {isAdding ? "Adding..." : examplesLoading || cardState.loading ? "..." : "Add to exercises"}
                    </s.AddButton>
                  ) : null}
                </s.TranslationHeader>

                {!isLongPhrase && (
                  <s.ExamplesSection>
                    {card?.explanation && (
                      <s.CardInfo>
                        <s.CardExplanation>{card.explanation}</s.CardExplanation>
                      </s.CardInfo>
                    )}

                    {(examplesLoading || cardState.loading) && <s.ExamplesLoading>Loading...</s.ExamplesLoading>}

                    {state.error && <s.NoExamples>{state.error}</s.NoExamples>}

                    {!examplesLoading && !cardState.loading && !state.error && !hasExamples && (
                      <s.NoExamples>No examples available</s.NoExamples>
                    )}

                    {hasExamples &&
                      state.examples.map((example, exIndex) => {
                        const wordToHighlight = direction === "toNative" ? searchWordRef.current : t.translation;
                        return (
                          <s.ExampleRow key={exIndex}>
                            <s.ExampleText>{highlightTargetWord(example, wordToHighlight)}</s.ExampleText>
                          </s.ExampleRow>
                        );
                      })}

                    {!isCardLoading && (
                      isReported ? (
                        <s.ReportedBadge>
                          <FlagOutlinedIcon fontSize="small" />
                          Reported
                        </s.ReportedBadge>
                      ) : (
                        <s.ReportButton
                          onClick={() => handleReport(t.translation)}
                          title="Report issue with this translation"
                        >
                          <FlagOutlinedIcon fontSize="small" />
                        </s.ReportButton>
                      )
                    )}
                  </s.ExamplesSection>
                )}
              </s.TranslationCard>
            );
          })}
        </s.ResultsContainer>
      )}
    </>
  );
}
