import NavIcon from "../MainNav/NavIcon";
import * as s from "./TopBar.sc";
import {zeeguuOrange} from "../colors";
import { useEffect, useState, useContext} from "react";
import {getTopBarData} from "../../utils/progressTracking/progressData";
import ProgressModal from "../progress_tracking/ProgressModal";
import { getSessionFromCookies } from "../../utils/cookies/userInfo";
import { APIContext } from "../../contexts/APIContext";
import { ProgressContext } from "../../contexts/ProgressContext";
import { calculateWeeklyReadingMinutes, calculateConsecutivePracticeWeeks} from "../../utils/progressTracking/progressHelpers";
import { UserContext } from "../../contexts/UserContext";
import { useLocation } from "react-router-dom";

const DEFAULT_TOPBAR_PREFS = [
  "wordsPracticedTopBar",
  "articleMinutesTopBar",
  "streakTopBar"
];

export default function TopBar() {
  const api = useContext(APIContext)
  const {weeksPracticed, setWeeksPracticed, weeklyReadingMinutes, setWeeklyReadingMinutes, weeklyPracticed, setWeeklyPracticed} = useContext(ProgressContext);
  const {weeklyProgressOverview} = getTopBarData({weeklyReadingMinutes, weeksPracticed, weeklyPracticed});
  const [showModalData, setShowModalData] = useState(null);
  const { userDetails } = useContext(UserContext);
  const location = useLocation();

  

  useEffect(() => {
    const savedPrefs = JSON.parse(localStorage.getItem("topBarPrefs")) || [];
    setWhichItems(savedPrefs);

  api.getUserActivityByDay((activity) => {
      const readingMinsPerWeek = calculateWeeklyReadingMinutes(activity.reading);
      setWeeklyReadingMinutes(readingMinsPerWeek);
      const weeksPracticed = calculateConsecutivePracticeWeeks(activity);
      setWeeksPracticed(weeksPracticed);
    });

  api.getPracticedBookmarksCountThisWeek((count) => {
      setWeeklyPracticed(count);
    });
  }, [userDetails.learned_language]);
  
  const [whichItems, setWhichItems] = useState([]);
  const savedItems = JSON.parse(localStorage.getItem("topBarPrefs") || "null") || DEFAULT_TOPBAR_PREFS;
  
  const handleOpenModal = (key, item) => {
    setShowModalData({
      ...item.modal,
      open: true,
      setOpen: () => setShowModalData(null),
      modalKey: key,
      value: item.value,
      title: item.iconText,
      descriptionStart: item.beforeText,
      descriptionEnd: item.afterText,
      iconName: item.icon,
      unit: item.modal.unit || "",
      asteriks: item.asteriks,
    });
  };

  api.session = getSessionFromCookies();
  if (!api.session) return null;

  // Only show progress icons on the homepage (articles route)
  const isHomepage = location.pathname === "/articles";
  if (!isHomepage) return null;

  return (
    <>
    <s.StatContainer>
   {savedItems.includes("wordsPracticedTopBar") && (
  <s.ClickableStat onClick={() => handleOpenModal("wordsPracticedTopBar", weeklyProgressOverview[1])}>
     <NavIcon name={weeklyProgressOverview[1].icon} color={zeeguuOrange} />
    <s.StatNumber>{weeklyProgressOverview[1].value}</s.StatNumber>
  </s.ClickableStat>
)}
 {savedItems.includes("articleMinutesTopBar") && (
    <s.ClickableStat onClick={() => handleOpenModal("articleMinutesTopBar", weeklyProgressOverview[0])}>
    <NavIcon name={weeklyProgressOverview[0].icon} color= {zeeguuOrange}/>
    <s.StatNumber>{weeklyProgressOverview[0].value}</s.StatNumber>
  </s.ClickableStat>
)}
 {savedItems.includes("streakTopBar") && (
  <s.ClickableStat onClick={() => handleOpenModal("streakTopBar", weeklyProgressOverview[2])}>
  <NavIcon name={weeklyProgressOverview[2].icon} color={zeeguuOrange} />
  <s.StatNumber>{weeklyProgressOverview[2].value}</s.StatNumber>
  </s.ClickableStat>
)}
    </s.StatContainer>  
    {showModalData && <ProgressModal {...showModalData} />}
    </>
  );
}
