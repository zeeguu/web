import { Link } from "react-router-dom";
//import strings from "../i18n/definitions";
import * as s from "../components/NarrowColumn.sc";
import * as sc from "../components/TopTabs.sc";
import { RoutingContext } from "../contexts/RoutingContext";
import { useContext } from "react";

export default function AddTextOptions() {
  const { setReturnPath } = useContext(RoutingContext);
  return (
    <s.NarrowColumn>
      <sc.TopTabs>
        <h1>STRINGSAddTexts</h1>
      </sc.TopTabs>
      <p>
        STRINGSAssign a text from Zeeguu to a class{" "}
        <Link to="/articles">
          <button>+</button>
        </Link>
      </p>
      <p>
        STRINGSCopy/paste content or type your own text{" "}
        <Link
          to="/teacher/texts/editText/new"
          onClick={setReturnPath("/teacher/texts/AddTextsOption")}
        >
          <button>+</button>
        </Link>
      </p>
      <p>
        STRINGSUse a URL-address <button>+</button>
        <br />
        <br />
        <br />
        ("Use a URL-address" will open a popup.)
      </p>
    </s.NarrowColumn>
  );
}
