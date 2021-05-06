import Word from "../words/Word";
import { NarrowColumn, CenteredContent } from "../components/ColumnWidth.sc";
import { OrangeButton, WhiteButton } from "../reader/ArticleReader.sc";

export default function Congratulations({
  articleID,
  correctBookmarks,
  incorrectBookmarks,
  api,
}) {
  function removeArrayDuplicates(array) {
    var set = new Set(array);
    var newArray = Array.from(set);
    return newArray;
  }

  return (
    <NarrowColumn>
      <br />

      <h2>&nbsp;&nbsp;&nbsp;Good Job! 🥳 🎉 </h2>

      {correctBookmarks.length > 0 && (
        <h3>
          😊 Correct
          <br />
          <br />
          {removeArrayDuplicates(correctBookmarks).map((each) => (
            <Word key={each.id} bookmark={each} api={api} />
          ))}
        </h3>
      )}

      {incorrectBookmarks.length > 0 && (
        <h3>
          <br />
          <br />
          😳 Pay more attention to
          <br />
          <br />
          {removeArrayDuplicates(incorrectBookmarks).map((each) => (
            <Word key={each.id} bookmark={each} api={api} />
          ))}
        </h3>
      )}

      <br />
      <br />
      <br />
      <br />
      <CenteredContent>
        <OrangeButton>
          <a href="/exercises">
            <h2>More Exercises </h2>
          </a>
        </OrangeButton>

        <WhiteButton>
          <a href="/articles">
            <h2>Back to Reading </h2>
          </a>
        </WhiteButton>
      </CenteredContent>
    </NarrowColumn>
  );
}
