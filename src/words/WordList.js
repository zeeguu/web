import * as s from "./WordList.sc";

export default function WordList({
  wordList,
  day,
  deleteBookmark,
  toggleStarred,
}) {
  return (
    <>
      {wordList.map((bookmark) => (
        <s.Word key={bookmark.id}>
          <s.StarIcon onClick={(e) => toggleStarred(day, bookmark)}>
            <img
              src={
                "/static/images/star" +
                (bookmark.starred ? ".svg" : "_empty.svg")
              }
              alt="star"
            />
          </s.StarIcon>

          <s.TrashIcon onClick={(e) => deleteBookmark(day, bookmark)}>
            <img src="/static/images/trash.svg" alt="trash" />
          </s.TrashIcon>

          <s.WordPair>
            <div>
              {bookmark.from}
              {/* <span style={{ color: "black" }}> – </span> */}
              <p>{bookmark.to}</p>
            </div>
          </s.WordPair>
        </s.Word>
      ))}
    </>
  );
}
