import { Link } from "react-router-dom";
import strings from "../i18n/definitions";
import Word from "./Word";
import * as s from "./WordsOnDate.sc";

export function WordsOnDate({ day, api, notifyDelete }) {
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

  const bookmarks_by_article = groupBy(day.bookmarks, (x) => x.article_id);
  const articleIDs = Array.from(bookmarks_by_article.keys());

  return (
    <div key={day.date}>
      <s.Date>{day.date}</s.Date>

      {articleIDs.map((article_id) => (
        <s.Article key={article_id}>
          <s.ArticleTitle>
            {bookmarks_by_article.get(article_id)[0].title}
            <Link to={"/read/article?id=" + article_id}>{strings.open}</Link>
          </s.ArticleTitle>

          {bookmarks_by_article.get(article_id).map((bookmark) => (
            <s.ContentOnRow className="contentOnRow">
              <Word
                key={bookmark.id}
                bookmark={bookmark}
                api={api}
                notifyDelete={notifyDelete}
              />
            </s.ContentOnRow>
          ))}
        </s.Article>
      ))}
    </div>
  );
}
