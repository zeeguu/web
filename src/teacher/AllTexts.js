import { useContext } from "react";
import { Link } from "react-router-dom";
import strings from "../i18n/definitions";
import * as s from "../components/NarrowColumn.sc";
import * as sc from "../components/TopTabs.sc";
import { RoutingContext } from "../contexts/RoutingContext";

export default function AllTexts() {
  //Setting up the routing context to be able to route correctly on Cancel
  const { setReturnPath } = useContext(RoutingContext);
  return (
    <s.NarrowColumn>
      <sc.TopTabs>
        <h1>{strings.myTexts}</h1>
      </sc.TopTabs>
      <p>
        <Link to="/teacher/texts/AddTextsOption">
          <button>STRINGSAdd text</button>
        </Link>
        <br />
        <br />
        <Link
          to="/teacher/texts/editText/:articleID"
          onClick={setReturnPath("/teacher/texts")}
        >
          Article Title | added to: XYZ | level | length | <button>STRINGSEdit text</button>
        </Link>{" "}
      </p>
    </s.NarrowColumn>
  );
}
