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
import DoubleArrowRight from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import DoubleArrowLeft from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";

export default function NavIcon({ name }) {
  const navIcons = {
    home: <HomeRoundedIcon />,
    exercises: <FitnessCenterRoundedIcon />,
    words: <TranslateRoundedIcon />,
    history: <HistoryRoundedIcon />,
    statistics: <DonutSmallRoundedIcon />,
    settings: <SettingsRoundedIcon />,
    collapse: <DoubleArrowLeft />,
    expand: <DoubleArrowRight />,
    teacherSite: <BusinessCenterRoundedIcon />,
    myClassrooms: <GroupsRoundedIcon />,
    myTexts: <ChromeReaderModeRoundedIcon />,
    studentSite: <SchoolRoundedIcon />,
    more: <MoreHorizRoundedIcon />,
  };
  return navIcons[name] || "";
}
