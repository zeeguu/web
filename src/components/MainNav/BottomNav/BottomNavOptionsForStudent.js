import { useLocation } from "react-router-dom/cjs/react-router-dom";
import NotificationIcon from "../../NotificationIcon";
import useExerciseNotification from "../../../hooks/useExerciseNotification";
import BottomNavOption from "./BottomNavOption";
import NavigationOptions from "../navigationOptions";
import BottomNavLanguageOption from "./BottomNavLanguageOption";

export default function BottomNavOptionsForStudent({ setUser }) {
  const path = useLocation().pathname;
  const { hasExerciseNotification, notificationMsg } =
    useExerciseNotification();

  return (
    <>
      <BottomNavOption {...NavigationOptions.articles} currentPath={path} />
      <BottomNavOption
        {...NavigationOptions.exercises}
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
      <BottomNavOption {...NavigationOptions.words} currentPath={path} />
      <BottomNavLanguageOption setUser={setUser} />
    </>
  );
}
