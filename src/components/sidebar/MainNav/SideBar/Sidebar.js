import { useContext } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { UserContext } from "../../../../contexts/UserContext";
import SidebarOptions_Student from "./SidebarOptions_Student";
import SidebarOptions_Teacher from "./SidebarOptions_Teacher";
import * as s from "./Sidebar.sc";
import NavOption from "../NavOption";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import FeedbackButton from "../../../FeedbackButton";
import DoubleArrowRight from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import DoubleArrowLeft from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isOnStudentSide,
  isTeacher,
}) {
  const { is_teacher } = useContext(UserContext);

  const path = useLocation().pathname;
  const defaultPage = is_teacher ? "/teacher/classes" : "articles";

  return (
    <s.SideBar
      isCollapsed={isCollapsed}
      isOnStudentSide={isOnStudentSide}
      role="navigation"
      aria-label="Sidebar Navigation"
    >
      <NavOption
        className={"logo"}
        linkTo={defaultPage}
        icon={<img src="../static/images/zeeguuWhiteLogo.svg"></img>}
        isCollapsed={isCollapsed}
        text={"Zeeguu"}
      ></NavOption>

      {isOnStudentSide && (
        <SidebarOptions_Student
          isCollapsed={isCollapsed}
          currentPath={path}
          isOnStudentSide={isOnStudentSide}
          isTeacher={isTeacher}
        />
      )}

      {!isOnStudentSide && (
        <SidebarOptions_Teacher
          isCollapsed={isCollapsed}
          currentPath={path}
          isOnStudentSide={isOnStudentSide}
        />
      )}

      <s.BottomSection
        isCollapsed={isCollapsed}
        isOnStudentSide={isOnStudentSide}
      >
        <NavOption
          isOnStudentSide={isOnStudentSide}
          linkTo={"/account_settings"}
          icon={<SettingsRoundedIcon />}
          isCollapsed={isCollapsed}
          text={"Settings"}
          currentPath={path}
        />

        <FeedbackButton isCollapsed={isCollapsed} />

        <NavOption
          icon={isCollapsed ? <DoubleArrowRight /> : <DoubleArrowLeft />}
          isCollapsed={isCollapsed}
          text={isCollapsed ? "Expand" : "Collapse"}
          isButton={true}
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </s.BottomSection>
    </s.SideBar>
  );
}
