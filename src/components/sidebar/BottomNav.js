import * as s from "./BottomNav.sc";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";

export default function BottomNav() {
  return (
    <>
      <s.BottomNav>
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
        <s.BottomNavOption>
          <s.StyledLink to="/teacher/classes">
            <BusinessCenterRoundedIcon /> Teacher Site
          </s.StyledLink>
        </s.BottomNavOption>
        <s.BottomNavOption>
          <s.StyledLink to="/articles">
            <MoreHorizRoundedIcon /> More
          </s.StyledLink>
        </s.BottomNavOption>
      </s.BottomNav>
    </>
  );
}
