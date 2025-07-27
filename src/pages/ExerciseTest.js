import React, { useState, useMemo } from "react";
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
  "MultipleChoice": MultipleChoice,
  "TranslateL2toL1": TranslateL2toL1,
  "MultipleChoiceContext": MultipleChoiceContext,
  "MultipleChoiceL2toL1": MultipleChoiceL2toL1,
  "FindWordInContextCloze": FindWordInContextCloze,
  "Match": Match,
  "SpellWhatYouHear": SpellWhatYouHear,
  "TranslateWhatYouHear": TranslateWhatYouHear,
  "MultipleChoiceAudio": MultipleChoiceAudio,
  "ClickWordInContext": ClickWordInContext,
  "FindWordInContext": FindWordInContext,
};

function createBookmarkFromUrl(word, translation, context, lang = "en") {
  // Tokenize the context and mark the word
  const contextWords = context.split(" ");
  const contextTokenized = contextWords.map(w => {
    // Remove punctuation for comparison but keep original word
    const cleanWord = w.replace(/[.,!?;:"()]/g, '').toLowerCase();
    const cleanTargetWord = word.toLowerCase();
    
    return {
      word: w,
      is_marked: cleanWord === cleanTargetWord || cleanWord.includes(cleanTargetWord)
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
  const { exerciseType, word, translation, context, tokenized } = useParams();
  const [isExerciseOver, setIsExerciseOver] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isShowSolution, setIsShowSolution] = useState(false);
  const [message, setMessage] = useState("");
  const [exerciseMessageToAPI, setExerciseMessageToAPI] = useState({});

  // Decode URL parameters
  const decodedWord = decodeURIComponent(word || "house");
  const decodedTranslation = decodeURIComponent(translation || "casa");
  const decodedContext = decodeURIComponent(context || "I live in a beautiful house with my family.");
  
  // Use tokenized data if available, otherwise create it
  const bookmark = useMemo(() => {
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
  }, [decodedWord, decodedTranslation, decodedContext, tokenized]);

  // For exercises that need multiple bookmarks (like Match)
  const multipleBookmarks = useMemo(() => [
    bookmark,
    createBookmarkFromUrl("car", "coche", "I drive my car to work every day."),
    createBookmarkFromUrl("book", "libro", "She is reading a good book.")
  ], [bookmark]);

  const ExerciseComponent = EXERCISE_COMPONENTS[exerciseType];

  const notifyCorrectAnswer = (bookmark) => {
    console.log("Correct answer for:", bookmark);
    setIsCorrect(true);
    setIsExerciseOver(true);
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

  const resetExercise = () => {
    setIsExerciseOver(false);
    setIsCorrect(null);
    setIsShowSolution(false);
    setMessage("");
    setExerciseMessageToAPI({});
  };

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
              <a href="http://localhost:3000/exercise-test/TranslateL2toL1/gratis/free/-%20for%20at%20du%20og%20alle%20andre%2C%20helt%20gratis%2C%20kan%20se%20og%20l%C3%A6se%20alt%20det%20indhold%20vi%20producerer./%5B%5B%5B%7B%22text%22%3A%22-%22%2C%22is_sent_start%22%3Atrue%2C%22is_punct%22%3Atrue%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A0%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22for%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A1%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22at%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A2%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22du%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A3%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22og%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A4%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22alle%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A5%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22andre%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A6%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Afalse%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22%2C%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Atrue%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A7%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22helt%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A8%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22gratis%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A9%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Afalse%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22%2C%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Atrue%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A10%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22kan%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A11%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22se%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A12%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22og%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A13%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22l%C3%A6se%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A14%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22alt%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A15%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22det%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A16%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22indhold%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A17%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22vi%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A18%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22producerer%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A19%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Afalse%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22.%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Atrue%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A20%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Afalse%2C%22pos%22%3Anull%7D%5D%5D%5D">
                TranslateL2toL1: gratis → free (Danish with full tokenized context)
              </a>
            </li>
            <li>
              <a href="http://localhost:3000/exercise-test/TranslateWhatYouHear/%C3%A6ldre/older/Kampdag%20%E2%80%94%20Tilbud%20om%20dates%20med%20%C3%A6ldre%20kollegaer%20og%20upassende%20kommentarer%20om%20krop%2C%20udseende%20eller%20privatliv./%5B%5B%5B%7B%22text%22%3A%22Kampdag%22%2C%22is_sent_start%22%3Atrue%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A0%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22%E2%80%94%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Atrue%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A1%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22Tilbud%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A2%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22om%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A3%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22dates%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A4%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22med%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A5%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22%C3%A6ldre%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A6%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22kollegaer%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A7%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22og%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A8%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22upassende%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A9%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22kommentarer%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A10%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22om%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A11%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22krop%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A12%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Afalse%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22%2C%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Atrue%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A13%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22udseende%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A14%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22eller%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A15%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Atrue%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22privatliv%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Afalse%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A16%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Afalse%2C%22pos%22%3Anull%7D%2C%7B%22text%22%3A%22.%22%2C%22is_sent_start%22%3Afalse%2C%22is_punct%22%3Atrue%2C%22is_symbol%22%3Afalse%2C%22is_left_punct%22%3Afalse%2C%22is_right_punct%22%3Afalse%2C%22is_like_num%22%3Afalse%2C%22sent_i%22%3A0%2C%22token_i%22%3A17%2C%22paragraph_i%22%3A0%2C%22is_like_email%22%3Afalse%2C%22is_like_url%22%3Afalse%2C%22has_space%22%3Afalse%2C%22pos%22%3Anull%7D%5D%5D%5D">
                TranslateWhatYouHear: ældre → older (Danish audio exercise)
              </a>
            </li>
          </ul>
        </div>
      </NarrowColumn>
    );
  }

  // Determine which bookmark set to use
  const bookmarksToUse = exerciseType === "Match" ? multipleBookmarks : [bookmark];

  return (
    <APIContext.Provider value={mockApi}>
      <SpeechContext.Provider value={mockSpeech}>
        <NarrowColumn>
          <s.ExercisesColumn>
            <s.ExForm>
              <ExerciseComponent
                bookmarksToStudy={bookmarksToUse}
                selectedExerciseBookmark={bookmark}
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
                  <BookmarkProgressBar
                    bookmark={bookmark}
                    message={message}
                    isGreyedOutBar={false}
                  />
                }
              />
              <NextNavigation
                exerciseType={exerciseType}
                bookmarkMessagesToAPI={exerciseMessageToAPI}
                exerciseBookmarks={bookmarksToUse}
                exerciseBookmark={bookmark}
                moveToNextExercise={resetExercise}
                uploadUserFeedback={uploadUserFeedback}
                reload={false}
                setReload={() => {}}
                handleShowSolution={showSolution}
                toggleShow={() => {}}
                isCorrect={isCorrect}
                isExerciseOver={isExerciseOver}
              />
            </s.ExForm>
            <div style={{ 
              marginTop: "2rem", 
              textAlign: "center", 
              fontSize: "0.75rem", 
              color: "#999",
              opacity: 0.8
            }}>
              {exerciseType}
            </div>
          </s.ExercisesColumn>
        </NarrowColumn>
      </SpeechContext.Provider>
    </APIContext.Provider>
  );
}