import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
//import strings from "../i18n/definitions";
import * as s from "../components/NarrowColumn.sc";
import * as sc from "../components/TopTabs.sc";
import { RoutingContext } from "../contexts/RoutingContext";

export default function EditText() {
  //As there are two paths to EditTexts we are using RoutingContext to be able to go back on the right one on Cancel
  const { returnPath } = useContext(RoutingContext);
  const history = useHistory();

  const handleCancel = () => {
    history.push(returnPath);
  };

  return (
    <s.NarrowColumn>
      <sc.TopTabs>
        <h1>STRINGSEditText</h1>
      </sc.TopTabs>
      <p>
        <Link to="/teacher/texts/editText/:articleID/studentView">
          <button>STRINGSView as student</button>{" "}
        </Link>
        <button>STRINGSAdd to class</button> <button>STRINGSDelete</button>{" "}
        <button onClick={handleCancel}>STRINGSCancel</button>
        <br />
        <br />
        <label>
          STRINGSClick in the box below to edit the title
          <br />
          <input placeholder="STRINGSPaste or type your title here..."></input>
        </label>
        <br />
        <br />
        <label>
          STRINGSClick in the box below to edit the text body
          <br />
          <input placeholder="STRINGSPaste or type your title here..."></input>
        </label>
        <br />
        <br />
        <br />
        ("Add to class" and "Delete" open popups.)
      </p>
    </s.NarrowColumn>
  );
}
