import * as s from "./ArticleReader.sc";
import strings from "../i18n/definitions";
import Chip from '@mui/material/Chip';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';

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
    <div style={{ marginLeft: '5px', marginRight: '5px' }}>
     <Chip
        label="Report broken article"
        component="a"
        onClick={reportBroken}
        variant="outlined"
        clickable
        color="warning"
        size="small"
        icon={<ReportProblemRoundedIcon />}/>
    </div>
  );
}
