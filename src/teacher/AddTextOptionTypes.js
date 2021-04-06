import { Link } from "react-router-dom";
//import strings from "../i18n/definitions";
import { StyledButton } from "./TeacherButtons.sc";
import { RoutingContext } from "../contexts/RoutingContext";
import { useContext } from "react";
import * as s from "./AddTextOptions.sc";

export function AddFromZeeguuOption(props) {
  return (
    <s.StyledAddTextOptions>
      <div className="description">
        <Link className="link" to="/articles">
          STRINGSAssign an article from Zeeguu to a class{" "}
          <StyledButton primary className="add-btn">
            +
          </StyledButton>
        </Link>
      </div>
    </s.StyledAddTextOptions>
  );
}

export function TypeCopyPasteOption() {
  //We are updating the returnPath context upon taking the path to editText in order to be able to use Cancel correctly.
  const { setReturnPath } = useContext(RoutingContext);
  return (
    <s.StyledAddTextOptions>
      <div className="description">
        <Link
          className="link"
          to="/teacher/texts/editText/new"
          onClick={setReturnPath("/teacher/texts/AddTextsOption")}
        >
          STRINGSCopy/paste content or type your own text{" "}
          <StyledButton primary className="add-btn">
            +
          </StyledButton>
        </Link>
      </div>
    </s.StyledAddTextOptions>
  );
}

export function AddURLOption(props) {
  return (
    <s.StyledAddTextOptions>
      <div className="description" onClick={props.onClick}>
        STRINGSUse a URL-address
        <StyledButton primary className="add-btn">
          +
        </StyledButton>
      </div>
    </s.StyledAddTextOptions>
  );
}
