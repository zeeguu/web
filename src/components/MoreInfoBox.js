import { MoreInfoBoxContainer } from "./MoreInfoBox.sc.js";

export default function MoreInfoBox({ type }) {
  const contentMap = {
    willBeInExercises: {
      mainInfo: "These words might appear in your exercises depending on your current scheduling.",
      extraInfo: "You can always change the amount of Words in Learning in Settings",
    },
    wontBeInExercises: {
      mainInfo: "Phrases composed of 3 or more words are not used in the exercises.",
      extraInfo: "You can still find them in Words or History tab.",
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
