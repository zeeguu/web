import { useParams, useHistory } from "react-router-dom";
import Exercises from "./Exercises";
import { UMR_SOURCE } from "../reader/ArticleReader";

export default function ExercisesForArticle({ api }) {
  const history = useHistory();
  let { articleID } = useParams();

  const backToArticleAction = (e) => {
    e.preventDefault();
    history.push({
      pathname: "/read/article",
      search: `?id=${articleID}`,
    });
    api.logReaderActivity(api.BACK_TO_READING, articleID, "", UMR_SOURCE);
  };

  const keepExercisingAction = () => {
    window.location.reload(false);
    api.logReaderActivity(api.KEEP_EXERCISING, articleID, "", UMR_SOURCE);
  };

  const toScheduledExercises = () => {
    history.push("/exercises");
    api.logReaderActivity(api.TO_SCHEDULED_EXERCISES, "", "", UMR_SOURCE);
  };

  return (
    <Exercises
      api={api}
      articleID={articleID}
      backButtonAction={backToArticleAction}
      keepExercisingAction={keepExercisingAction}
      toScheduledExercises={toScheduledExercises}
      source={UMR_SOURCE}
    />
  );
}
