import NavOption from "../NavOption";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ChromeReaderModeRoundedIcon from "@mui/icons-material/ChromeReaderModeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

export default function SidebarOptions_Teacher({
  isCollapsed,
  currentPath,
  isOnStudentSide,
}) {
  return (
    <>
      <NavOption
        isOnStudentSide={isOnStudentSide}
        linkTo={"/teacher/classes"}
        icon={<GroupsRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"My Classrooms"}
        currentPath={currentPath}
      />
      <NavOption
        isOnStudentSide={isOnStudentSide}
        linkTo={"/teacher/texts"}
        icon={<ChromeReaderModeRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"My Texts"}
        currentPath={currentPath}
      />
      <NavOption
        isOnStudentSide={isOnStudentSide}
        linkTo={"/articles"}
        icon={<SchoolRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Student Site"}
        currentPath={currentPath}
      />
    </>
  );
}
