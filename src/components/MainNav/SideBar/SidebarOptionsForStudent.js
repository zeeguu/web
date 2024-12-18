import { useLocation } from "react-router-dom/cjs/react-router-dom";
import useExerciseNotification from "../../../hooks/useExerciseNotification";
import NotificationIcon from "../../NotificationIcon";
import NavOption from "../NavOption";
import NavigationOptions from "../navigationOptions";

export default function SidebarOptionsForStudent({ isTeacher, screenWidth }) {
  const path = useLocation().pathname;

  const { hasExerciseNotification, notificationMsg } =
    useExerciseNotification();

  return (
    <>
      <NavOption
        {...NavigationOptions.articles}
        currentPath={path}
        screenWidth={screenWidth}
      />

      <NavOption
        {...NavigationOptions.exercises}
        currentPath={path}
        screenWidth={screenWidth}
        notification={
          hasExerciseNotification && (
            <NotificationIcon
              position={"top-absolute"}
              text={notificationMsg}
            />
          )
        }
      />

      <NavOption
        {...NavigationOptions.words}
        currentPath={path}
        screenWidth={screenWidth}
      />

      <NavOption
        {...NavigationOptions.history}
        currentPath={path}
        screenWidth={screenWidth}
      />

      <NavOption
        {...NavigationOptions.statistics}
        currentPath={path}
        screenWidth={screenWidth}
      />

      {isTeacher && (
        <NavOption
          {...NavigationOptions.teacherSite}
          currentPath={path}
          screenWidth={screenWidth}
        />
      )}
    </>
  );
}
