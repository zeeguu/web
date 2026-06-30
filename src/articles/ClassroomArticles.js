import { Fragment, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import ArticlePreview from "./ArticlePreview";
import SortingButtons from "./SortingButtons";
import { OrangeRoundButton } from "../components/allButtons.sc";
import * as s from "../components/TopMessage.sc";
import { APIContext } from "../contexts/APIContext";
export default function ClassroomArticles() {
  const api = useContext(APIContext);
  const [articleList, setArticleList] = useState(null);
  const [studentJoinedCohort, setStudentJoinedCohort] = useState(null);

  let originalList = articleList;

  useEffect(() => {
    api.getStudent((student) => {
      setStudentJoinedCohort(student.cohorts.length > 0);
    }); // eslint-disable-next-line
  }, []);

  if (articleList == null) {
    api.getCohortArticles((articles) => {
      setArticleList(articles);
    });

    setTitle("Classroom Articles");

    // Shorter delay than the 1s default: swipe navigation slides the old tab
    // away and leaves a blank panel, so the spinner needs to land sooner.
    return <LoadingAnimation delay={300} />;
  }

  if (articleList.length === 0) {
    // Cohort membership is fetched separately and may still be in flight.
    // Don't guess the empty message yet, or we flash "You have not joined a
    // class" (studentJoinedCohort still null → falsy) before settling on
    // "no articles in your classroom" once getStudent resolves.
    if (studentJoinedCohort === null) {
      return <LoadingAnimation delay={300} />;
    }
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
            <h4> {strings.youHaveNotJoinedAClass} </h4>
            <Link to={`/account_settings`}>
              <OrangeRoundButton> {strings.joinClass} </OrangeRoundButton>
            </Link>
          </div>
        ) : (
          <s.YellowMessageBox>{strings.noArticlesInClassroom}</s.YellowMessageBox>
        )}
      </Fragment>
    );
  }

  return (
    <>
      <br />
      <br />
      <SortingButtons articleList={articleList} originalList={originalList} setArticleList={setArticleList} />
      {articleList.map((each) => (
        <ArticlePreview key={each.id} article={each} dontShowSourceIcon={true} />
      ))}
    </>
  );
}
