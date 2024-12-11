import { useLocation } from "react-router-dom/cjs/react-router-dom";
import useExerciseNotification from "../../../hooks/useExerciseNotification";
import NotificationIcon from "../../NotificationIcon";
import NavOption from "../NavOption";
import NavIcon from "../NavIcon";
import strings from "../../../i18n/definitions";
import StudentOptions from "../navigationOptions";

export default function SidebarOptions_Student({
  isTeacher,
  isOnStudentSide,
  screenWidth,
}) {
  const path = useLocation().pathname;

  const { hasExerciseNotification, notificationMsg } =
    useExerciseNotification();

  return (
    <>
      <NavOption
        {...StudentOptions.articles}
        currentPath={path}
        screenWidth={screenWidth}
      />

      <NavOption
        {...StudentOptions.exercises}
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
        {...StudentOptions.words}
        currentPath={path}
        screenWidth={screenWidth}
      />

      <NavOption
        linkTo={"/history"}
        icon={<NavIcon name="history" />}
        text={strings.history}
        currentPath={path}
        isOnStudentSide={isOnStudentSide}
        screenWidth={screenWidth}
      />

      <NavOption
        linkTo={"/user_dashboard"}
        icon={<NavIcon name="statistics" />}
        text={strings.userDashboard}
        currentPath={path}
        isOnStudentSide={isOnStudentSide}
        screenWidth={screenWidth}
      />

      {isTeacher && (
        <NavOption
          linkTo={"/teacher/classes"}
          icon={<NavIcon name="teacherSite" />}
          text={strings.teacherSite}
          currentPath={path}
          isOnStudentSide={isOnStudentSide}
          screenWidth={screenWidth}
        />
      )}
    </>
  );
}
