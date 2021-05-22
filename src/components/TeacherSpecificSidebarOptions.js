import { Link } from "react-router-dom";
import strings from "../i18n/definitions";

export default function TeacherSpecificSidebarOptions({
  resetSidebarToDefault,
  user,
  setIsOnStudentSide,
}) {
  return (
    <>
    <div className="navigationLink">
      <Link to="/teacher/classes" onClick={resetSidebarToDefault}>
        <small>{strings.myClasses}</small>
      </Link>
    </div>
    <div className="navigationLink">
      <Link to="/teacher/texts" onClick={resetSidebarToDefault}>
        <small>{strings.myTexts}</small>
      </Link>
    </div>
    <div className="navigationLink">
      <Link to="/teacher/tutorials" onClick={resetSidebarToDefault}>
        <small>{strings.tutorials}</small>
      </Link>
    </div>
    <div className="navigationLink">
      <Link to="/articles" onClick={resetSidebarToDefault}>
        <small>{strings.studentSite}</small>
      </Link>
    </div>
  </>
  );
}
