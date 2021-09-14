import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import strings from "../i18n/definitions";

export default function StudentSpecificSidebarOptions({
  resetSidebarToDefault,
  user,
  api,
}) {
  const is_teacher = user.is_teacher === "true" || user.is_teacher === true;
  const [showActivityDashboard, setShowActivityDashboard] = useState(false);

  useEffect(() => {
    api.ifActivityDashboard(setShowActivityDashboard);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="navigationLink">
        <Link to="/articles" onClick={resetSidebarToDefault}>
          <small>{strings.articles}</small>
        </Link>
      </div>
      <div className="navigationLink">
        <Link to="/words/history" onClick={resetSidebarToDefault}>
          <small>{strings.words}</small>
        </Link>
      </div>
      <div className="navigationLink">
        <Link to="/exercises" onClick={resetSidebarToDefault}>
          <small>{strings.exercises}</small>
        </Link>
      </div>

      {showActivityDashboard && (
        <div className="navigationLink">
          <Link to="/user_dashboard" onClick={resetSidebarToDefault}>
            <small>{strings.userDashboard}</small>
            <sup className="newLink">New!</sup>
          </Link>
        </div>
      )}

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
