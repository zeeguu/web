import { useParams } from "react-router-dom";
import strings from "../../i18n/definitions";
import * as s from "../../components/ColumnWidth.sc";
import * as sc from "../../components/TopTabs.sc";
import ArticleReader from "../../reader/ArticleReader";

export default function StudentsTextView({ api }) {
  const articleID = useParams().articleID;

  return (
    <s.NarrowColumn>
      <sc.TopTabs>
        <h1>{strings.viewText}</h1>
      </sc.TopTabs>
      <ArticleReader api={api} teacherArticleID={articleID} />
    </s.NarrowColumn>
  );
}
