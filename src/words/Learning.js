import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import LoadingAnimation from "../components/LoadingAnimation";
import EmptyState from "../components/EmptyState";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Word from "./Word";
import { WEB_READER } from "../reader/ArticleReader";
import CollapsablePanel from "../components/CollapsablePanel";
import { StyledButton } from "../components/allButtons.sc";
import AddCustomWordModal from "./AddCustomWordModal";
import Tooltip from "../components/TooltipWrapper";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import { APIContext } from "../contexts/APIContext";
import { ExercisesCounterContext } from "../exercises/ExercisesCounterContext";
import useUserPreferences from "../hooks/useUserPreferences";

const LEVEL_DESCRIPTIONS = {
  0: "Not yet practiced",
  1: "Recognize (match, multiple choice)",
  2: "Recognize (multiple choice, context, audio)",
  3: "Recall (type translations)",
  4: "Productive recall (spell, fill in blanks)",
};

export default function Learning() {
  const api = useContext(APIContext);

  const { updateExercisesCounter } = useContext(ExercisesCounterContext);
  const { maxWordsToSchedule } = useUserPreferences(api);

  const [inLearning, setInLearning] = useState(null);
  const [inLearning_byLevel, setInLearning_byLevel] = useState(null);
  const [nextInLearning, setNextInLearning] = useState(false);
  const [showAddWordModal, setShowAddWordModal] = useState(false);

  useEffect(() => {
    api.getAllScheduledBookmarks(false, (bookmarks) => {
      setInLearning(bookmarks);

      let words_byLevel = { 0: [], 1: [], 2: [], 3: [], 4: [] };
      bookmarks.forEach((word) => {
        words_byLevel[word.level] = [...words_byLevel[word.level], word];
      });

      // Order by rank within the levels
      [4, 3, 2, 1, 0].forEach((level) => {
        words_byLevel[level] = words_byLevel[level].sort((a, b) => a.origin_rank - b.origin_rank);
      });

      setInLearning_byLevel(words_byLevel);
    });

    api.getBookmarksNextInLearning((bookmarks) => {
      setNextInLearning(bookmarks);
      console.log(bookmarks);
    });

    setTitle(strings.titleToLearnWords);
  }, [api]);

  function onNotifyDelete(bookmark) {
    let newWords = [...inLearning].filter((b) => b.id !== bookmark.id);
    setInLearning(newWords);
    updateExercisesCounter();
  }

  function onWordRemovedFromExercises(reason, bookmarkId) {
    // Find the bookmark in the current list
    const bookmark = inLearning.find((b) => b.id === bookmarkId);
    if (bookmark) {
      // Remove the word from the list with animation
      onNotifyDelete(bookmark);

      // Also update the grouped by level data
      let newWords_byLevel = { ...inLearning_byLevel };
      const level = bookmark.level;
      newWords_byLevel[level] = newWords_byLevel[level].filter((b) => b.id !== bookmarkId);
      setInLearning_byLevel(newWords_byLevel);
    }
  }

  function refreshWordList() {
    // Refresh the word list after adding a custom word
    api.getAllScheduledBookmarks(false, (bookmarks) => {
      setInLearning(bookmarks);

      let words_byLevel = { 0: [], 1: [], 2: [], 3: [], 4: [] };
      bookmarks.forEach((word) => {
        words_byLevel[word.level] = [...words_byLevel[word.level], word];
      });

      // Order by rank within the levels
      [4, 3, 2, 1, 0].forEach((level) => {
        words_byLevel[level] = words_byLevel[level].sort((a, b) => a.origin_rank - b.origin_rank);
      });

      setInLearning_byLevel(words_byLevel);
    });

    updateExercisesCounter();
  }

  function handleAddCustomWord() {
    setShowAddWordModal(false);
    refreshWordList();
  }

  if (!inLearning || !inLearning_byLevel || !nextInLearning) {
    return <LoadingAnimation />;
  }

  function topMessage(level, count) {
    return (
      <>
        Level {level}: {LEVEL_DESCRIPTIONS[level]}{" "}
        <span style={{ color: "gray", fontWeight: "lighter" }}>
          ({count} {count === 1 ? "word" : "words"})
        </span>
        {level === 1 && (
          <Tooltip label="Words progress through 4 levels with increasingly harder exercises. Answer correctly on two different days to advance to the next level.">
            <HelpOutlineIcon style={{ fontSize: "1em", marginLeft: "0.3em", color: "#888", cursor: "help", verticalAlign: "middle" }} />
          </Tooltip>
        )}
      </>
    );
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1em", marginLeft: "1em" }}>
        <p style={{ margin: "0 1em 0 0", fontSize: "0.9em", color: "#555" }}>
          Words you translate while reading are automatically scheduled for exercises and shown here. You can also add words manually.
        </p>
        <StyledButton onClick={() => setShowAddWordModal(true)} style={{ whiteSpace: "nowrap" }}>+ Add</StyledButton>
      </div>

      {showAddWordModal && (
        <AddCustomWordModal onClose={() => setShowAddWordModal(false)} onSuccess={handleAddCustomWord} />
      )}

      <>
        {inLearning.length === 0 && (
          <EmptyState
            message="No words in your exercises yet. Translate words while reading to add them."
            fillHeight={false}
          />
        )}

        {[1, 2, 3, 4].map(
          (level) =>
            inLearning_byLevel[level].length > 0 && (
              <CollapsablePanel
                key={level}
                topMessage={topMessage(level, inLearning_byLevel[level].length)}
              >
                {inLearning_byLevel[level].map((each) => (
                  <Word
                    key={each.id}
                    bookmark={each}
                    source={WEB_READER}
                    notifyDelete={onNotifyDelete}
                    onWordRemovedFromExercises={onWordRemovedFromExercises}
                    showRanking={true}
                    isOnCongratulationsPage={false}
                  />
                ))}
              </CollapsablePanel>
            ),
        )}
      </>

      <br />

      {nextInLearning.length > 0 && (
        <>
          <h1>Next in exercises...</h1>
          <p>
            These words will be added to your exercises soon. They come from your translations and are prioritized by
            how frequently they appear in the language you're learning.
          </p>
          {inLearning.length >= maxWordsToSchedule && (
            <p>
              You can have up to {maxWordsToSchedule} words in learning at a given moment.{" "}
              <Link to="/account_settings/exercise_scheduling">Change this in settings</Link>.
            </p>
          )}
          {nextInLearning.map((each) => (
            <Word
              key={each.id}
              bookmark={each}
              source={WEB_READER}
              notifyDelete={onNotifyDelete}
              showRanking={true}
              isGrayedOut={true}
            />
          ))}
          <br />
          <br />
        </>
      )}
    </>
  );
}
