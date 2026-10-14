import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { APIContext } from "../../../contexts/APIContext";
import LoadingAnimation from "../../../components/LoadingAnimation";
import ClassTextCard from "./ClassTextCard";
import AddTextButton from "../../myTextsPage/AddTextButton";
import { StyledButton } from "../../styledComponents/TeacherButtons.sc";
import FullWidthErrorMsg from "../../../components/FullWidthErrorMsg.sc";
import FullWidthInfoMsg from "../../../components/FullWidthInfoMsg.sc";
import ClassTabs from "./ClassTabs";
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
 * Each text shows how the class read it rather than a preview of it: the
 * teacher chose the text and knows what it says.
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
    <c.WidestColumn>
      <ClassTabs
        cohortID={cohortID}
        cohort={{ ...cohort, language_id: undefined }}
        textCount={texts.length}
        studentCount={student_count}
        onClassChanged={() => api.getCohortTextOverview(cohortID, setOverview)}
      />

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
        <AddTextButton returnPath={`/teacher/classes/viewClass/${cohortID}/texts`} />
        <Link to="/teacher/texts">
          <StyledButton $secondary>Share from My Texts</StyledButton>
        </Link>
      </s.Actions>

      {texts.length > 0 && (
        <>
          {cohort.only_classroom_texts && <s.SectionNote>Your students see only these texts.</s.SectionNote>}
          {texts.map((article) => (
            <ClassTextCard key={article.id} article={article} cohortID={cohortID} studentCount={student_count} />
          ))}
        </>
      )}
    </c.WidestColumn>
  );
}
