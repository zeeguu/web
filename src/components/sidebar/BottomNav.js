import * as s from "./BottomNav.sc";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ChromeReaderModeRoundedIcon from "@mui/icons-material/ChromeReaderModeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

export default function BottomNav({ isOnStudentSide, isTeacher }) {
  const path = useLocation().pathname;
  return (
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

          {/* {isTeacher && (
            <s.BottomNavOption>
              <s.StyledLink to="/teacher/classes">
                <s.IconSpan
                  isOnStudentSide={isOnStudentSide}
                  isActive={path && path.includes("/teacher/classes")}
                >
                  <BusinessCenterRoundedIcon />
                </s.IconSpan>
                Teacher Site
              </s.StyledLink>
            </s.BottomNavOption>
          )} */}
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

          <s.BottomNavOption>
            <s.StyledLink to="/articles">
              <s.IconSpan
                isOnStudentSide={isOnStudentSide}
                isActive={path && path.includes("/articles")}
              >
                <SchoolRoundedIcon />
              </s.IconSpan>
              Student Site
            </s.StyledLink>
          </s.BottomNavOption>
        </>
      )}
      <s.BottomNavOption>
        <s.StyledLink to="/articles">
          <s.IconSpan>
            <MoreHorizRoundedIcon />
          </s.IconSpan>
          More
        </s.StyledLink>
      </s.BottomNavOption>
    </s.BottomNav>
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
// - turn the notification icon into a reusable hook useNotification
