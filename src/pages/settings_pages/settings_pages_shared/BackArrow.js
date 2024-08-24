import { useHistory } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import * as s from "./BackArrow.sc";

export default function BackArrow() {
  const history = useHistory();
  return (
    <s.BackArrow onClick={() => history.goBack()}>
      <ArrowBackRoundedIcon /> Back
    </s.BackArrow>
  );
}
