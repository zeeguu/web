import * as s from "./Word.sc";

import { useState } from "react";
import SpeakButton from "../exercises/exerciseTypes/SpeakButton";
import EditBookmarkButton from "./EditBookmarkButton";
import { darkGrey } from "../components/colors";
import { CenteredRow } from "../exercises/exerciseTypes/Exercise.sc";
import { USER_WORD_PREFERENCE } from "./userBookmarkPreferences";
import { MAX_WORDS_IN_BOOKMARK_FOR_EXERCISES } from "../exercises/ExerciseConstants";
import { getStaticPath } from "../utils/misc/staticPath";

export default function Word({
  bookmark,
  notifyDelete,
  notifyWordChange,
  children,
  api,
  hideStar = true,
  source,
  isReview,
}) {
  const [deleted, setDeleted] = useState(false);
  const [reload, setReload] = useState(false);

  function setIsUserWordPreferred(bookmark) {
    // Keep the star to mirror the previous behaviour?
    api.userSetForExercises(bookmark.id);
    bookmark.fit_for_study = true;
    bookmark.user_preference = USER_WORD_PREFERENCE.USE_IN_EXERCISES;
    if (notifyWordChange) notifyWordChange(bookmark);
    api.logReaderActivity(
      api.USER_SET_WORD_PREFERRED,
      bookmark.article_id,
      bookmark.from,
      source,
    );
  }

  function setNotIsUserWordPreferred(bookmark) {
    api.userSetNotForExercises(bookmark.id);
    bookmark.fit_for_study = false;
    bookmark.user_preference = USER_WORD_PREFERENCE.DONT_USE_IN_EXERCISES;
    if (notifyWordChange) notifyWordChange(bookmark);
    api.logReaderActivity(
      api.USER_SET_NOT_WORD_PREFERED,
      bookmark.article_id,
      bookmark.from,
      source,
    );
  }

  if (deleted) {
    return <></>;
  }

  let style_grayed_out = { color: darkGrey };
  if (bookmark.fit_for_study) {
    style_grayed_out = {};
  }
  const square = "square";
  const isWordLengthFitForStudy =
    bookmark.from.split(" ").length < MAX_WORDS_IN_BOOKMARK_FOR_EXERCISES;

  return (
    <>
      <s.Word key={bookmark.id}>
        <CenteredRow>
          {isReview && bookmark.fit_for_study && (
            <s.AddRemoveStudyPreferenceButton
              onClick={(e) => setNotIsUserWordPreferred(bookmark)}
            >
              <img
                src={getStaticPath("icons", "remove-icon-color.png")}
                alt="remove"
              />
            </s.AddRemoveStudyPreferenceButton>
          )}
          {isReview && !bookmark.fit_for_study && isWordLengthFitForStudy && (
            <s.AddRemoveStudyPreferenceButton
              onClick={(e) => setIsUserWordPreferred(bookmark)}
            >
              <img
                src={getStaticPath("icons", "add-icon-color.png")}
                alt="add"
              />
            </s.AddRemoveStudyPreferenceButton>
          )}
          {/*
            Debug user preferences. 
            {bookmark.user_preference !== USER_WORD_PREFERENCE.NO_PREFERENCE && (
              <span>❗</span>
            )}
          */}

          {!isReview && (
            <EditBookmarkButton
              bookmark={bookmark}
              api={api}
              reload={reload}
              setReload={setReload}
              notifyWordChange={notifyWordChange}
              notifyDelete={() => {
                setDeleted(true);
                notifyDelete(bookmark);
              }}
            />
          )}

          {!isReview && (
            <SpeakButton
              bookmarkToStudy={bookmark}
              api={api}
              styling={square}
            />
          )}
          <s.WordPair>
            <div className="from" style={style_grayed_out}>
              {bookmark.from}
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
