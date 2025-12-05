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
import useBrowsingSession from "../hooks/useBrowsingSession";

export default function ClassroomArticles() {
  const api = useContext(APIContext);
  useBrowsingSession("classroom");
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
