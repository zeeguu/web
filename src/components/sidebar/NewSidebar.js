import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import SidebarOptions_Student from "./SidebarOptions_Student";
import SidebarOptions_Teacher from "./SidebarOptions_Teacher";
import * as s from "./NewSidebar.sc";
import { Link } from "react-router-dom/cjs/react-router-dom";
import NavLink from "./NavOption";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import FeedbackButton from "../FeedbackButton";
import DoubleArrowRight from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import DoubleArrowLeft from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";

export default function NewSidebar({ isCollapsed, setIsCollapsed }) {
  const user = useContext(UserContext);
  const [isOnStudentSide, setIsOnStudentSide] = useState(true);
  const [isTeacher] = useState(user.is_teacher);

  const path = useLocation().pathname;
  const defaultPage = user.is_teacher ? "/teacher/classes" : "articles";

  useEffect(() => {
    setIsOnStudentSide(!path.includes("teacher"));
  }, [path]);

  return (
    <s.SideBar
      isCollapsed={isCollapsed}
      isOnStudentSide={isOnStudentSide}
      role="navigation"
      aria-label="Sidebar Navigation"
    >
      <s.LogoLink>
        {/* <Link to={defaultPage}> */}
        <s.Logotype>Zeeguu </s.Logotype>
        {/* </Link> */}
      </s.LogoLink>

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

      <NavLink
        isOnStudentSide={isOnStudentSide}
        linkTo={"/account_settings/options"}
        icon={<SettingsRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Settings"}
        currentPath={path}
      />
      <FeedbackButton isCollapsed={isCollapsed} />

      <NavLink
        icon={isCollapsed ? <DoubleArrowRight /> : <DoubleArrowLeft />}
        isCollapsed={isCollapsed}
        text={isCollapsed ? "Expand" : "Collapse"}
        isButton={true}
        onClick={() => setIsCollapsed(!isCollapsed)}
      />
    </s.SideBar>
  );
}
