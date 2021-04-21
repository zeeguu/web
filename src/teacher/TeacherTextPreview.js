import React, { useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import { RoutingContext } from "../contexts/RoutingContext";
//import strings from "../i18n/definitions";
import { MdHighlightOff } from "react-icons/md/";
import { StyledButton } from "./TeacherButtons.sc";
import * as st from "./TeacherTextPreview.sc";
import * as s from "../articles/ArticlePreview.sc";

export default function TeacherTextPreview({ article }) {
  //Setting up the routing context to be able to route correctly on Cancel
  const { setReturnPath } = useContext(RoutingContext);

  const difficulty = Math.round(article.metrics.difficulty * 100) / 10;

  const cohortList = article.cohorts;

  return (
    <Fragment>
      <st.StyledTeacherTextPreview>
        <div className="text-container">
          <div className="lhs">
            <Link
              to={`/teacher/texts/editText/${article.id}`}
              onClick={() => setReturnPath("/teacher/texts")}
            >
              <s.Title>{article.title}</s.Title>
            </Link>
            <div>
              <s.PublishingTime>(STRINGS) Added to:</s.PublishingTime>
              <s.Topics>
                {cohortList.map((cohort) => (
                  <span className="added-to" key={cohort}>
                    {cohort}
                  </span>
                ))}
              </s.Topics>
            </div>
          </div>
          <div className="action-container">
            <s.WordCount>{article.metrics.word_count}</s.WordCount>
            <s.Difficulty>{difficulty}</s.Difficulty>
            <Link
              to={`/teacher/texts/editText/${article.id}`}
              onClick={() => setReturnPath("/teacher/texts")}
            >
              <StyledButton secondary className="edit-btn">
                STRINGSEdit text
              </StyledButton>
            </Link>
            <StyledButton icon style={{ margin: "0" }}>
              <MdHighlightOff size={35} />
            </StyledButton>
          </div>
        </div>
      </st.StyledTeacherTextPreview>
    </Fragment>
  );
}
