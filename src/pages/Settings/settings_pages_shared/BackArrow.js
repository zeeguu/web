import { useHistory } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import * as s from "./BackArrow.sc";

export default function BackArrow({ redirectLink, func }) {
  const history = useHistory();

  return (
    <s.BackArrow
      onClick={() =>
        func
          ? func()
          : redirectLink
            ? history.push(redirectLink)
            : history.goBack()
      }
    >
      <ArrowBackRoundedIcon /> Back
    </s.BackArrow>
  );
}
