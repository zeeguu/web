import { Link } from "react-router-dom";
import strings from "../i18n/definitions";

export default function StudentSpecificSidebarOptions({
  resetSidebarToDefault,
  user,
  api,
}) {
  const is_teacher = user.is_teacher === "true" || user.is_teacher === true;

  return (
    <>
      <div className="navigationLink">
        <Link to="/articles" onClick={resetSidebarToDefault}>
          <small>{strings.articles}</small>
        </Link>
      </div>

      <div className="navigationLink">
        <Link to="/history" onClick={resetSidebarToDefault}>
          <small>{strings.history}</small>
        </Link>
      </div>

      <div className="navigationLink">
        <Link to="/words/translated" onClick={resetSidebarToDefault}>
          <small>{strings.words}</small>
        </Link>
      </div>
      <div className="navigationLink">
        <Link to="/exercises" onClick={resetSidebarToDefault}>
          <small>{strings.exercises}</small>
        </Link>
      </div>

      <div className="navigationLink">
        <Link to="/user_dashboard" onClick={resetSidebarToDefault}>
          <small>{strings.userDashboard}</small>
        </Link>
      </div>

      <br />

      {is_teacher && (
        <div className="navigationLink">
          <Link to="/teacher/classes" onClick={resetSidebarToDefault}>
            <small>{strings.teacherSite}</small>
          </Link>
        </div>
      )}
    </>
  );
}
