import NavOption from "../NavOption";
import NavIcon from "../NavIcon";
import { useLocation } from "react-router-dom/cjs/react-router-dom";

export default function SidebarOptions_Teacher({
  isOnStudentSide,
  screenWidth,
}) {
  const path = useLocation().pathname;
  return (
    <>
      <NavOption
        isOnStudentSide={isOnStudentSide}
        linkTo={"/teacher/classes"}
        icon={<NavIcon name="myClassrooms" />}
        text={"My Classrooms"}
        currentPath={path}
        screenWidth={screenWidth}
      />
      <NavOption
        isOnStudentSide={isOnStudentSide}
        linkTo={"/teacher/texts"}
        icon={<NavIcon name="myTexts" />}
        text={"My Texts"}
        currentPath={path}
        screenWidth={screenWidth}
      />
      <NavOption
        isOnStudentSide={isOnStudentSide}
        linkTo={"/articles"}
        icon={<NavIcon name="studentSite" />}
        text={"Student Site"}
        currentPath={path}
        screenWidth={screenWidth}
      />
    </>
  );
}
