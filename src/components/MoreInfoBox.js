import { Link } from "react-router-dom";
import { MoreInfoBoxContainer } from "./MoreInfoBox.sc.js";

export default function MoreInfoBox({ type }) {
  const contentMap = {
    willBeInExercises: {
      mainInfo: "More important words are added first.",
      extraInfo: (
        <>
          New words are introduced as you master earlier ones, based on spaced repetition. You can change the amount of{" "}
          <Link to="/account_settings/exercise_scheduling">Words in Learning</Link> in Settings.
        </>
      ),
    },
    wontBeInExercises: {
      mainInfo: "Phrases longer than 3 words can't be practiced yet.",
      extraInfo: (
        <>
          You can still find them in <Link to="/words">Words</Link> or History tab.
        </>
      ),
    },
  };
  const data = contentMap[type] || { mainInfo: "", extraInfo: "" };
  return (
    <MoreInfoBoxContainer>
      <h3>{data.mainInfo}</h3>
      <p>{data.extraInfo}</p>
    </MoreInfoBoxContainer>
  );
}
