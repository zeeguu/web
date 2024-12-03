import { useLocation } from "react-router-dom/cjs/react-router-dom";
import useExerciseNotification from "../../../../hooks/useExerciseNotification";
import NotificationIcon from "../../../NotificationIcon";
import NavOption from "../NavOption";
import NavIcon from "../NavIcon";

export default function SidebarOptions_Student({
  currentPath,
  isTeacher,
  isOnStudentSide,
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
        currentPath={currentPath}
        isOnStudentSide={isOnStudentSide}
      />

      <NavOption
        linkTo={"/exercises"}
        icon={<NavIcon name="exercises" />}
        text={"Exercises"}
        currentPath={currentPath}
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

      <NavOption
        linkTo={"/words"}
        icon={<NavIcon name="words" />}
        text={"Words"}
        currentPath={currentPath}
        isOnStudentSide={isOnStudentSide}
      />

      <NavOption
        linkTo={"/history"}
        icon={<NavIcon name="history" />}
        text={"History"}
        currentPath={currentPath}
        isOnStudentSide={isOnStudentSide}
      />

      <NavOption
        linkTo={"/user_dashboard"}
        icon={<NavIcon name="statistics" />}
        text={"Statistics"}
        currentPath={currentPath}
        isOnStudentSide={isOnStudentSide}
      />

      {isTeacher && (
        <NavOption
          linkTo={"/teacher/classes"}
          icon={<NavIcon name="teacherSite" />}
          text={"Teacher Site"}
          currentPath={currentPath}
          isOnStudentSide={isOnStudentSide}
        />
      )}
    </>
  );
}
