import NavOption from "../NavOption";
import NavIcon from "../NavIcon";

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
        icon={<NavIcon name="myClassrooms" />}
        isCollapsed={isCollapsed}
        text={"My Classrooms"}
        currentPath={currentPath}
      />
      <NavOption
        isOnStudentSide={isOnStudentSide}
        linkTo={"/teacher/texts"}
        icon={<NavIcon name="myTexts" />}
        isCollapsed={isCollapsed}
        text={"My Texts"}
        currentPath={currentPath}
      />
      <NavOption
        isOnStudentSide={isOnStudentSide}
        linkTo={"/articles"}
        icon={<NavIcon name="studentSite" />}
        isCollapsed={isCollapsed}
        text={"Student Site"}
        currentPath={currentPath}
      />
    </>
  );
}
