import { useParams } from "react-router-dom";
import strings from "../../i18n/definitions";
import * as s from "../../components/ColumnWidth.sc";
import * as sc from "../../components/TopTabs.sc";
import ArticleReader from "../../reader/ArticleReader";

export default function StudentsTextView() {
  const articleID = useParams().articleID;

  return (
    <s.NarrowColumn>
      <ArticleReader teacherArticleID={articleID} />
    </s.NarrowColumn>
  );
}
