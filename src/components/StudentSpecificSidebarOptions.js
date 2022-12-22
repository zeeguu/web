import { Link, useLocation } from "react-router-dom";
import strings from "../i18n/definitions";

export default function StudentSpecificSidebarOptions({
  resetSidebarToDefault,
  user,
  api,
}) {
  const is_teacher = user.is_teacher === "true" || user.is_teacher === true;

  const path = useLocation().pathname;
  console.log(path);

  function SidebarLink({ text, to }) {
    // if path starts with to, then we are on that page
    const active = path.startsWith(to);
    const fontWeight = active ? "700" : "500";

    return (
      <div className="navigationLink">
        <Link to={to} onClick={resetSidebarToDefault}>
          <small style={{ fontWeight: fontWeight }}>{text}</small>
        </Link>
      </div>
    );
  }

  return (
    <>
      <SidebarLink text={strings.articles} to="/articles" />

      <SidebarLink text={strings.words} to="/words" />

      <SidebarLink text={strings.exercises} to="/exercises" />

      <br />

      <SidebarLink text={strings.history} to="/history" />

      <SidebarLink text={strings.userDashboard} to="/user_dashboard" />

      <br />

      {is_teacher && (
        <SidebarLink text={strings.teacherSite} to="/teacher/classes" />
      )}

      <SidebarLink text={strings.settings} to="/account_settings" />

      <div className="navigationLink">
        <Link
          to="/"
          onClick={() => {
            user.logoutMethod();
          }}
        >
          <small>{strings.logout}</small>
        </Link>
      </div>
    </>
  );
}
