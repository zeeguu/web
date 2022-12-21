import * as s from "./ArticleReader.sc";
import strings from "../i18n/definitions";

export default function ReportBroken({ api, articleID, UMR_SOURCE, history }) {
  function reportBroken(e) {
    let answer = prompt("What is wrong with the article?");
    if (answer) {
      let feedback = "broken_" + answer.replace(/ /g, "_");
      api.logReaderActivity(api.USER_FEEDBACK, articleID, feedback, UMR_SOURCE);
      setTimeout(() => history.push("/articles"), 500);
    }
  }

  return (
    <>
      <s.WhiteButton small gray onClick={reportBroken}>
        {strings.reportBrokenArticle}
      </s.WhiteButton>
      <br />
    </>
  );
}
