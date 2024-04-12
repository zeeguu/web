import * as s from "./Word.sc";

import { useState } from "react";
import SpeakButton from "../exercises/exerciseTypes/SpeakButton";
import EditButton from "./EditButton";
import { darkGrey } from "../components/colors";
import { CenteredRow } from "../exercises/exerciseTypes/Exercise.sc";
import { PROD_ZEEGUU_URL } from "../i18n/appConstants";

export default function Word({
  bookmark,
  notifyUnstar,
  notifyDelete,
  notifyStar,
  notifyEdit,
  children,
  api,
  hideStar,
  source,
}) {
  const [starred, setStarred] = useState(bookmark.starred);
  const [deleted, setDeleted] = useState(false);
  const [reload, setReload] = useState(false);

  function toggleStarred(bookmark) {
    if (starred) {
      api.unstarBookmark(bookmark.id);
      bookmark.starred = false;
      setStarred(false);
      if (notifyUnstar) {
        notifyUnstar(bookmark);
      }
      api.logReaderActivity(
        api.UNSTAR_WORD,
        bookmark.article_id,
        bookmark.from,
        source,
      );
    } else {
      api.starBookmark(bookmark.id);
      setStarred(true);
      bookmark.starred = true;
      if (notifyStar) {
        notifyStar(bookmark);
      }
      api.logReaderActivity(
        api.STAR_WORD,
        bookmark.article_id,
        bookmark.from,
        source,
      );
    }
  }

  function deleteBookmark(bookmark) {
    api.deleteBookmark(bookmark.id);
    setDeleted(true);
    if (notifyDelete) {
      notifyDelete(bookmark);
    }
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
          <s.TrashIcon onClick={(e) => deleteBookmark(bookmark)}>
            <img
              src={"https://" + PROD_ZEEGUU_URL + "/static/images/trash.svg"}
              alt="trash"
            />
          </s.TrashIcon>
          <EditButton
            bookmark={bookmark}
            api={api}
            reload={reload}
            setReload={setReload}
          />

          {!hideStar && (
            <s.StarIcon onClick={(e) => toggleStarred(bookmark)}>
              <img
                src={
                  "https://" +
                  PROD_ZEEGUU_URL +
                  "/static/images/yellow_star" +
                  (bookmark.starred ? ".svg" : "_empty.svg")
                }
                alt="star"
              />
            </s.StarIcon>
          )}
          <SpeakButton bookmarkToStudy={bookmark} api={api} styling={square} />
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

      <s.Spacer />
    </>
  );
}
