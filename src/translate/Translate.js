import React, { useContext, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import { ExercisesCounterContext } from "../exercises/ExercisesCounterContext";
import { setTitle } from "../assorted/setTitle";
import useSpeech from "../hooks/useSpeech";
import InputField from "../components/InputField";
import LoadingAnimation from "../components/LoadingAnimation";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import * as s from "./Translate.sc";

// Highlight the target word(s) in a sentence - handles MWEs (multi-word expressions)
function highlightTargetWord(sentence, targetWord) {
  if (!sentence || !targetWord) return sentence;

  // Split target into individual words for MWE support
  const targetWords = targetWord.trim().split(/\s+/);

  // Build stems for each word (first 4 chars for fuzzy matching)
  const stems = targetWords.map(word => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return escaped.slice(0, Math.min(4, escaped.length)).toLowerCase();
  });

  // Build regex that matches any of the word stems
  const stemPatterns = stems.map(stem => `\\b${stem}\\p{L}*`).join("|");
  const regex = new RegExp(`(${stemPatterns})`, "giu");

  return sentence.split(regex).map((part, index) => {
    const partLower = part.toLowerCase();
    // Check if this part matches any of our stems
    const isMatch = stems.some(stem =>
      partLower.startsWith(stem) && part.match(/^\p{L}+$/u)
    );

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

  const learnedLang = userDetails?.learned_language;
  const nativeLang = userDetails?.native_language;

  const [searchWord, setSearchWord] = useState("");
  const [translations, setTranslations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  // Track which direction was detected: "toNative" (learned→native) or "toLearned" (native→learned)
  const [detectedDirection, setDetectedDirection] = useState(null);

  // Examples state: { translationKey: { loading: bool, examples: [], error: string } }
  const [examplesState, setExamplesState] = useState({});
  // Learning card previews: { translationKey: { loading: bool, card: {...}, error: string } }
  const [cardPreviews, setCardPreviews] = useState({});
  // Added translations: Set of translation keys
  const [addedTranslations, setAddedTranslations] = useState(new Set());
  // Which translation is currently being added (loading state)
  const [addingKey, setAddingKey] = useState(null);

  const { speak, isSpeaking } = useSpeech();
  const searchWordRef = useRef("");

  useEffect(() => {
    setTitle("Translate");
  }, []);

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
    setDetectedDirection(null);

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
    const toNativePromise = api.getMultipleTranslations(
      learnedLang, nativeLang, word, "", 10, null, null, null, false, null
    ).then(r => r.json());

    const toLearnedPromise = api.getMultipleTranslations(
      nativeLang, learnedLang, word, "", 10, null, null, null, false, null
    ).then(r => r.json());

    Promise.all([toNativePromise, toLearnedPromise])
      .then(([toNativeData, toLearnedData]) => {
        setIsLoading(false);

        const toNativeResults = filterTranslations(toNativeData, word);
        const toLearnedResults = filterTranslations(toLearnedData, word);

        // Pick the direction that returned meaningful results
        // Prefer toNative if both have results (user is likely looking up a word they're learning)
        let finalTranslations;
        let direction;

        if (toNativeResults.length > 0 && toLearnedResults.length === 0) {
          finalTranslations = toNativeResults;
          direction = "toNative";
        } else if (toLearnedResults.length > 0 && toNativeResults.length === 0) {
          finalTranslations = toLearnedResults;
          direction = "toLearned";
        } else if (toNativeResults.length > 0 && toLearnedResults.length > 0) {
          // Both have results - prefer native→learned (user wants to learn new words)
          finalTranslations = toLearnedResults;
          direction = "toLearned";
        } else {
          finalTranslations = [];
          direction = null;
        }

        setTranslations(finalTranslations);
        setDetectedDirection(direction);

        // Auto-fetch examples for each translation (skip for long phrases)
        const wordCount = word.split(/\s+/).length;
        if (wordCount <= 3 && finalTranslations.length > 0) {
          const fromLang = direction === "toNative" ? learnedLang : nativeLang;
          const toLang = direction === "toNative" ? nativeLang : learnedLang;
          finalTranslations.forEach((t) => {
            fetchExamplesForTranslation(word, t.translation, fromLang, toLang);
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setError("Failed to get translations. Please try again.");
        console.error(err);
      });
  }

  function fetchExamplesForTranslation(word, translation, fromLang, toLang) {
    const key = getTranslationKey(translation);

    setExamplesState((prev) => ({
      ...prev,
      [key]: { loading: true, examples: [], error: "" },
    }));

    api.getGeneratedExamples(
      word,
      fromLang,
      toLang,
      (examples) => {
        // Extract just the sentence text from examples (may be objects or strings)
        const exampleSentences = (examples || []).map(ex =>
          typeof ex === 'string' ? ex : ex.sentence || ex
        );
        setExamplesState((prev) => ({
          ...prev,
          [key]: { loading: false, examples: exampleSentences, error: "" },
        }));

        // Now fetch the learning card preview with the examples
        fetchCardPreview(word, translation, fromLang, toLang, exampleSentences);
      },
      () => {
        setExamplesState((prev) => ({
          ...prev,
          [key]: { loading: false, examples: [], error: "Could not load examples" },
        }));
      },
      translation  // Pass translation for meaning-specific examples
    );
  }

  function fetchCardPreview(word, translation, fromLang, toLang, examples) {
    const key = getTranslationKey(translation);

    setCardPreviews((prev) => ({
      ...prev,
      [key]: { loading: true, card: null, error: "" },
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
          [key]: { loading: false, card: card, error: "" },
        }));
      },
      () => {
        setCardPreviews((prev) => ({
          ...prev,
          [key]: { loading: false, card: null, error: "" },
        }));
      }
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
    const word = searchWordRef.current;

    // Use detected direction for language codes
    const fromLang = detectedDirection === "toNative" ? learnedLang : nativeLang;
    const toLang = detectedDirection === "toNative" ? nativeLang : learnedLang;

    setAddingKey(key);

    api.addWordToLearning(
      word,
      translation,
      fromLang,
      toLang,
      examples,
      (result) => {
        setAddingKey(null);
        setAddedTranslations((prev) => new Set([...prev, key]));
        updateExercisesCounter();

        const card = result.learning_card;
        toast.success(`Added "${card.word}" to exercises`);
      },
      (error) => {
        setAddingKey(null);
        const message = error?.detail || error?.error || "Failed to add word";
        toast.error(message);
      }
    );
  }

  return (
    <>
      <form onSubmit={handleSearch}>
        <s.SearchContainer>
          <InputField
            id="translate-input"
            label="Enter word or phrase"
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
            Translations for "{searchWordRef.current}"
            {detectedDirection === "toNative" && (
              <s.SpeakButton
                onClick={() => speak(searchWordRef.current, learnedLang)}
                disabled={isSpeaking}
                title="Listen to pronunciation"
              >
                <VolumeUpIcon fontSize="small" />
              </s.SpeakButton>
            )}
            {detectedDirection && (
              <s.DirectionLabel>
                {detectedDirection === "toNative"
                  ? `${learnedLang} → ${nativeLang}`
                  : `${nativeLang} → ${learnedLang}`}
              </s.DirectionLabel>
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

            return (
              <s.TranslationCard key={index}>
                <s.TranslationHeader>
                  <s.TranslationInfo>
                    <s.TranslationRow>
                      <s.TranslationText>{t.translation}</s.TranslationText>
                      {detectedDirection === "toLearned" && (
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
                      {isAdding ? "Adding..." : (examplesLoading || cardState.loading) ? "..." : "Add to exercises"}
                    </s.AddButton>
                  ) : null}
                </s.TranslationHeader>

                {!isLongPhrase && (
                  <s.ExamplesSection>
                    {card && card.explanation && (
                      <s.CardExplanation>{card.explanation}</s.CardExplanation>
                    )}

                    {card && card.level_note && (
                      <s.LevelNote>{card.level_note}</s.LevelNote>
                    )}

                    {(examplesLoading || cardState.loading) && (
                      <s.ExamplesLoading>Loading...</s.ExamplesLoading>
                    )}

                    {state.error && (
                      <s.NoExamples>{state.error}</s.NoExamples>
                    )}

                    {!examplesLoading && !cardState.loading && !state.error && !hasExamples && (
                      <s.NoExamples>No examples available</s.NoExamples>
                    )}

                    {hasExamples && state.examples.map((example, exIndex) => (
                      <s.ExampleRow key={exIndex}>
                        <s.ExampleText>
                          {highlightTargetWord(example, searchWordRef.current)}
                        </s.ExampleText>
                      </s.ExampleRow>
                    ))}
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
