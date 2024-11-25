import * as s from "./BottomNav.sc";
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
  return (
    <s.BottomNav isOnStudentSide={isOnStudentSide}>
      {isOnStudentSide && (
        <>
          <s.BottomNavOption>
            <s.StyledLink to="/articles">
              <HomeRoundedIcon /> Home
            </s.StyledLink>
          </s.BottomNavOption>
          <s.BottomNavOption>
            <s.StyledLink to="/exercises">
              <FitnessCenterRoundedIcon /> Exercises
            </s.StyledLink>
          </s.BottomNavOption>
          <s.BottomNavOption>
            <s.StyledLink to="/words">
              <TranslateRoundedIcon /> Words
            </s.StyledLink>
          </s.BottomNavOption>
          {isTeacher && (
            <s.BottomNavOption>
              <s.StyledLink to="/teacher/classes">
                <BusinessCenterRoundedIcon /> Teacher Site
              </s.StyledLink>
            </s.BottomNavOption>
          )}
        </>
      )}

      {!isOnStudentSide && (
        <>
          <s.BottomNavOption>
            <s.StyledLink to="/teacher/classes">
              <GroupsRoundedIcon /> My Classroom
            </s.StyledLink>
          </s.BottomNavOption>
          <s.BottomNavOption>
            <s.StyledLink to="/teacher/texts">
              <ChromeReaderModeRoundedIcon /> My Texts
            </s.StyledLink>
          </s.BottomNavOption>
          <s.BottomNavOption>
            <s.StyledLink to="/articles">
              <SchoolRoundedIcon /> Student Site
            </s.StyledLink>
          </s.BottomNavOption>
        </>
      )}
      <s.BottomNavOption>
        <s.StyledLink to="/articles">
          <MoreHorizRoundedIcon /> More
        </s.StyledLink>
      </s.BottomNavOption>
    </s.BottomNav>
  );
}
