import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import strings from "../i18n/definitions";

import * as s from "./SideBar.sc";

export default function SideBar(props) {
  const user = useContext(UserContext);
  const [initialSidebarState, setInitialSidebarState] = useState(true);
  const [isOnStudentSide, setIsOnStudentSide] = useState();

  //setting the state of the landingpage depending on whether the user is a student or a teacher
  useEffect(() => {
    if (user.is_teacher) {
      setIsOnStudentSide(false);
    }
    // eslint-disable-next-line
  }, []);

  function toggleSidebar(e) {
    e.preventDefault();
    setInitialSidebarState(!initialSidebarState);
  }

  function resetSidebarToDefault(e) {
    setInitialSidebarState(true);
  }

  function changeSide() {
    resetSidebarToDefault();
    setIsOnStudentSide(!isOnStudentSide);
  }

  let sidebarContent = (
    <>
      <div className="logo">
        <a href="/articles" rel="external">
          <img
            src="/static/images/zeeguuWhiteLogo.svg"
            alt="Zeeguu Logo - The Elephant"
          />
        </a>
      </div>
      <div className="arrowHolder">
        <span className="toggleArrow" onClick={toggleSidebar}>
          ▲
        </span>
      </div>
      {(!user.is_teacher ||
        (user.is_teacher &&
          (isOnStudentSide === "true" || isOnStudentSide === true))) && (
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
        </>
      )}
      {user.is_teacher &&
        (isOnStudentSide === "true" || isOnStudentSide === true) && (
          <div className="navigationLink">
            <Link
              /* target="_blank" */
              to="/teacher"
              onClick={changeSide}
            >
              <small>{strings.teacherSite}</small>
            </Link>
          </div>
        )}

      {user.is_teacher &&
        (isOnStudentSide === "false" || isOnStudentSide === false) && (
          <>
            <div className="navigationLink">
              <Link to="/teacher_classes" onClick={resetSidebarToDefault}>
                <small>{strings.myClasses}</small>
              </Link>
            </div>
            <div className="navigationLink">
              <Link to="teacher_texts"onClick={resetSidebarToDefault}>
                <small>{strings.myTexts}</small>
              </Link>
            </div>
            <div className="navigationLink">
              <Link to="/teacher_tutorials" onClick={resetSidebarToDefault}>
                <small>{strings.tutorials}</small>
              </Link>
            </div>
            <div className="navigationLink">
              <Link
                /* target="_blank" */
                to="/articles"
                onClick={changeSide}
              >
                <small>{strings.studentSite}</small>
              </Link>
            </div>
          </>
        )}

      <br />
      <div className="navigationLink">
        <Link to="/account_settings" onClick={resetSidebarToDefault}>
          <small>{strings.settings}</small>
        </Link>
      </div>
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

  if (!initialSidebarState) {
    return (
      <s.SideBarToggled>
        {sidebarContent}
        <s.MainContentToggled>{props.children}</s.MainContentToggled>
      </s.SideBarToggled>
    );
  }

  return (
    <s.SideBarInitial>
      {sidebarContent}
      <s.MainContentInitial>{props.children}</s.MainContentInitial>
    </s.SideBarInitial>
  );
}
