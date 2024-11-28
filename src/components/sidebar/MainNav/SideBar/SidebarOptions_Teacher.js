import NavOption from "../NavOption";
import NavIcon from "../NavIcon";

export default function SidebarOptions_Teacher({
  currentPath,
  isOnStudentSide,
}) {
  return (
    <>
      <NavOption
        isOnStudentSide={isOnStudentSide}
        linkTo={"/teacher/classes"}
        icon={<NavIcon name="myClassrooms" />}
        text={"My Classrooms"}
        currentPath={currentPath}
      />
      <NavOption
        isOnStudentSide={isOnStudentSide}
        linkTo={"/teacher/texts"}
        icon={<NavIcon name="myTexts" />}
        text={"My Texts"}
        currentPath={currentPath}
      />
      <NavOption
        isOnStudentSide={isOnStudentSide}
        linkTo={"/articles"}
        icon={<NavIcon name="studentSite" />}
        text={"Student Site"}
        currentPath={currentPath}
      />
    </>
  );
}
