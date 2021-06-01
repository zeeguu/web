import { Fragment, useEffect, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";

import ArticlePreview from "./ArticlePreview";

import SortingButtons from "./SortingButtons";

import { StyledButton, TopButtonWrapper } from "../teacher/TeacherButtons.sc";
import { OrangeRoundButton } from "../components/allButtons.sc";

import * as s from "../components/TopMessage.sc";
import * as sc from "../components/ColumnWidth.sc";
import { Link } from "react-router-dom";

export default function ClassroomArticles({ api }) {
  const [articleList, setArticleList] = useState(null);
  const [studentJoinedCohort, setStudentJoinedCohort] = useState(null);

  let originalList = articleList;

  useEffect(() => {
    api.getStudent((student) =>
      setStudentJoinedCohort(student.cohort_id !== null)
    );
  }, []);

  if (articleList == null) {
    api.getCohortArticles((articles) => {
      setArticleList(articles);
    });

    setTitle("Classroom Articles");

    return <LoadingAnimation />;
  }

  if (articleList.length === 0) {
    return (
      <Fragment>
        {!studentJoinedCohort ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <h4> You haven't joined a class yet. </h4>
            <Link to={`/account_settings`}>
              <OrangeRoundButton> STRINGS Join class </OrangeRoundButton>
            </Link>
          </div>
        ) : (
          <s.TopMessage>{strings.noArticlesInClassroom}</s.TopMessage>
        )}
      </Fragment>
    );
  }

  return (
    <>
      <br />
      <br />
      <SortingButtons
        articleList={articleList}
        originalList={originalList}
        setArticleList={setArticleList}
      />
      {articleList.map((each) => (
        <ArticlePreview key={each.id} article={each} dontShowImage={true} />
      ))}
    </>
  );
}
