import { useLocation } from "react-router-dom/cjs/react-router-dom";
import NavIcon from "../NavIcon";
import BottomNavOption from "./BottomNavOption";
import strings from "../../../i18n/definitions";

export default function BottomNavOptionsForTeacher({ isOnStudentSide }) {
  const path = useLocation().pathname;
  return (
    <>
      <BottomNavOption
        linkTo={"/teacher/classes"}
        currentPath={path}
        icon={<NavIcon name="myClassrooms" />}
        text={strings.myClasses}
        isOnStudentSide={isOnStudentSide}
      />

      <BottomNavOption
        linkTo={"/teacher/texts"}
        currentPath={path}
        icon={<NavIcon name="myTexts" />}
        text={strings.myTexts}
        isOnStudentSide={isOnStudentSide}
      />
    </>
  );
}
