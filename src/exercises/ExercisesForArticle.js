import { useParams } from "react-router-dom";
import Exercises from "./Exercises";

export default function ExercisesForArticle({
  api,
  backToReadingAction,
  keepExercisingAction,
}) {
  let { articleID } = useParams();

  return (
    <Exercises
      api={api}
      articleID={articleID}
      backToReadingAction={backToReadingAction}
      keepExercisingAction={keepExercisingAction}
    />
  );
}
