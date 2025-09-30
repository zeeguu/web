import React, { useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import { RoutingContext } from "../../contexts/RoutingContext";
import strings from "../../i18n/definitions";
import { StyledButton } from "../styledComponents/TeacherButtons.sc";
import * as st from "../styledComponents/TeacherTextPreview.sc";
import * as s from "../../articles/ArticlePreview.sc";
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
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.75rem' }}>
              <Link
                to={`/teacher/texts/editText/${article.id}`}
                onClick={() => setReturnPath("/teacher/texts")}
              >
                <s.Title>{shortenedTitle}</s.Title>
              </Link>
              <Link
                to={`/teacher/texts/editText/${article.id}`}
                onClick={() => setReturnPath("/teacher/texts")}
              >
                <StyledButton secondary className="edit-btn">
                  Edit
                </StyledButton>
              </Link>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <ArticleStatInfo cefr_level={cefr_level} articleInfo={article} />
            </div>
            {cohortList.length > 0 && (
              <div className="added-container" style={{ marginTop: '0.5rem' }}>
                <span style={{ fontWeight: 'bold' }}>Shared With: </span>
                {cohortList.map((cohort, index) => (
                  <span key={cohort}>
                    {cohort}
                    {index < cohortList.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </st.StyledTeacherTextPreview>
    </Fragment>
  );
}
