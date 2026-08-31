import { Fragment, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import ArticlePreview from "./ArticlePreview";
import { browsingModeProps } from "./browsingMode";
import LocalStorage from "../assorted/LocalStorage";
import SortingButtons from "./SortingButtons";
import { OrangeRoundButton } from "../components/allButtons.sc";
import * as s from "../components/TopMessage.sc";
import { APIContext } from "../contexts/APIContext";
import ClassroomOtherLanguages, {
  otherLanguageOptions,
} from "./ClassroomOtherLanguages";
import { ALL, buildClassFilters, filterTexts } from "../utils/misc/classFilters";
import * as f from "../teacher/styledComponents/TextFilterBar.sc";

export default function ClassroomArticles() {
  const api = useContext(APIContext);
  const [articleList, setArticleList] = useState(null);
  const [student, setStudent] = useState(null);
  const [activeClass, setActiveClass] = useState(ALL);

  let originalList = articleList;

  useEffect(() => {
    setTitle("Classroom Articles");
    api.getStudent(setStudent);
    api.getCohortArticles(setArticleList); // eslint-disable-next-line
  }, []);

  if (articleList == null) {
    // Shorter delay than the 1s default: swipe navigation slides the old tab
    // away and leaves a blank panel, so the spinner needs to land sooner.
    return <LoadingAnimation delay={300} />;
  }

  if (articleList.length === 0) {
    // Cohort membership is fetched separately and may still be in flight.
    // Don't guess the empty message yet, or we flash "You have not joined a
    // class" (no cohorts on a null student) before settling on "no articles in
    // your classroom" once getStudent resolves.
    if (student === null) {
      return <LoadingAnimation delay={300} />;
    }

    const studentJoinedCohort = student.cohorts.length > 0;

    // The feed filters cohort texts by the student's learned language, so a
    // class taught in another language looks indistinguishable from a class
    // the teacher never filled. Say which language it is, and offer the switch.
    const otherLanguages = otherLanguageOptions(
      student.cohorts,
      student.learned_language,
    );
    if (otherLanguages.length > 0) {
      return (
        <ClassroomOtherLanguages
          options={otherLanguages}
          learnedLanguage={student.learned_language}
        />
      );
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

  // The class tags need to know how many classes this student has, and that
  // arrives on a separate request. Waiting is better than rendering the list
  // untagged and having the tags pop in when getStudent lands -- the empty
  // path above waits for the same reason.
  if (student === null) {
    return <LoadingAnimation delay={300} />;
  }

  const inMoreThanOneClass = student.cohorts.length > 1;

  // With several classes the list is a merge, and a term's reading from each
  // adds up: filter by class, the same chips the teacher gets on My Texts.
  const classFilters = inMoreThanOneClass
    ? buildClassFilters(articleList, { allLabel: "All classes" })
    : [];
  const visible = inMoreThanOneClass ? filterTexts(articleList, activeClass) : articleList;

  return (
    <>
      <br />
      <br />
      {inMoreThanOneClass && (
        <f.FilterBar>
          {classFilters.map((filter) => (
            <f.Chip
              key={filter.id}
              type="button"
              $on={activeClass === filter.id}
              aria-pressed={activeClass === filter.id}
              onClick={() => setActiveClass(filter.id)}
            >
              {filter.name}
              <f.ChipCount>{filter.count}</f.ChipCount>
            </f.Chip>
          ))}
        </f.FilterBar>
      )}
      <SortingButtons articleList={articleList} originalList={originalList} setArticleList={setArticleList} />
      {visible.map((each) => (
        <ArticlePreview
          key={each.id}
          article={each}
          showClassNames={inMoreThanOneClass}
          {...browsingModeProps(LocalStorage.getBrowsingMode())}
          // Hiding is "not interested", which a class text is not: the list is
          // what the teacher assigned, and a student who dismissed one would
          // have to find it again through the hidden-articles page.
          allowHiding={false}
        />
      ))}
    </>
  );
}
