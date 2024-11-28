import { useContext } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { UserContext } from "../../../../contexts/UserContext";
import SidebarOptions_Student from "./SidebarOptions_Student";
import SidebarOptions_Teacher from "./SidebarOptions_Teacher";
import * as s from "./Sidebar.sc";
import NavOption from "../NavOption";
import NavIcon from "../NavIcon";
import FeedbackButton from "../../../FeedbackButton";

export default function Sidebar({ isOnStudentSide, isTeacher }) {
  const { is_teacher } = useContext(UserContext);

  const path = useLocation().pathname;
  const defaultPage = is_teacher ? "/teacher/classes" : "articles";

  return (
    <s.SideBar
      isOnStudentSide={isOnStudentSide}
      role="navigation"
      aria-label="Sidebar Navigation"
    >
      <NavOption
        className={"logo"}
        linkTo={defaultPage}
        icon={<img src="../static/images/zeeguuWhiteLogo.svg"></img>}
        text={"Zeeguu"}
      ></NavOption>

      {isOnStudentSide && (
        <SidebarOptions_Student
          currentPath={path}
          isOnStudentSide={isOnStudentSide}
          isTeacher={isTeacher}
        />
      )}

      {!isOnStudentSide && (
        <SidebarOptions_Teacher
          currentPath={path}
          isOnStudentSide={isOnStudentSide}
        />
      )}

      <s.BottomSection isOnStudentSide={isOnStudentSide}>
        <NavOption
          isOnStudentSide={isOnStudentSide}
          linkTo={"/account_settings"}
          icon={<NavIcon name="settings" />}
          text={"Settings"}
          currentPath={path}
        />

        <FeedbackButton isOnStudentSide={isOnStudentSide} />
      </s.BottomSection>
    </s.SideBar>
  );
}
