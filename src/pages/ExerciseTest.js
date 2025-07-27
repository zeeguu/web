import React, { useState, useMemo, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { SpeechContext } from "../contexts/SpeechContext";
import { APIContext } from "../contexts/APIContext";
import { NarrowColumn } from "../components/ColumnWidth.sc";
import { PrivateRouteWithMainNav } from "../PrivateRouteWithMainNav";
import BookmarkProgressBar from "../exercises/progressBars/BookmarkProgressBar";
import * as s from "../exercises/Exercises.sc";

// Import all exercise components
import MultipleChoice from "../exercises/exerciseTypes/multipleChoice/MultipleChoice";
import TranslateL2toL1 from "../exercises/exerciseTypes/translateL2toL1/TranslateL2toL1";
import MultipleChoiceContext from "../exercises/exerciseTypes/multipleChoiceContext/MultipleChoiceContext";
import MultipleChoiceL2toL1 from "../exercises/exerciseTypes/multipleChoiceL2toL1/MultipleChoiceL2toL1";
import FindWordInContextCloze from "../exercises/exerciseTypes/findWordInContextCloze/FindWordInContextCloze";
import Match from "../exercises/exerciseTypes/match/Match";
import SpellWhatYouHear from "../exercises/exerciseTypes/spellWhatYouHear/SpellWhatYouHear";
import TranslateWhatYouHear from "../exercises/exerciseTypes/translateWhatYouHear/TranslateWhatYouHear";
import MultipleChoiceAudio from "../exercises/exerciseTypes/multipleChoiceAudio/MultipleChoiceAudio";
import ClickWordInContext from "../exercises/exerciseTypes/wordInContextExercises/ClickWordInContext";
import FindWordInContext from "../exercises/exerciseTypes/wordInContextExercises/FindWordInContext";
import NextNavigation from "../exercises/exerciseTypes/NextNavigation";

// Mock speech engine
const mockSpeech = {
  stopAudio: () => {},
  speakOut: async (text, callback) => {
    if (callback) callback(true);
    setTimeout(() => {
      if (callback) callback(false);
    }, 1000);
  },
};

// Mock API
const mockApi = {
  wordsSimilarTo: (id, callback) => {
    // Return some mock similar words based on the word
    callback(["word1", "word2", "word3", "word4", "word5"]);
  },
  translateText: (text, fromLang, toLang, callback) => {
    // Mock translation
    callback(`translated_${text}`);
  },
  SCROLL: "SCROLL",
  TRANSLATE_TEXT: "TRANSLATE_TEXT",
};

// Exercise type mapping
const EXERCISE_COMPONENTS = {
  MultipleChoice: MultipleChoice,
  TranslateL2toL1: TranslateL2toL1,
  MultipleChoiceContext: MultipleChoiceContext,
  MultipleChoiceL2toL1: MultipleChoiceL2toL1,
  FindWordInContextCloze: FindWordInContextCloze,
  Match: Match,
  SpellWhatYouHear: SpellWhatYouHear,
  TranslateWhatYouHear: TranslateWhatYouHear,
  MultipleChoiceAudio: MultipleChoiceAudio,
  ClickWordInContext: ClickWordInContext,
  FindWordInContext: FindWordInContext,
};

function createBookmarkFromUrl(word, translation, context, lang = "en") {
  // Tokenize the context and mark the word
  const contextWords = context.split(" ");
  const contextTokenized = contextWords.map((w) => {
    // Remove punctuation for comparison but keep original word
    const cleanWord = w.replace(/[.,!?;:"()]/g, "").toLowerCase();
    const cleanTargetWord = word.toLowerCase();

    return {
      word: w,
      is_marked: cleanWord === cleanTargetWord || cleanWord.includes(cleanTargetWord),
    };
  });

  return {
    id: 1,
    from: word,
    to: translation,
    from_lang: lang,
    context: context,
    context_tokenized: contextTokenized,
    source_id: 1,
    context_identifier: "url_test",
    left_ellipsis: false,
    right_ellipsis: false,
    cooling_interval: 2,
    learning_cycle: 1,
    level: 2,
  };
}

export default function ExerciseTest() {
  const { exerciseType, bookmarkId, word, translation, context, tokenized } = useParams();
  const [isExerciseOver, setIsExerciseOver] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isShowSolution, setIsShowSolution] = useState(false);
  const [message, setMessage] = useState("");
  const [exerciseMessageToAPI, setExerciseMessageToAPI] = useState({});
  const [bookmarkData, setBookmarkData] = useState(null);
  const [loading, setLoading] = useState(false);

  const api = useContext(APIContext);

  // Fetch bookmark data when bookmarkId is provided
  useEffect(() => {
    if (bookmarkId && api) {
      setLoading(true);

      // Check if bookmarkId contains multiple IDs (comma-separated for Match exercises)
      if (bookmarkId.includes(",")) {
        const bookmarkIds = bookmarkId.split(",");
        let fetchedBookmarks = [];
        let fetchCount = 0;

        bookmarkIds.forEach((id, index) => {
          api.getBookmarkWithContext(id.trim(), (data) => {
            fetchedBookmarks[index] = data;
            fetchCount++;

            if (fetchCount === bookmarkIds.length) {
              console.log("Fetched multiple bookmark data:", fetchedBookmarks);
              setBookmarkData(fetchedBookmarks);
              setLoading(false);
            }
          });
        });
      } else {
        // Single bookmark
        api.getBookmarkWithContext(bookmarkId, (data) => {
          console.log("Fetched bookmark data:", data);
          setBookmarkData(data);
          setLoading(false);
        });
      }
    }
  }, [bookmarkId, api]);

  // Decode URL parameters
  const decodedWord = decodeURIComponent(word || "house");
  const decodedTranslation = decodeURIComponent(translation || "casa");
  const decodedContext = decodeURIComponent(context || "I live in a beautiful house with my family.");

  // Use bookmark data from API, tokenized data, or create from URL
  const bookmark = useMemo(() => {
    // If we have bookmark data from API, use that
    if (bookmarkData) {
      // If it's an array (multiple bookmarks for Match), return the first one as primary
      return Array.isArray(bookmarkData) ? bookmarkData[0] : bookmarkData;
    }

    // Fall back to URL-based data
    if (tokenized) {
      try {
        const decodedTokenized = JSON.parse(decodeURIComponent(tokenized));
        return {
          id: 1,
          from: decodedWord,
          to: decodedTranslation,
          from_lang: "en",
          context: decodedContext,
          context_tokenized: decodedTokenized,
          source_id: 1,
          context_identifier: "url_test",
          left_ellipsis: false,
          right_ellipsis: false,
          cooling_interval: 2,
          learning_cycle: 1,
          level: 2,
        };
      } catch (e) {
        console.warn("Failed to parse tokenized data, falling back to generated:", e);
      }
    }
    return createBookmarkFromUrl(decodedWord, decodedTranslation, decodedContext);
  }, [bookmarkData, decodedWord, decodedTranslation, decodedContext, tokenized]);

  // For exercises that need multiple bookmarks (like Match or MultipleChoiceL2toL1)
  const multipleBookmarks = useMemo(() => {
    // If we have multiple bookmarks from API, use those
    if (bookmarkData && Array.isArray(bookmarkData)) {
      return bookmarkData;
    }

    // Fall back to creating multiple bookmarks with different translations
    // For MultipleChoiceL2toL1, we need bookmarks with different 'to' values
    if (exerciseType === "MultipleChoiceL2toL1" && bookmark) {
      return [
        bookmark,
        { ...bookmark, id: (bookmark.id || 1) + 1, to: "wrong_option_1" },
        { ...bookmark, id: (bookmark.id || 1) + 2, to: "wrong_option_2" },
      ];
    }

    // For Match exercises, create different bookmarks entirely
    return [
      bookmark,
      createBookmarkFromUrl("car", "coche", "I drive my car to work every day."),
      createBookmarkFromUrl("book", "libro", "She is reading a good book."),
    ];
  }, [bookmarkData, bookmark, exerciseType]);

  const ExerciseComponent = EXERCISE_COMPONENTS[exerciseType];

  const notifyCorrectAnswer = (bookmark, endExercise = true) => {
    console.log("Correct answer for:", bookmark, "endExercise:", endExercise);
    setIsCorrect(true);
    if (endExercise) {
      setIsExerciseOver(true);
    }
    setMessage("CORRECT");
  };

  const notifyIncorrectAnswer = (bookmark) => {
    console.log("Incorrect answer for:", bookmark);
    setIsCorrect(false);
    setMessage("WRONG");
  };

  const notifyExerciseCompleted = (message, bookmark) => {
    console.log("Exercise completed:", message, bookmark);
  };

  const notifyOfUserAttempt = (message, bookmark) => {
    console.log("User attempt:", message, bookmark);
    setMessage(message);
    const updatedMessages = { ...exerciseMessageToAPI };
    updatedMessages[bookmark.id] = message;
    setExerciseMessageToAPI(updatedMessages);
    return message;
  };

  const showSolution = () => {
    setIsShowSolution(true);
    setIsExerciseOver(true);
    setIsCorrect(false);
  };

  const uploadUserFeedback = (feedback, bookmarkId) => {
    console.log("User feedback:", feedback, "for bookmark:", bookmarkId);
  };

  const goToMoreExercises = () => {
    window.location.href = "/exercises";
  };

  // Show loading state when fetching bookmark data
  if (loading) {
    return (
      <NarrowColumn>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Loading exercise...</h2>
        </div>
      </NarrowColumn>
    );
  }

  if (!ExerciseComponent) {
    return (
      <NarrowColumn>
        <div style={{ padding: "2rem" }}>
          <h1>Exercise Not Found</h1>
          <p>Exercise type "{exerciseType}" is not available.</p>
          <p>Available types: {Object.keys(EXERCISE_COMPONENTS).join(", ")}</p>

          <h3>Test Examples:</h3>
          <ul>
            <li>
              <a href="http://localhost:3000/exercise/TranslateL2toL1/123">
                Single bookmark: TranslateL2toL1 with bookmark ID 123
              </a>
            </li>
            <li>
              <a href="http://localhost:3000/exercise/Match/123,456,789">
                Multiple bookmarks: Match with bookmark IDs 123,456,789
              </a>
            </li>
            <li>
              <a href="http://localhost:3000/exercise/MultipleChoice/456">
                Single bookmark: MultipleChoice with bookmark ID 456
              </a>
            </li>
            <li>
              <a href="http://localhost:3000/exercise-test/TranslateL2toL1/gratis/free/-%20for%20at%20du%20og%20alle%20andre%2C%20helt%20gratis%2C%20kan%20se%20og%20l%C3%A6se%20alt%20det%20indhold%20vi%20producerer.">
                Legacy format: TranslateL2toL1 (still supported)
              </a>
            </li>
          </ul>
        </div>
      </NarrowColumn>
    );
  }

  // Determine which bookmark set to use
  const bookmarksToUse =
    exerciseType === "Match" || exerciseType === "MultipleChoiceL2toL1" ? multipleBookmarks : [bookmark];

  return (
    <APIContext.Provider value={mockApi}>
      <SpeechContext.Provider value={mockSpeech}>
        <NarrowColumn>
          <s.ExercisesColumn>
            <s.ExForm>
              <ExerciseComponent
                bookmarksToStudy={bookmarksToUse}
                selectedExerciseBookmark={bookmark}
                exerciseMessageToAPI={exerciseMessageToAPI[bookmark?.id] || ""}
                notifyCorrectAnswer={notifyCorrectAnswer}
                notifyExerciseCompleted={notifyExerciseCompleted}
                notifyIncorrectAnswer={notifyIncorrectAnswer}
                notifyOfUserAttempt={notifyOfUserAttempt}
                setExerciseType={() => {}}
                reload={false}
                setIsCorrect={setIsCorrect}
                isExerciseOver={isExerciseOver}
                isShowSolution={isShowSolution}
                resetSubSessionTimer={() => {}}
                setSelectedExerciseBookmark={() => {}}
                moveToNextExercise={() => {}}
                bookmarkProgressBar={
                  isExerciseOver ? (
                    <BookmarkProgressBar bookmark={bookmark} message={message} isGreyedOutBar={false} />
                  ) : null
                }
              />
              <NextNavigation
                exerciseType={exerciseType}
                bookmarkMessagesToAPI={exerciseMessageToAPI}
                exerciseBookmarks={bookmarksToUse}
                exerciseBookmark={bookmark}
                moveToNextExercise={goToMoreExercises}
                uploadUserFeedback={uploadUserFeedback}
                reload={false}
                setReload={() => {}}
                handleShowSolution={showSolution}
                toggleShow={() => {}}
                isCorrect={isCorrect}
                isExerciseOver={isExerciseOver}
                nextButtonText="More"
              />
            </s.ExForm>
            <div
              style={{
                marginTop: "2rem",
                textAlign: "center",
                fontSize: "0.75rem",
                color: "#999",
                opacity: 0.8,
              }}
            >
              {exerciseType}
            </div>
          </s.ExercisesColumn>
        </NarrowColumn>
      </SpeechContext.Provider>
    </APIContext.Provider>
  );
}
