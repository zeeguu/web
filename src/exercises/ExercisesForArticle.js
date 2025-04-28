import { useParams, useHistory } from "react-router-dom";
import Exercises from "./Exercises";
import { WEB_READER } from "../reader/ArticleReader";
import { useContext } from "react";
import { APIContext } from "../contexts/APIContext";

export default function ExercisesForArticle() {
  const api = useContext(APIContext);
  const history = useHistory();
  let { articleID } = useParams();

  const backToArticleAction = (e) => {
    e.preventDefault();
    history.push({
      pathname: "/read/article",
      search: `?id=${articleID}`,
    });
    api.logUserActivity(api.BACK_TO_READING, articleID, "", WEB_READER);
  };

  const keepExercisingAction = () => {
    window.location.reload(false);
    api.logUserActivity(api.KEEP_EXERCISING, articleID, "", WEB_READER);
  };

  const toScheduledExercises = () => {
    history.push("/exercises");
    api.logUserActivity(api.TO_SCHEDULED_EXERCISES, "", "", WEB_READER);
  };

  return (
    <Exercises
      articleID={articleID}
      backButtonAction={backToArticleAction}
      keepExercisingAction={keepExercisingAction}
      toScheduledExercises={toScheduledExercises}
      source={WEB_READER}
    />
  );
}
