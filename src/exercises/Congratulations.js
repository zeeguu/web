import Word from "../words/Word";
import * as s from "../reader/ArticleReader.sc";
import { Link } from "react-router-dom";
import SpeakButton from "./exerciseTypes/SpeakButton";

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

  const small = "small";

  return (
    <s.NarrowColumn>
      <br />

      <h2>&nbsp;&nbsp;&nbsp;Good Job! 🥳 🎉 </h2>

      {correctBookmarks.length > 0 && (
        <h3>
          😊 Correct
          {removeArrayDuplicates(correctBookmarks).map((each) => (
            <s.ContentOnRow>
              <Word key={each.id} bookmark={each} api={api} />
              <SpeakButton
                key={each.from}
                bookmarkToStudy={each}
                api={api}
                styling={small}
              />
            </s.ContentOnRow>
          ))}
        </h3>
      )}

      {incorrectBookmarks.length > 0 && (
        <h3>
          <br />
          😳 Pay more attention to
          {removeArrayDuplicates(incorrectBookmarks).map((each) => (
            <s.ContentOnRow>
              <Word key={each.id} bookmark={each} api={api} />
              <SpeakButton
                key={each.from}
                bookmarkToStudy={each}
                api={api}
                styling={small}
              />
            </s.ContentOnRow>
          ))}
        </h3>
      )}

      <s.ContentOnRow>
        <Link to={`/exercises`} onClick={(e) => window.location.reload(false)}>
          <s.OrangeButton>Keep Exercising</s.OrangeButton>
        </Link>

        <Link to={`/articles`}>
          <s.WhiteButton>Back to Reading</s.WhiteButton>
        </Link>
      </s.ContentOnRow>
    </s.NarrowColumn>
  );
}
