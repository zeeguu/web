import * as s from "./Word.sc";

import { useState } from "react";
import SpeakButton from "../exercises/exerciseTypes/SpeakButton";
import EditButton from "./EditButton";
import { darkGrey } from "../components/colors";
import { CenteredRow } from "../exercises/exerciseTypes/Exercise.sc";
import { APP_DOMAIN } from "../appConstants";

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

  function setIsFitForStudy(bookmark) {
    console.log(bookmark);
    api.setIsFitForStudy(bookmark.id);
    starBookmark(bookmark);
    bookmark.fit_for_study = true;
    if (notifyWordChange) notifyWordChange(bookmark);
  }

  function setNotFitForStudy(bookmark) {
    console.log(bookmark);
    api.setNotFitForStudy(bookmark.id);
    unstarBookmark(bookmark);
    bookmark.fit_for_study = false;
    if (notifyWordChange) notifyWordChange(bookmark);
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
  if (bookmark.fit_for_study || bookmark.starred) {
    grayed_out_if_not_scheduled_for_study = {};
  }

  const square = "square";
  return (
    <>
      <s.Word key={bookmark.id}>
        <CenteredRow>
          {isReview && bookmark.fit_for_study && (
            <s.AddMinusButton onClick={(e) => setNotFitForStudy(bookmark)}>
              <img
                src={APP_DOMAIN + "/static/icons/remove-icon-color.png"}
                alt="remove"
              />
            </s.AddMinusButton>
          )}
          {isReview &&
            !bookmark.fit_for_study &&
            bookmark.from.split(" ").length < 3 && (
              <s.AddMinusButton onClick={(e) => setIsFitForStudy(bookmark)}>
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
                  bookmark.from.split(" ").length < 3
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
