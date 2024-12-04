import { useLocation } from "react-router-dom/cjs/react-router-dom";
import * as s from "./BottomNav.sc";
import NavIcon from "../NavIcon";

export default function BottomNav_Teacher({ isOnStudentSide }) {
  const path = useLocation().pathname;
  return (
    <>
      <s.BottomNavOption>
        <s.StyledLink to="/teacher/classes">
          <s.IconSpan
            isOnStudentSide={isOnStudentSide}
            isActive={path && path.includes("/teacher/classes")}
          >
            <NavIcon name="myClassrooms" />
          </s.IconSpan>
          My Classrooms
        </s.StyledLink>
      </s.BottomNavOption>

      <s.BottomNavOption>
        <s.StyledLink to="/teacher/texts">
          <s.IconSpan
            isOnStudentSide={isOnStudentSide}
            isActive={path && path.includes("/teacher/texts")}
          >
            <NavIcon name="myTexts" />
          </s.IconSpan>
          My Texts
        </s.StyledLink>
      </s.BottomNavOption>
    </>
  );
}
