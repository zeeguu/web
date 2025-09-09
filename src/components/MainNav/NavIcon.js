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
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import HeadphonesRoundedIcon from "@mui/icons-material/HeadphonesRounded";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArticleIcon from '@mui/icons-material/Article';
import SchoolIcon from "@mui/icons-material/School";
// import SwipeRoundedIcon from '@mui/icons-material/SwipeRounded';

export default function NavIcon({ name, color, size }) {

const iconProps = {
  sx: {
    ...(color && { color }),
    ...(size && { fontSize: size })
  }
};

  const navIcons = {
    home: <HomeRoundedIcon />,
    // swipe: <SwipeRoundedIcon />,
    exercises: <FitnessCenterRoundedIcon {...iconProps} />,
    dailyAudio: <HeadphonesRoundedIcon />,
    words: <TranslateRoundedIcon {...iconProps} />,
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
    language: <LanguageRoundedIcon  />,
    headerArticles: <ArticleIcon {...iconProps} />,
    headerStreak: <LocalFireDepartmentIcon {...iconProps}/>,
    school: <SchoolIcon {...iconProps} />
  };
  return navIcons[name] || "";
}
