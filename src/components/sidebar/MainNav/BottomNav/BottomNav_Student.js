import { useLocation } from "react-router-dom/cjs/react-router-dom";
import NotificationIcon from "../../../NotificationIcon";
import useExerciseNotification from "../../../../hooks/useExerciseNotification";
import NavIcon from "../NavIcon";
import BottomNavOption from "./BottomNavOption";
import strings from "../../../../i18n/definitions";

export default function BottomNav_Student({ isOnStudentSide }) {
  const path = useLocation().pathname;
  const { hasExerciseNotification, notificationMsg } =
    useExerciseNotification();

  return (
    <>
      <BottomNavOption
        linkTo={"/articles"}
        currentPath={path}
        icon={<NavIcon name="home" />}
        text={strings.articles}
        isOnStudentSide={isOnStudentSide}
      />

      <BottomNavOption
        linkTo={"/exercises"}
        currentPath={path}
        icon={<NavIcon name="exercises" />}
        text={strings.exercises}
        isOnStudentSide={isOnStudentSide}
        notification={
          hasExerciseNotification && (
            <NotificationIcon
              position={"top-absolute"}
              text={notificationMsg}
            />
          )
        }
      />

      <BottomNavOption
        linkTo={"/words"}
        currentPath={path}
        icon={<NavIcon name="words" />}
        text={strings.words}
        isOnStudentSide={isOnStudentSide}
      />
    </>
  );
}
