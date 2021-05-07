import { Link, useParams } from "react-router-dom";
//import strings from "../i18n/definitions";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";
import ArticleReader from "../reader/ArticleReader";
import { StyledButton } from "./TeacherButtons.sc";

export default function StudentsTextView({ api }) {
  const articleID = useParams().articleID;

  return (
    <s.NarrowColumn>
      <sc.TopTabs>
        <h1>STRINGSView Text</h1>
      </sc.TopTabs>
      {/* <Link to={`/teacher/texts/editText/${articleID}`}>
        <StyledButton secondary>STRINGBack to editing</StyledButton>
      </Link> */}
      {/* <StyledButton primary>STRINGAdd to class</StyledButton>{" "} */}
      <ArticleReader api={api} teacherArticleID={articleID} />
    </s.NarrowColumn>
  );
}