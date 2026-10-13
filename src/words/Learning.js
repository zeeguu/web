import React, { useContext, useEffect, useState } from "react";

import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import { StyledButton } from "../components/allButtons.sc";
import AddCustomWordModal from "./AddCustomWordModal";
import LearningLists from "./wordLists/LearningLists";

import { APIContext } from "../contexts/APIContext";
import { ExercisesCounterContext } from "../exercises/ExercisesCounterContext";
import useUserPreferences from "../hooks/useUserPreferences";

export default function Learning() {
  const api = useContext(APIContext);

  const { updateExercisesCounter } = useContext(ExercisesCounterContext);
  const { maxWordsToSchedule } = useUserPreferences(api);

  const [inLearning, setInLearning] = useState(null);
  const [nextInLearning, setNextInLearning] = useState(false);
  const [showAddWordModal, setShowAddWordModal] = useState(false);

  useEffect(() => {
    api.getAllScheduledBookmarks(false, (bookmarks) => {
      // Handle API errors - bookmarks will be null if request failed
      setInLearning(bookmarks || []);
    });

    api.getBookmarksNextInLearning((bookmarks) => {
      // Handle API errors - bookmarks will be null if request failed
      setNextInLearning(bookmarks || []);
    });

    setTitle(strings.titleToLearnWords);
  }, [api]);

  function onNotifyDelete(bookmark) {
    let newWords = [...inLearning].filter((b) => b.id !== bookmark.id);
    setInLearning(newWords);
    updateExercisesCounter();
  }

  function onWordRemovedFromExercises(reason, bookmarkId) {
    const bookmark = inLearning.find((b) => b.id === bookmarkId);
    if (bookmark) onNotifyDelete(bookmark);
  }

  function refreshWordList() {
    // Refresh the word list after adding a custom word
    api.getAllScheduledBookmarks(false, (bookmarks) => setInLearning(bookmarks || []));

    updateExercisesCounter();
  }

  function handleAddCustomWord() {
    setShowAddWordModal(false);
    refreshWordList();
  }

  if (!inLearning || !nextInLearning) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1em",
          marginLeft: "1em",
        }}
      >
        <p style={{ margin: "0 1em 0 0", fontSize: "0.9em", color: "var(--text-secondary)" }}>
          Words you translate while reading are automatically scheduled for exercises and shown here. You can also add
          words manually.
        </p>
        <StyledButton
          onClick={() => setShowAddWordModal(true)}
          style={{ whiteSpace: "nowrap", backgroundColor: "var(--btn-bg)" }}
        >
          + Add
        </StyledButton>
      </div>

      {showAddWordModal && (
        <AddCustomWordModal onClose={() => setShowAddWordModal(false)} onSuccess={handleAddCustomWord} />
      )}

      <LearningLists
        inLearning={inLearning}
        nextInLearning={nextInLearning}
        maxWordsToSchedule={maxWordsToSchedule}
        notifyDelete={onNotifyDelete}
        onWordRemovedFromExercises={onWordRemovedFromExercises}
      />
    </>
  );
}
