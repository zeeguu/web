import React, { useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import { RoutingContext } from "../../contexts/RoutingContext";
import strings from "../../i18n/definitions";
import { StyledButton } from "../styledComponents/TeacherButtons.sc";
import * as st from "../styledComponents/TeacherTextPreview.sc";
import * as s from "../../articles/ArticlePreviewList.sc";
import ArticleStatInfo from "../../components/ArticleStatInfo";

export default function TeacherTextPreview({ article }) {
  //Setting up the routing context to be able to route correctly on Cancel
  const { setReturnPath } = useContext(RoutingContext);

  const shortenedTitle = article.title.substring(0, 128);
  let cefr_level = article.metrics.cefr_level;
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
            <div className="added-container">
              <br />
              {cohortList.length === 0 ? (
                <p className="not-added">{strings.shareTextWithClasses}</p>
              ) : (
                strings.addedTo
              )}
              <div className="classes-container">
                {cohortList.map((cohort) => (
                  <s.Topics key={cohort}>
                    <span className="added-to">{cohort}</span>
                  </s.Topics>
                ))}
              </div>
            </div>
          </div>
          <div className="action-container">
            <ArticleStatInfo cefr_level={cefr_level} articleInfo={article} />
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
