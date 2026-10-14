import { useContext } from "react";
import { Link } from "react-router-dom";
import { RoutingContext } from "../../contexts/RoutingContext";
import { StyledButton } from "../styledComponents/TeacherButtons.sc";
import strings from "../../i18n/definitions";

// Straight into the editor. It used to go through a page of three options
// (find in Zeeguu, paste, URL) that every teacher had to read before getting
// to the one they almost always want. Cancel in the editor comes back here.
export default function AddTextButton({ returnPath }) {
  const { setReturnPath } = useContext(RoutingContext);
  return (
    <Link to="/teacher/texts/editText/new" onClick={() => setReturnPath(returnPath)}>
      <StyledButton $primary>{strings.addText}</StyledButton>
    </Link>
  );
}
