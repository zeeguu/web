import React from "react";
import { Link } from "react-router-dom";
//import strings from "../i18n/definitions";
import { MdHighlightOff } from "react-icons/md/";
import { StyledButton } from "./TeacherButtons.sc";
import * as st from "./TeacherTextPreview.sc";
import * as s from "../articles/ArticlePreview.sc";

export default function TeacherTextPreview({ article, setReturnPath }) {
  let difficulty = Math.round(article.metrics.difficulty * 100) / 10;
  let DUMMYCLASSES = "3.X_B-level 2.Y_A-level";
  let cohortlist = DUMMYCLASSES.split(" ").filter((each) => each !== "");
  //TODO We need an addedToClassesStringOrArray attribute on each of the articles in the db
  //TODO We need a way to store/filter articles that belongs to certain teacher
  return (
    <React.Fragment>
      <st.StyledTeacherTextPreview>
        <div className="text-container">
          <div className="lhs">
            <Link
              to="/teacher/texts/editText/:articleID"
              onClick={setReturnPath("/teacher/texts")}
              /* eslint-disable-next-line */
            >
              <s.Title>{article.title}</s.Title>
            </Link>
            <div>
              <s.PublishingTime>(STRINGS) Added to:</s.PublishingTime>
              <s.Topics>
                {cohortlist.map((cohort) => (
                  <span key={cohort}>{cohort}</span>
                ))}
              </s.Topics>
            </div>
          </div>
          <div className="action-container">
            <s.Difficulty>{difficulty}</s.Difficulty>
            <s.WordCount>{article.metrics.word_count}</s.WordCount>
            <Link
              to="/teacher/texts/editText/:articleID"
              onClick={setReturnPath("/teacher/texts")}
            >
              <StyledButton secondary className="edit-btn">
                STRINGSEdit text
              </StyledButton>
            </Link>
            <StyledButton icon style={{margin:"0"}}>
              <MdHighlightOff size={34} />
            </StyledButton>
          </div>
        </div>
      </st.StyledTeacherTextPreview>
    </React.Fragment>
  );
}
