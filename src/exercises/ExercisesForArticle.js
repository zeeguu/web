import { useParams,useHistory  } from "react-router-dom";
import Exercises from "./Exercises";

export default function ExercisesForArticle({
  api,
  backToReadingAction,
  keepExercisingAction,
}) {
  const history = useHistory();
  let { articleID } = useParams();

  const backToArticleAction = () => {
    history.push({
      pathname: "/read/article",
      search: `?id=${articleID}`,
    });
  };

  return (
    <Exercises
      api={api}
      articleID={articleID}
      backToReadingAction={backToReadingAction}
      keepExercisingAction={keepExercisingAction}
      backToArticleAction={backToArticleAction}
    />
  );
}
