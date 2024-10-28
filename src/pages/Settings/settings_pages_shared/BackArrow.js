import { useHistory } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import * as s from "./BackArrow.sc";

export default function BackArrow({ redirectLink }) {
  const history = useHistory();

  return (
    <s.BackArrow
      onClick={() =>
        redirectLink ? history.push(redirectLink) : history.goBack()
      }
    >
      <ArrowBackRoundedIcon /> Back
    </s.BackArrow>
  );
}
