import { useLocation } from "react-router-dom/cjs/react-router-dom";
import NavIcon from "../NavIcon";
import BottomNavOption from "./BottomNavOption";

export default function BottomNav_Teacher({ isOnStudentSide }) {
  const path = useLocation().pathname;
  return (
    <>
      <BottomNavOption
        linkTo={"/teacher/classes"}
        currentPath={path}
        icon={<NavIcon name="myClassrooms" />}
        text={"My Classrooms"}
        isOnStudentSide={isOnStudentSide}
      />

      <BottomNavOption
        linkTo={"/teacher/texts"}
        currentPath={path}
        icon={<NavIcon name="myTexts" />}
        text={"My Texts"}
        isOnStudentSide={isOnStudentSide}
      />
    </>
  );
}
