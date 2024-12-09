import { useLocation } from "react-router-dom/cjs/react-router-dom";
import useExerciseNotification from "../../../../hooks/useExerciseNotification";
import NotificationIcon from "../../../NotificationIcon";
import NavOption from "../NavOption";
import NavIcon from "../NavIcon";

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
        linkTo={"/articles"}
        icon={<NavIcon name="home" />}
        text={"Home"}
        currentPath={path}
        isOnStudentSide={isOnStudentSide}
        screenWidth={screenWidth}
      />

      <NavOption
        linkTo={"/exercises"}
        icon={<NavIcon name="exercises" />}
        text={"Exercises"}
        currentPath={path}
        isOnStudentSide={isOnStudentSide}
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
        linkTo={"/words"}
        icon={<NavIcon name="words" />}
        text={"Words"}
        currentPath={path}
        isOnStudentSide={isOnStudentSide}
        screenWidth={screenWidth}
      />

      <NavOption
        linkTo={"/history"}
        icon={<NavIcon name="history" />}
        text={"History"}
        currentPath={path}
        isOnStudentSide={isOnStudentSide}
        screenWidth={screenWidth}
      />

      <NavOption
        linkTo={"/user_dashboard"}
        icon={<NavIcon name="statistics" />}
        text={"Statistics"}
        currentPath={path}
        isOnStudentSide={isOnStudentSide}
        screenWidth={screenWidth}
      />

      {isTeacher && (
        <NavOption
          linkTo={"/teacher/classes"}
          icon={<NavIcon name="teacherSite" />}
          text={"Teacher Site"}
          currentPath={path}
          isOnStudentSide={isOnStudentSide}
          screenWidth={screenWidth}
        />
      )}
    </>
  );
}
