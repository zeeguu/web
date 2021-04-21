import { Link, useParams } from "react-router-dom";
//import strings from "../i18n/definitions";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";

export default function StudentsTextView() {
  const articleID = useParams().articleID;

  return (
    <s.NarrowColumn>
      <sc.TopTabs>
        <h1>STRINGSView Text</h1>
      </sc.TopTabs>
      <Link to={`/teacher/texts/editText/${articleID}`}>
        <button>STRINGEdit text</button>
      </Link>{" "}
      <button>STRINGAdd to class</button>{" "}
      <button>ICONTranlate</button>{" "}
      <button>ICONListen</button>{" "}
      <p>The <b>Add to Class</b>-button opens a popup.</p>
      <h2> Text title lorem ipsum </h2>
      <hr></hr>
      <p>
        Text body. Sed ut perspiciatis unde omnis iste natus error sit
        voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque
        ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
        dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
        aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
        qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
        dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia
        non numquam eius modi tempora incidunt ut labore et dolore magnam
        aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
        exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea
        commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea
        voluptate velit esse quam nihil molestiae consequatur, vel illum qui
        dolorem eum fugiat quo voluptas nulla pariatur?"
      </p>
    </s.NarrowColumn>
  );
}
