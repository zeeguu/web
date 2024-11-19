import NavLink from "./NavLInk";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import DonutSmallRoundedIcon from "@mui/icons-material/DonutSmallRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";

export default function SidebarOptions_Student({
  isCollapsed,
  currentPath,
  isOnStudentSide,
  isTeacher,
}) {
  return (
    <>
      <NavLink
        linkTo={"/articles"}
        icon={<HomeRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Home"}
        currentPath={currentPath}
      />
      <NavLink
        linkTo={"/exercises"}
        icon={<CategoryRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Exercises"}
        currentPath={currentPath}
      />
      <NavLink
        linkTo={"/words"}
        icon={<AssignmentRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Words"}
        currentPath={currentPath}
      />
      <NavLink
        linkTo={"/account_settings/language_settings"}
        icon={<TranslateRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Language"}
        currentPath={currentPath}
      />
      <NavLink
        linkTo={"/history"}
        icon={<HistoryRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"History"}
        currentPath={currentPath}
      />
      <NavLink
        linkTo={"/user_dashboard"}
        icon={<DonutSmallRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Statistics"}
        currentPath={currentPath}
      />
      {isTeacher && (
        <NavLink
          linkTo={"/teacher/classes"}
          icon={<BusinessCenterRoundedIcon />}
          isCollapsed={isCollapsed}
          text={"Teacher Site"}
          currentPath={currentPath}
        />
      )}
    </>
  );
}
