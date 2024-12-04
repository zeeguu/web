import { useLocation } from "react-router-dom/cjs/react-router-dom";
import * as s from "./BottomNav.sc";
import NotificationIcon from "../../../NotificationIcon";
import useExerciseNotification from "../../../../hooks/useExerciseNotification";
import NavIcon from "../NavIcon";

export default function BottomNav_Student({ isOnStudentSide }) {
  const path = useLocation().pathname;
  const { hasExerciseNotification, notificationMsg } =
    useExerciseNotification();

  return (
    <>
      <s.BottomNavOption>
        <s.StyledLink to="/articles">
          <s.IconSpan
            isOnStudentSide={isOnStudentSide}
            isActive={path && path.includes("/articles")}
          >
            <NavIcon name="home" />
          </s.IconSpan>
          Home
        </s.StyledLink>
      </s.BottomNavOption>

      <s.BottomNavOption>
        <s.StyledLink to="/exercises">
          {hasExerciseNotification && (
            <NotificationIcon
              position={"top-absolute"}
              text={notificationMsg}
            />
          )}
          <s.IconSpan
            isOnStudentSide={isOnStudentSide}
            isActive={path && path.includes("/exercises")}
          >
            <NavIcon name="exercises" />
          </s.IconSpan>
          Exercises
        </s.StyledLink>
      </s.BottomNavOption>

      <s.BottomNavOption>
        <s.StyledLink to="/words">
          <s.IconSpan
            isOnStudentSide={isOnStudentSide}
            isActive={path && path.includes("/words")}
          >
            <NavIcon name="words" />
          </s.IconSpan>
          Words
        </s.StyledLink>
      </s.BottomNavOption>
    </>
  );
}
