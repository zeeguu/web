import { useLocation } from "react-router-dom/cjs/react-router-dom";
import useExerciseNotification from "../../../../hooks/useExerciseNotification";
import NotificationIcon from "../../../NotificationIcon";
import NavOption from "../NavOption";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import DonutSmallRoundedIcon from "@mui/icons-material/DonutSmallRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";

export default function SidebarOptions_Student({
  isCollapsed,
  currentPath,
  isTeacher,
}) {
  const path = useLocation().pathname;

  const { hasExerciseNotification, notificationMsg } =
    useExerciseNotification();

  return (
    <>
      <NavOption
        linkTo={"/articles"}
        icon={<HomeRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Home"}
        currentPath={currentPath}
      />

      <NavOption
        linkTo={"/exercises"}
        icon={<FitnessCenterRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Exercises"}
        currentPath={currentPath}
        notification={
          hasExerciseNotification && <NotificationIcon text={notificationMsg} />
        }
      />

      <NavOption
        linkTo={"/words"}
        icon={<TranslateRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Words"}
        currentPath={currentPath}
      />

      <NavOption
        linkTo={"/history"}
        icon={<HistoryRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"History"}
        currentPath={currentPath}
      />

      <NavOption
        linkTo={"/user_dashboard"}
        icon={<DonutSmallRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Statistics"}
        currentPath={currentPath}
      />

      {isTeacher && (
        <NavOption
          linkTo={"/teacher/classes"}
          icon={<BusinessCenterRoundedIcon />}
          isCollapsed={isCollapsed}
          text={"Teacher Site"}
          currentPath={currentPath}
        />
      )}
    </>
  );
}
