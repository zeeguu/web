import NavOption from "../NavOption";
import NavIcon from "../NavIcon";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import strings from "../../../i18n/definitions";

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
        text={strings.myClasses}
        currentPath={path}
        screenWidth={screenWidth}
      />
      <NavOption
        isOnStudentSide={isOnStudentSide}
        linkTo={"/teacher/texts"}
        icon={<NavIcon name="myTexts" />}
        text={strings.myTexts}
        currentPath={path}
        screenWidth={screenWidth}
      />
      <NavOption
        isOnStudentSide={isOnStudentSide}
        linkTo={"/articles"}
        icon={<NavIcon name="studentSite" />}
        text={strings.studentSite}
        currentPath={path}
        screenWidth={screenWidth}
      />
    </>
  );
}
