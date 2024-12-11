import { useLocation } from "react-router-dom/cjs/react-router-dom";
import NotificationIcon from "../../NotificationIcon";
import useExerciseNotification from "../../../hooks/useExerciseNotification";
import NavIcon from "../NavIcon";
import BottomNavOption from "./BottomNavOption";
import strings from "../../../i18n/definitions";
import StudentOptions from "../navigationOptions";

export default function BottomNavOptionsForStudent({ isOnStudentSide }) {
  const path = useLocation().pathname;
  const { hasExerciseNotification, notificationMsg } =
    useExerciseNotification();

  return (
    <>
      <BottomNavOption {...StudentOptions.articles} currentPath={path} />

      <BottomNavOption
        {...StudentOptions.exercises}
        currentPath={path}
        notification={
          hasExerciseNotification && (
            <NotificationIcon
              position={"top-absolute"}
              text={notificationMsg}
            />
          )
        }
      />

      <BottomNavOption {...StudentOptions.words} currentPath={path} />
    </>
  );
}
