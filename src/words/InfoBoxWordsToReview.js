import Infobox from "../components/Infobox";

export default function InfoBoxWordsToReview({ toggleEditWordsComponent }) {
  return (
    <Infobox>
      <div>
        <p>
          <b>How words are added to exercises</b>
        </p>
        <p>
          New words are introduced as soon as you learn earlier ones, based on spaced repetition. More important words are
          added first.
        </p>
        {toggleEditWordsComponent}
      </div>
    </Infobox>
  );
}
