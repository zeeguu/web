import * as s from "./BottomNav.sc";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useState } from "react";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ChromeReaderModeRoundedIcon from "@mui/icons-material/ChromeReaderModeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import DonutSmallRoundedIcon from "@mui/icons-material/DonutSmallRounded";
import FeedbackButton from "../../../FeedbackButton";
import NavOption from "../NavOption";
import NotificationIcon from "../../../NotificationIcon";
import useExerciseNotification from "../../../../hooks/useExerciseNotification";

export default function BottomNav({ isOnStudentSide, isTeacher }) {
  const path = useLocation().pathname;
  const [isMoreOptionsVisible, setIsMoreOptionsVisible] = useState(false);
  const { hasExerciseNotification, notificationMsg } =
    useExerciseNotification();

  return (
    <>
      {isMoreOptionsVisible && (
        <s.MoreOptionsPanel isOnStudentSide={isOnStudentSide}>
          <button
            onClick={() => {
              setIsMoreOptionsVisible(false);
            }}
          >
            Close
          </button>

          {isOnStudentSide && (
            <>
              <NavOption
                isOnStudentSide={isOnStudentSide}
                linkTo={"/user_dashboard"}
                icon={<DonutSmallRoundedIcon />}
                text={"Statistics"}
                currentPath={path}
                onClick={() => {
                  setIsMoreOptionsVisible(false);
                }}
              />

              <NavOption
                isOnStudentSide={isOnStudentSide}
                linkTo={"/history"}
                icon={<HistoryRoundedIcon />}
                text={"History"}
                currentPath={path}
                onClick={() => {
                  setIsMoreOptionsVisible(false);
                }}
              />

              {isTeacher && (
                <NavOption
                  linkTo={"/teacher/classes"}
                  icon={<BusinessCenterRoundedIcon />}
                  text={"Teacher Site"}
                  currentPath={path}
                  onClick={() => {
                    setIsMoreOptionsVisible(false);
                  }}
                />
              )}
            </>
          )}

          {!isOnStudentSide && (
            <>
              <NavOption
                isOnStudentSide={isOnStudentSide}
                linkTo={"/articles"}
                icon={<SchoolRoundedIcon />}
                text={"Student Site"}
                currentPath={path}
                onClick={() => {
                  setIsMoreOptionsVisible(false);
                }}
              />
            </>
          )}

          <FeedbackButton isOnStudentSide={isOnStudentSide} />
        </s.MoreOptionsPanel>
      )}
      <s.BottomNav isOnStudentSide={isOnStudentSide}>
        {isOnStudentSide && (
          <>
            <s.BottomNavOption>
              <s.StyledLink to="/articles">
                <s.IconSpan
                  isOnStudentSide={isOnStudentSide}
                  isActive={path && path.includes("/articles")}
                >
                  <HomeRoundedIcon />
                </s.IconSpan>
                Home
              </s.StyledLink>
            </s.BottomNavOption>

            <s.BottomNavOption>
              <s.StyledLink to="/exercises">
                {hasExerciseNotification && (
                  <NotificationIcon text={notificationMsg} />
                )}
                <s.IconSpan
                  isOnStudentSide={isOnStudentSide}
                  isActive={path && path.includes("/exercises")}
                >
                  <FitnessCenterRoundedIcon />
                </s.IconSpan>
                Exercises
              </s.StyledLink>
            </s.BottomNavOption>

            <s.BottomNavOption>
              <s.StyledLink to="/words">
                <s.IconSpan
                  isOnStudentSide={isOnStudentSide}
                  isActive={path && path.includes("/words")}
                >
                  <TranslateRoundedIcon />
                </s.IconSpan>
                Words
              </s.StyledLink>
            </s.BottomNavOption>
          </>
        )}

        {!isOnStudentSide && (
          <>
            <s.BottomNavOption>
              <s.StyledLink to="/teacher/classes">
                <s.IconSpan
                  isOnStudentSide={isOnStudentSide}
                  isActive={path && path.includes("/teacher/classes")}
                >
                  <GroupsRoundedIcon />
                </s.IconSpan>
                My Classroom
              </s.StyledLink>
            </s.BottomNavOption>

            <s.BottomNavOption>
              <s.StyledLink to="/teacher/texts">
                <s.IconSpan
                  isOnStudentSide={isOnStudentSide}
                  isActive={path && path.includes("/teacher/texts")}
                >
                  <ChromeReaderModeRoundedIcon />
                </s.IconSpan>
                My Texts
              </s.StyledLink>
            </s.BottomNavOption>
          </>
        )}

        <s.BottomNavOption>
          <s.StyledLink to="/account_settings">
            <s.IconSpan
              isOnStudentSide={isOnStudentSide}
              isActive={path && path.includes("/account_settings")}
            >
              <SettingsRoundedIcon />
            </s.IconSpan>
            Settings
          </s.StyledLink>
        </s.BottomNavOption>

        <s.BottomNavOption>
          <s.StyledButton
            onClick={() => {
              setIsMoreOptionsVisible(true);
            }}
          >
            <s.IconSpan isOnStudentSide={isOnStudentSide}>
              <MoreHorizRoundedIcon />
            </s.IconSpan>
            More
          </s.StyledButton>
        </s.BottomNavOption>
      </s.BottomNav>
    </>
  );
}

// Todo:
// - make the bottom bar not visible on the article’s page and the exercise page
//
// - make the top bar with a back button on mobile (for some pages such as articles)
//
// - adapt options in the bottom bar (remove the teacher’s view, replace with settings,
// add additional options in the expandible bar)
//
// - The app automatically zooms in when user enters input, this makes the navbar invisible.
// Do something about it
//
// - Make a theme
//
// - Prevent bg from scrolling when "more" is open
