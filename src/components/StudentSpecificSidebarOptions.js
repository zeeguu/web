import { Link } from "react-router-dom";
import strings from "../i18n/definitions";

export default function StudentSpecificSidebarOptions({ SidebarLink, user }) {
  const is_teacher = user.is_teacher === "true" || user.is_teacher === true;

  return (
    <>
      <SidebarLink text="Articles" to="/articles" icon="book-open-line.svg" />

      {/*<SidebarLink text={strings.words} to="/words" />*/}

      <SidebarLink
        text={strings.exercises}
        to="/exercises"
        icon="shapes-line.svg"
      />

      <SidebarLink
        text={strings.history}
        to="/history"
        icon="history-line.svg"
      />

      <SidebarLink
        text={strings.userDashboard}
        to="/user_dashboard"
        icon="bar-chart-box-line.svg"
      />

      {is_teacher && (
        <SidebarLink
          text="My Classes"
          to="/teacher/classes"
          icon="graduation-cap-line.svg"
        />
      )}

      {is_teacher && (
        <SidebarLink
          text="My Uploads"
          to="/teacher/texts"
          icon="file-upload-line.svg"
        />
      )}

      <SidebarLink
        text={strings.settings}
        to="/account_settings"
        icon="settings-2-line.svg"
      />

      {/*<div className="navigationLink">*/}
      {/*  <Link*/}
      {/*    to="/"*/}
      {/*    onClick={() => {*/}
      {/*      user.logoutMethod();*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <small>{strings.logout}</small>*/}
      {/*  </Link>*/}
      {/*</div>*/}
    </>
  );
}
