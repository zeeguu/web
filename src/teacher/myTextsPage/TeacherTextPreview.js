import React, { useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import { RoutingContext } from "../../contexts/RoutingContext";
import strings from "../../i18n/definitions";
import { StyledButton } from "../styledComponents/TeacherButtons.sc";
import * as st from "../styledComponents/TeacherTextPreview.sc";
import * as s from "../../articles/ArticlePreview.sc";

export default function TeacherTextPreview({ article }) {
  //Setting up the routing context to be able to route correctly on Cancel
  const { setReturnPath } = useContext(RoutingContext);

  const difficulty = Math.round(article.metrics.difficulty * 100) / 10;

  const shortenedTitle = article.title.substring(0, 128);

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
              <s.Title>{shortenedTitle}</s.Title>
            </Link>
            <div>
              <s.PublishingTime>
                {cohortList.length === 0 ? (
                  <p className="not-added">{strings.shareTextWithClasses}</p>
                ) : (
                  strings.addedTo
                )}
              </s.PublishingTime>
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
                {strings.editText}
              </StyledButton>
            </Link>
          </div>
        </div>
      </st.StyledTeacherTextPreview>
    </Fragment>
  );
}
