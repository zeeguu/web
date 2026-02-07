import React, { useContext, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import { ExercisesCounterContext } from "../exercises/ExercisesCounterContext";
import { setTitle } from "../assorted/setTitle";
import LoadingAnimation from "../components/LoadingAnimation";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
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

  const fromLang = userDetails?.learned_language;
  const toLang = userDetails?.native_language;

  const [searchWord, setSearchWord] = useState("");
  const [translations, setTranslations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  // Examples state: { translationKey: { loading: bool, examples: [], error: string } }
  const [examplesState, setExamplesState] = useState({});
  // Added translations: Set of translation keys
  const [addedTranslations, setAddedTranslations] = useState(new Set());
  // Which translation is currently being added (loading state)
  const [addingKey, setAddingKey] = useState(null);

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
    setAddedTranslations(new Set());
    setAddingKey(null);

    api.getMultipleTranslations(
      fromLang,
      toLang,
      word,
      "", // empty context for dictionary lookup
      10,
      null,
      null,
      null,
      false,
      null,
    ).then((response) => {
      return response.json();
    }).then((data) => {
      setIsLoading(false);
      if (data && data.translations) {
        // Remove duplicates and filter out malformed responses
        const seen = new Set();
        const uniqueTranslations = data.translations.filter((t) => {
          if (t.translation.length > 100) return false;
          const key = t.translation.toLowerCase();
          if (seen.has(key)) return false;
          // Skip if translation is just echoing the input (nothing found)
          if (!isValidTranslation(t.translation, word)) return false;
          seen.add(key);
          return true;
        });
        setTranslations(uniqueTranslations);

        // Auto-fetch examples for each translation (skip for long phrases)
        const wordCount = word.split(/\s+/).length;
        if (wordCount <= 3) {
          uniqueTranslations.forEach((t) => {
            fetchExamplesForTranslation(word, t.translation);
          });
        }
      } else {
        setTranslations([]);
      }
    }).catch((err) => {
      setIsLoading(false);
      setError("Failed to get translations. Please try again.");
      console.error(err);
    });
  }

  function fetchExamplesForTranslation(word, translation) {
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

  function handleAdd(translation) {
    const key = getTranslationKey(translation);
    const state = examplesState[key];

    if (state?.loading) {
      toast.error("Please wait for examples to load");
      return;
    }

    const examples = state?.examples || [];
    const word = searchWordRef.current;

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
        toast.success(
          <div>
            <div><strong>{card.word}</strong> = {card.translation}</div>
            {card.explanation && (
              <div style={{ fontSize: "0.85em", marginTop: "4px", opacity: 0.9 }}>
                {card.explanation}
              </div>
            )}
          </div>,
          { autoClose: 6000 }
        );
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
      <s.PageTitle>Translate</s.PageTitle>

      <form onSubmit={handleSearch}>
        <s.SearchContainer>
          <s.SearchInput
            id="translate-input"
            label="Enter word or phrase"
            placeholder="e.g., hund, bonjour, casa..."
            variant="outlined"
            fullWidth
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
          <s.ResultsHeader>Translations for "{searchWordRef.current}":</s.ResultsHeader>

          {translations.map((t, index) => {
            const key = getTranslationKey(t.translation);
            const isAdded = addedTranslations.has(key);
            const isAdding = addingKey === key;
            const state = examplesState[key] || { loading: false, examples: [], error: "" };
            const examplesLoading = state.loading;
            const hasExamples = state.examples.length > 0;
            // Skip examples for long phrases (4+ words)
            const isLongPhrase = searchWordRef.current.split(/\s+/).length > 3;

            return (
              <s.TranslationCard key={index}>
                <s.TranslationHeader>
                  <s.TranslationInfo>
                    <s.TranslationText>{t.translation}</s.TranslationText>
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
                      disabled={examplesLoading || isAdding}
                    >
                      {isAdding ? "Adding..." : examplesLoading ? "..." : "Add to exercises"}
                    </s.AddButton>
                  ) : null}
                </s.TranslationHeader>

                {!isLongPhrase && (
                  <s.ExamplesSection>
                    {examplesLoading && (
                      <s.ExamplesLoading>Loading examples...</s.ExamplesLoading>
                    )}

                    {state.error && (
                      <s.NoExamples>{state.error}</s.NoExamples>
                    )}

                    {!examplesLoading && !state.error && !hasExamples && (
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
