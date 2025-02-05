import { useHistory } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import * as s from "./BackArrow.sc";

export default function BackArrow({ redirectLink, func }) {
  /*
    Within the Web, the back button usually navigates the user backwards in
    the history of the browser, or redirects them to a new location.

    However, there might be cases where the back button hides a modal or
    shouldn't navigate the user through links. For example, the extension
    relies on showing/hiding components, so we need a way to set a state
    via this button. If func() is defined, tehn we call that function,
    otherwise, history is used.
  */
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
