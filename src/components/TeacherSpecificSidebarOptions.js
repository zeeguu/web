import { Link } from "react-router-dom";
import strings from "../i18n/definitions";

export default function StudentSpecificSidebarOptions({
  resetSidebarToDefault,
  user,
  setIsOnStudentSide,
}) {
  return (
    <>
      <div className="navigationLink">
        <Link to="/articles" onClick={resetSidebarToDefault}>
          <small>{strings.articles}</small>
        </Link>
      </div>
    </>
  );
}
