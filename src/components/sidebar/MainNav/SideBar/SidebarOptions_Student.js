import { useLocation } from "react-router-dom/cjs/react-router-dom";
import useExerciseNotification from "../../../../hooks/useExerciseNotification";
import NotificationIcon from "../../../NotificationIcon";
import NavOption from "../NavOption";
import NavIcon from "../NavIcon";

export default function SidebarOptions_Student({
  isCollapsed,
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
        isCollapsed={isCollapsed}
        text={"Home"}
        currentPath={currentPath}
        isOnStudentSide={isOnStudentSide}
      />

      <NavOption
        linkTo={"/exercises"}
        icon={<NavIcon name="exercises" />}
        isCollapsed={isCollapsed}
        text={"Exercises"}
        currentPath={currentPath}
        isOnStudentSide={isOnStudentSide}
        notification={
          hasExerciseNotification && <NotificationIcon text={notificationMsg} />
        }
      />

      <NavOption
        linkTo={"/words"}
        icon={<NavIcon name="words" />}
        isCollapsed={isCollapsed}
        text={"Words"}
        currentPath={currentPath}
        isOnStudentSide={isOnStudentSide}
      />

      <NavOption
        linkTo={"/history"}
        icon={<NavIcon name="history" />}
        isCollapsed={isCollapsed}
        text={"History"}
        currentPath={currentPath}
        isOnStudentSide={isOnStudentSide}
      />

      <NavOption
        linkTo={"/user_dashboard"}
        icon={<NavIcon name="statistics" />}
        isCollapsed={isCollapsed}
        text={"Statistics"}
        currentPath={currentPath}
        isOnStudentSide={isOnStudentSide}
      />

      {isTeacher && (
        <NavOption
          linkTo={"/teacher/classes"}
          icon={<NavIcon name="teacherSite" />}
          isCollapsed={isCollapsed}
          text={"Teacher Site"}
          currentPath={currentPath}
          isOnStudentSide={isOnStudentSide}
        />
      )}
    </>
  );
}
