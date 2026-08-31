import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { APIContext } from "../../../contexts/APIContext";
import LoadingAnimation from "../../../components/LoadingAnimation";
import ArticlePreview from "../../../articles/ArticlePreview";
import { StyledButton } from "../../styledComponents/TeacherButtons.sc";
import FullWidthErrorMsg from "../../../components/FullWidthErrorMsg.sc";
import FullWidthInfoMsg from "../../../components/FullWidthInfoMsg.sc";
import ClassTabs from "./ClassTabs";
import { TeacherPageSubtitle } from "../../styledComponents/TeacherPageHeading.sc";
import { languageName } from "../../../utils/misc/languageCodeToName";
import { setTitle } from "../../../assorted/setTitle";
import * as c from "../../../components/ColumnWidth.sc";
import * as s from "./ClassTexts.sc";

function pluralStudents(n) {
  return `${n} ${n === 1 ? "student" : "students"}`;
}

/**
 * What this class's students see, from the class's side.
 *
 * Deliberately renders the student's own ArticlePreview rather than the
 * teacher-side row: the point is to show the real thing, not a teacher's
 * approximation of it.
 *
 * A student whose learned language differs from the class's sees none of these
 * texts, but the empty classroom now tells them so and offers the switch, so
 * there is nothing here for the teacher to act on and no warning about it.
 */
export default function ClassTexts() {
  const api = useContext(APIContext);
  const cohortID = useParams().cohortID;
  const [overview, setOverview] = useState(null);

  setTitle("Class Texts");

  useEffect(() => {
    api.getCohortTextOverview(cohortID, setOverview);
    // eslint-disable-next-line
  }, [cohortID]);

  if (overview === null) return <LoadingAnimation />;

  const { cohort, texts, student_count } = overview;

  // A text in another language can be shared with this class, and then no
  // student ever sees it: they only get the texts in the language they are
  // learning. Seven classes are in this state today. The teacher is the one
  // who can fix it, so the count goes to them rather than to the students.
  //
  // Only meaningful once the class has a language: without one there is
  // nothing for a text to be "off", and treating null as a language would
  // declare every text unreachable -- both alarming and untrue, since the
  // student filter compares the article's language to the student's own and
  // never consults the class's.
  const offLanguage = (cohort.language ? overview.texts_by_language || [] : []).filter(
    (each) => each.code !== cohort.language,
  );
  const offLanguageCount = offLanguage.reduce((total, each) => total + each.count, 0);

  const nothingShared = texts.length === 0;
  const emptyForEveryone = nothingShared && cohort.only_classroom_texts;

  return (
    <c.NarrowColumn>
      <ClassTabs
        cohortID={cohortID}
        cohort={{ ...cohort, language_id: undefined }}
        textCount={texts.length}
        studentCount={student_count}
        onClassChanged={() => api.getCohortTextOverview(cohortID, setOverview)}
      />
      <TeacherPageSubtitle>
        {cohort.language ? languageName(cohort.language) : "no language set"} · {pluralStudents(student_count)}
      </TeacherPageSubtitle>

      {emptyForEveryone && (
        <FullWidthErrorMsg>
          <span>
            This class has no texts, and its students see nothing else. Until you add one,
            Zeeguu opens on an empty page for all {pluralStudents(student_count)}.
          </span>
        </FullWidthErrorMsg>
      )}

      {offLanguageCount > 0 && (
        <FullWidthInfoMsg>
          <span>
            {offLanguageCount === 1 ? "One text here is" : `${offLanguageCount} texts here are`} not
            in {languageName(cohort.language)} —{" "}
            {offLanguage
              .map((each) => `${each.count} in ${languageName(each.code)}`)
              .join(", ")}
            . Your students only ever see the texts in the language they are
            learning, so nobody in this class can open{" "}
            {offLanguageCount === 1 ? "it" : "them"}.
          </span>
        </FullWidthInfoMsg>
      )}

      {nothingShared && !emptyForEveryone && (
        <FullWidthInfoMsg>No texts shared with this class yet.</FullWidthInfoMsg>
      )}

      <s.Actions>
        <Link to="/teacher/texts/AddTextOptions">
          <StyledButton $primary>Add a text</StyledButton>
        </Link>
        <Link to="/teacher/texts">
          <StyledButton $secondary>Share from My Texts</StyledButton>
        </Link>
      </s.Actions>

      {texts.length > 0 && (
        <>
          {/* The teacher's own "Student Site" link cannot show them this: they
              are exempt from classroom_only, so it hands them the full app.
              Saying which mode the class is in is the honest substitute. */}
          <s.SectionLabel>
            {cohort.only_classroom_texts
              ? "All your students see — there is nothing else in their app"
              : "As a student in this class sees it"}
          </s.SectionLabel>
          <s.StudentView>
            {texts.map((article) => (
              <ArticlePreview key={article.id} article={article} previewOnly={true} />
            ))}
          </s.StudentView>
        </>
      )}
    </c.NarrowColumn>
  );
}
