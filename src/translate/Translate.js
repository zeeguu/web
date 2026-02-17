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
import { languageNames } from "../utils/languageDetection";
import * as s from "./Translate.sc";

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

  const [searchWord, setSearchWord] = useState("");
  const [translations, setTranslations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  // Track which direction is active: "toNative" (learned→native) or "toLearned" (native→learned)
  const [activeDirection, setActiveDirection] = useState(null);
  // Track if user manually switched direction (vs auto-detected)
  const [isManualDirection, setIsManualDirection] = useState(false);
  // Store results for both directions so user can switch
  const [bothResults, setBothResults] = useState({ toNative: [], toLearned: [] });

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
  const formRef = useRef(null);

  useEffect(() => {
    setTitle("Translate");
  }, []);

  // Handle searchWord passed from history navigation
  useEffect(() => {
    if (location.state?.searchWord) {
      setSearchWord(location.state.searchWord);
      // Trigger search after state is set
      setTimeout(() => {
        formRef.current?.requestSubmit();
      }, 0);
      // Clear the state so refreshing doesn't re-trigger
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  function getTranslationKey(translation) {
    return translation.toLowerCase();
  }

  function switchDirection() {
    const newDirection = activeDirection === "toNative" ? "toLearned" : "toNative";
    const newTranslations = newDirection === "toNative" ? bothResults.toNative : bothResults.toLearned;

    if (newTranslations.length === 0) return; // Can't switch if no results in other direction

    setActiveDirection(newDirection);
    setIsManualDirection(true);
    setTranslations(newTranslations);
    // Don't clear examplesState/cardPreviews - keep cached data for when user switches back

    // Only fetch examples for translations we haven't fetched yet
    const word = searchWordRef.current;
    const wordCount = word.split(/\s+/).length;
    if (wordCount <= 3) {
      // Examples should ALWAYS be in the learned language
      newTranslations.forEach((t) => {
        const displayKey = getTranslationKey(t.translation);
        // Only fetch if we don't already have examples for this translation
        if (!examplesState[displayKey]) {
          if (newDirection === "toNative") {
            // Generate examples for the searched word (learned lang)
            fetchExamplesForTranslation(displayKey, word, t.translation, learnedLang, nativeLang);
          } else {
            // Generate examples for the translation (learned lang)
            fetchExamplesForTranslation(displayKey, t.translation, word, learnedLang, nativeLang);
          }
        }
      });
    }
  }

  function canSwitchDirection() {
    const otherResults = activeDirection === "toNative" ? bothResults.toLearned : bothResults.toNative;
    return otherResults.length > 0;
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

  function handleSearch(e) {
    e.preventDefault();
    if (!searchWord.trim()) return;

    const word = searchWord.trim();

    // Validate input
    if (!isValidWord(word)) {
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
    setActiveDirection(null);
    setIsManualDirection(false);
    setBothResults({ toNative: [], toLearned: [] });

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

    // Call both directions in parallel
    const toNativePromise = api
      .getMultipleTranslations(learnedLang, nativeLang, word, "", 10, null, null, null, false, null)
      .then((r) => r.json());

    const toLearnedPromise = api
      .getMultipleTranslations(nativeLang, learnedLang, word, "", 10, null, null, null, false, null)
      .then((r) => r.json());

    Promise.all([toNativePromise, toLearnedPromise])
      .then(([toNativeData, toLearnedData]) => {
        setIsLoading(false);

        const toNativeResults = filterTranslations(toNativeData, word);
        const toLearnedResults = filterTranslations(toLearnedData, word);

        // Store both results so user can switch
        setBothResults({ toNative: toNativeResults, toLearned: toLearnedResults });

        // Pick initial direction based on which has results
        // Prefer native→learned when both have results (user wants to learn new words)
        let direction;
        if (toNativeResults.length > 0 && toLearnedResults.length === 0) {
          direction = "toNative";
        } else if (toLearnedResults.length > 0) {
          direction = "toLearned";
        } else {
          direction = null;
        }

        const finalTranslations = direction === "toNative" ? toNativeResults : toLearnedResults;
        setTranslations(finalTranslations);
        setActiveDirection(direction);

        // Auto-fetch examples for each translation (skip for long phrases)
        const wordCount = word.split(/\s+/).length;
        if (wordCount <= 3 && finalTranslations.length > 0) {
          // Examples should ALWAYS be in the learned language
          // displayKey is based on what's shown in the UI (t.translation)
          // When toNative: word is learned, translation is native → examples for word
          // When toLearned: translation is learned, word is native → examples for translation
          finalTranslations.forEach((t) => {
            const displayKey = getTranslationKey(t.translation);
            if (direction === "toNative") {
              // User searched in learned language, got native translation
              // Generate examples for the searched word (learned lang)
              fetchExamplesForTranslation(displayKey, word, t.translation, learnedLang, nativeLang);
            } else {
              // User searched in native language, got learned translation
              // Generate examples for the translation (learned lang)
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
    // When toNative: searched word is learned, translation is native
    // When toLearned: searched word is native, translation is learned (swap them)
    const wordToLearn = activeDirection === "toNative" ? searchedWord : translation;
    const nativeTranslation = activeDirection === "toNative" ? translation : searchedWord;

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

    const wordToReport = activeDirection === "toNative" ? searchedWord : translation;
    const translationToReport = activeDirection === "toNative" ? translation : searchedWord;

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
      <form ref={formRef} onSubmit={handleSearch}>
        <s.LabelRow>
          <s.Label>Enter word or phrase</s.Label>
          {activeDirection && (
            <s.LanguageDetected>
              {languageNames[activeDirection === "toNative" ? learnedLang : nativeLang] || (activeDirection === "toNative" ? learnedLang : nativeLang)}
              {" "}
              <s.DetectionMode>({isManualDirection ? "manual" : "auto"})</s.DetectionMode>
              {canSwitchDirection() && (
                <s.SwitchLink type="button" onClick={switchDirection}>switch</s.SwitchLink>
              )}
            </s.LanguageDetected>
          )}
        </s.LabelRow>
        <s.SearchContainer>
          <InputField
            id="translate-input"
            placeholder="e.g., hund, bonjour, casa..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            autoFocus
          />
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
            {activeDirection === "toNative" && (
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
            const isLoading = examplesLoading || cardState.loading;

            return (
              <s.TranslationCard key={index}>
                <s.TranslationHeader>
                  <s.TranslationInfo>
                    <s.TranslationRow>
                      <s.TranslationText>{t.translation}</s.TranslationText>
                      {activeDirection === "toLearned" && (
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
                        // Highlight the word being learned (in learned language)
                        // toNative: searched word is in learned lang
                        // toLearned: translation (t.translation) is in learned lang
                        const wordToHighlight = activeDirection === "toNative" ? searchWordRef.current : t.translation;
                        return (
                          <s.ExampleRow key={exIndex}>
                            <s.ExampleText>{highlightTargetWord(example, wordToHighlight)}</s.ExampleText>
                          </s.ExampleRow>
                        );
                      })}

                    {!isLoading && (
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
