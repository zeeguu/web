import { Link } from "react-router-dom";
import strings from "../i18n/definitions";
import Word from "./Word";
import * as s from "./WordsOnDate.sc";

export function WordsOnDate({ day, notifyDelete }) {
  function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  function returnTitleLink(bookmark) {
    const article_id = bookmark.article_id;
    const title = bookmark.title;
    return (
      <>
        {article_id !== undefined && article_id === "" && <span style={{ fontSize: "small" }}>(Video) </span>}
        {title}
        {article_id !== undefined && article_id !== "" && (
          <Link to={"/read/article?id=" + article_id}>{strings.open}</Link>
        )}
      </>
    );
  }

  const bookmaks_by_title = groupBy(day.bookmarks, (x) => x.title);
  const sourceTitles = Array.from(bookmaks_by_title.keys());

  return (
    <div key={day.date}>
      <s.Date>{day.date}</s.Date>

      {sourceTitles.map((sourceTitle, index) => (
        <s.Article key={index}>
          <s.ArticleTitle>
            {
              // We take the first bookmark for the source to see if it has a title
              bookmaks_by_title.get(sourceTitle)[0].title ? (
                returnTitleLink(bookmaks_by_title.get(sourceTitle)[0])
              ) : (
                // If the source is missing, tell it to the user.
                <span style={{ color: "grey" }}>[Source deleted]</span>
              )
            }
          </s.ArticleTitle>

          {bookmaks_by_title.get(sourceTitle).map((bookmark) => (
            <s.ContentOnRow className="contentOnRow">
              <Word key={bookmark.id} bookmark={bookmark} notifyDelete={notifyDelete} isWordsOnDate={true}/>
            </s.ContentOnRow>
          ))}
        </s.Article>
      ))}
    </div>
  );
}
