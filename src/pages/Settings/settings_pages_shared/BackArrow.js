import { useHistory } from "react-router-dom";
import useQuery from "../../../hooks/useQuery";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import * as s from "./BackArrow.sc";
import redirect from "../../../utils/routing/routing";

export default function BackArrow() {
  const history = useHistory();
  const searchQuery = useQuery().get("fromArticles");
  const IsRedirectToArticles = searchQuery ? searchQuery === "1" : false;

  return (
    <s.BackArrow
      onClick={() =>
        IsRedirectToArticles ? redirect("/articles") : history.goBack()
      }
    >
      <ArrowBackRoundedIcon /> Back
    </s.BackArrow>
  );
}
