import { useParams,useHistory  } from "react-router-dom";
import Exercises from "./Exercises";

export default function ExercisesForArticle({
  api,
  keepExercisingAction,
}) {
  const history = useHistory();
  let { articleID } = useParams();

  const backToArticleAction = (e) => {
    e.preventDefault();
    history.push({
      pathname: "/read/article",
      search: `?id=${articleID}`,
    });
  };

  return (
    <Exercises
      api={api}
      articleID={articleID}
      backButtonAction={backToArticleAction}
      keepExercisingAction={keepExercisingAction}
    />
  );
}
