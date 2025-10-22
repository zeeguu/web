import * as s from "./Word.sc";

import { useContext, useState } from "react";
import SpeakButton from "../exercises/exerciseTypes/SpeakButton";
import EditBookmarkButton from "./EditBookmarkButton";
import { darkGrey } from "../components/colors";
import { CenteredRow } from "../exercises/exerciseTypes/Exercise.sc";
import { USER_WORD_PREFERENCE } from "./userBookmarkPreferences";
import { MAX_WORDS_IN_BOOKMARK_FOR_EXERCISES } from "../exercises/ExerciseConstants";
import { getStaticPath } from "../utils/misc/staticPath";
import { APIContext } from "../contexts/APIContext";
import PhraseTypeBadge from "./PhraseTypeBadge";

export default function Word({
  bookmark,
  notifyDelete,
  notifyWordChange,
  onWordRemovedFromExercises,
  children,
  source,
  isReview,
  showRanking,
  isGrayedOut,
  isWordsOnDate = false,
  hideLevelIndicator = false,
  isOnCongratulationsPage,
  disableEdit = false,
  compact = false,
}) {
  const [showWordsModal, setShowWordsModal] = useState(false);

  const api = useContext(APIContext);
  const [deleted, setDeleted] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [reload, setReload] = useState(false);

  function setIsUserWordPreferred(bookmark) {
    // Keep the star to mirror the previous behaviour?
    api.userSetForExercises(bookmark.id);
    bookmark.fit_for_study = true;
    bookmark.user_preference = USER_WORD_PREFERENCE.USE_IN_EXERCISES;
    if (notifyWordChange) notifyWordChange(bookmark);
    api.logUserActivity(api.USER_SET_WORD_PREFERRED, bookmark.article_id, bookmark.from, source);
  }

  function setNotIsUserWordPreferred(bookmark) {
    api.userSetNotForExercises(bookmark.id);
    bookmark.fit_for_study = false;
    bookmark.user_preference = USER_WORD_PREFERENCE.DONT_USE_IN_EXERCISES;
    if (notifyWordChange) notifyWordChange(bookmark);
    api.logUserActivity(api.USER_SET_NOT_WORD_PREFERED, bookmark.article_id, bookmark.from, source);
  }

  function handleWordRemovedFromExercises(reason, bookmarkId) {
    // Start the shrinking animation
    setRemoving(true);
    
    // After animation completes, remove from list
    setTimeout(() => {
      if (onWordRemovedFromExercises) {
        onWordRemovedFromExercises(reason, bookmarkId);
      }
    }, 1000); // Match animation duration (1s)
  }

  if (deleted && !removing) {
    return <></>;
  }

  let style_grayed_out = { color: darkGrey };
  if (!isGrayedOut && bookmark.fit_for_study) {
    style_grayed_out = {};
  }
  const square = "square";
  const isWordLengthFitForStudy = bookmark.from.split(" ").length < MAX_WORDS_IN_BOOKMARK_FOR_EXERCISES;
  return (
    <>
      <s.Word 
        key={bookmark.id} 
        className={removing ? 'removing' : ''}
        compact={compact}
      >
        <CenteredRow>
          {isReview && bookmark.fit_for_study && (
            <s.AddRemoveStudyPreferenceButton onClick={(e) => setNotIsUserWordPreferred(bookmark)}>
              <img src={getStaticPath("icons", "remove-icon-color.png")} alt="remove" />
            </s.AddRemoveStudyPreferenceButton>
          )}
          {isReview && !bookmark.fit_for_study && isWordLengthFitForStudy && (
            <s.AddRemoveStudyPreferenceButton onClick={(e) => setIsUserWordPreferred(bookmark)}>
              <img src={getStaticPath("icons", "add-icon-color.png")} alt="add" />
            </s.AddRemoveStudyPreferenceButton>
          )}
          {/*
            Debug user preferences.
            {bookmark.user_preference !== USER_WORD_PREFERENCE.NO_PREFERENCE && (
              <span>❗</span>
            )}
          */}

          {!isReview && !disableEdit && (
            <EditBookmarkButton
              bookmark={bookmark}
              reload={reload}
              setReload={setReload}
              notifyWordChange={notifyWordChange}
              notifyDelete={() => {
                setDeleted(true);
                notifyDelete(bookmark);
              }}
              onWordRemovedFromExercises={handleWordRemovedFromExercises}
            />
          )}

          {!isReview && !compact && <SpeakButton bookmarkToStudy={bookmark} styling={square} />}
          <s.WordPair compact={compact}>
            <div className="from" style={style_grayed_out}>
              {bookmark.from}
              {(showRanking || compact) && (
                <PhraseTypeBadge
                  phraseType={bookmark.phrase_type}
                  rank={bookmark.origin_rank}
                />
              )}
              {bookmark.is_user_added && (
                <span
                  title="User added word"
                  style={{
                    marginLeft: "4px",
                    fontSize: "0.7em",
                    backgroundColor: "#e3f2fd",
                    padding: "1px 4px",
                    borderRadius: "3px",
                    color: "#1976d2",
                  }}
                >
                  manually added
                </span>
              )}
            </div>
            <div className="to" style={style_grayed_out}>
              {bookmark.to}
            </div>
          </s.WordPair>
        </CenteredRow>
      </s.Word>
      {children}
    </>
  );
}
