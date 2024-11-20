import NavOption from "./NavOption";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import DonutSmallRoundedIcon from "@mui/icons-material/DonutSmallRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";

export default function SidebarOptions_Student({
  isCollapsed,
  currentPath,
  isTeacher,
}) {
  return (
    <>
      <NavOption
        linkTo={"/articles"}
        icon={<HomeRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Home"}
        currentPath={currentPath}
      />

      <NavOption
        linkTo={"/exercises"}
        icon={<CategoryRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Exercises"}
        currentPath={currentPath}
      />

      <NavOption
        linkTo={"/words"}
        icon={<AssignmentRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Words"}
        currentPath={currentPath}
      />

      <NavOption
        linkTo={"/history"}
        icon={<HistoryRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"History"}
        currentPath={currentPath}
      />

      <NavOption
        linkTo={"/user_dashboard"}
        icon={<DonutSmallRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Statistics"}
        currentPath={currentPath}
      />

      {isTeacher && (
        <NavOption
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
