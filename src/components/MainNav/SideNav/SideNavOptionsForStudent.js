import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import useExerciseNotification from "../../../hooks/useExerciseNotification";
import NavOption from "../NavOption";
import NavigationOptions from "../navigationOptions";
import NotificationIcon from "../../NotificationIcon";

export default function SideNavOptionsForStudent({ screenWidth }) {
  const { userDetails } = useContext(UserContext);

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

      {userDetails.is_teacher && (
        <NavOption
          {...NavigationOptions.teacherSite}
          currentPath={path}
          screenWidth={screenWidth}
        />
      )}
    </>
  );
}
