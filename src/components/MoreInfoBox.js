import { Link } from "react-router-dom";
import { MoreInfoBoxContainer } from "./MoreInfoBox.sc.js";

export default function MoreInfoBox({ type }) {
  const contentMap = {
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
