import * as s from "./Word.sc";

import { useState } from "react";
import SpeakButton from "../exercises/exerciseTypes/SpeakButton";
import EditButton from "./EditButton";
import { darkGrey } from "../components/colors";
import { CenteredRow } from "../exercises/exerciseTypes/Exercise.sc";
import { APP_DOMAIN } from "../appConstants";
import { USER_WORD_PREFERENCE } from "./userBookmarkPreferences";
import { MAX_WORDS_IN_BOOKMARK_FOR_EXERCISES } from "../exercises/ExerciseConstants";

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
  const [starred, setStarred] = useState(bookmark.starred);
  const [deleted, setDeleted] = useState(false);
  const [reload, setReload] = useState(false);

  function starBookmark(bookmark) {
    api.starBookmark(bookmark.id);
    setStarred(true);
    bookmark.starred = true;
    if (notifyWordChange) notifyWordChange(bookmark);
    api.logReaderActivity(
      api.STAR_WORD,
      bookmark.article_id,
      bookmark.from,
      source,
    );
  }
  function unstarBookmark(bookmark) {
    api.unstarBookmark(bookmark.id);
    bookmark.starred = false;
    setStarred(false);
    if (notifyWordChange) notifyWordChange(bookmark);
    api.logReaderActivity(
      api.UNSTAR_WORD,
      bookmark.article_id,
      bookmark.from,
      source,
    );
  }
  function toggleStarred(bookmark) {
    if (starred) {
      unstarBookmark(bookmark);
    } else {
      starBookmark(bookmark);
    }
  }

  function setIsUserWordPreferred(bookmark) {
    // Keep the star to mirror the previous behaviour?
    api.userSetForExercises(bookmark.id);
    bookmark.starred = true;
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
    bookmark.starred = false;
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
  function deleteBookmark(bookmark) {
    api.deleteBookmark(bookmark.id);
    setDeleted(true);
    if (notifyDelete) notifyDelete(bookmark);
    api.logReaderActivity(
      api.DELETE_WORD,
      bookmark.article_id,
      bookmark.from,
      source,
    );
  }

  if (deleted) {
    return <></>;
  }

  let grayed_out_if_not_scheduled_for_study = { color: darkGrey };
  if (
    bookmark.fit_for_study ||
    bookmark.starred ||
    bookmark.user_preference === USER_WORD_PREFERENCE.USE_IN_EXERCISES
  ) {
    grayed_out_if_not_scheduled_for_study = {};
  }
  const square = "square";
  return (
    <>
      <s.Word key={bookmark.id}>
        <CenteredRow>
          {isReview && bookmark.fit_for_study && (
            <s.AddMinusButton
              onClick={(e) => setNotIsUserWordPreferred(bookmark)}
            >
              <img
                src={APP_DOMAIN + "/static/icons/remove-icon-color.png"}
                alt="remove"
              />
            </s.AddMinusButton>
          )}
          {isReview &&
            !bookmark.fit_for_study &&
            bookmark.from.split(" ").length <
              MAX_WORDS_IN_BOOKMARK_FOR_EXERCISES && (
              <s.AddMinusButton
                onClick={(e) => setIsUserWordPreferred(bookmark)}
              >
                <img
                  src={APP_DOMAIN + "/static/icons/add-icon-color.png"}
                  alt="add"
                />
              </s.AddMinusButton>
            )}
          {/*!isReview && (
            <s.TrashIcon onClick={(e) => deleteBookmark(bookmark)}>
              <img src={APP_DOMAIN + "/static/images/trash.svg"} alt="trash" />
            </s.TrashIcon>
          )*/}
          {/*
            Debug user preferences. 
            {bookmark.user_preference !== USER_WORD_PREFERENCE.NO_PREFERENCE && (
              <span>❗</span>
            )}
          */}

          {!isReview && (
            <EditButton
              bookmark={bookmark}
              api={api}
              reload={reload}
              setReload={setReload}
              notifyWordChange={notifyWordChange}
              deleteAction={deleteBookmark}
            />
          )}

          {!hideStar && !isReview && (
            <s.StarIcon onClick={(e) => toggleStarred(bookmark)}>
              <img
                src={
                  APP_DOMAIN +
                  "/static/images/yellow_star" +
                  (bookmark.starred ? ".svg" : "_empty.svg")
                }
                alt="star"
                style={
                  bookmark.from.split(" ").length <
                  MAX_WORDS_IN_BOOKMARK_FOR_EXERCISES
                    ? {}
                    : { visibility: "hidden" }
                }
              />
            </s.StarIcon>
          )}
          {!isReview && (
            <SpeakButton
              bookmarkToStudy={bookmark}
              api={api}
              styling={square}
            />
          )}
          <s.WordPair>
            <div className="from" style={grayed_out_if_not_scheduled_for_study}>
              {bookmark.from}
            </div>
            <div className="to" style={grayed_out_if_not_scheduled_for_study}>
              {bookmark.to}
            </div>
          </s.WordPair>
        </CenteredRow>
      </s.Word>
      {children}
    </>
  );
}
