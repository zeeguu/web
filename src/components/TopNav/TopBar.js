import NavIcon from "../MainNav/NavIcon";
import { useContext } from "react";
import * as s from "./TopBar.sc";
import {zeeguuOrange} from "../colors";
import { useEffect, useState} from "react";
import {getTopBarData} from "../../utils/progressTracking/progressData";
import ProgressModal from "../progress_tracking/ProgressModal";
import { getSessionFromCookies } from "../../utils/cookies/userInfo";
import Zeeguu_API from "../../api/Zeeguu_API";
import { API_ENDPOINT } from "../../appConstants";
import { ProgressContext } from "../../contexts/ProgressContext";
import { calculateWeeklyReadingMinutes, getWeeklyTranslatedWordsCount, calculateConsecutivePracticeWeeks, calculateTotalReadingMinutes } from "../../utils/progressTracking/progressHelpers";

const DEFAULT_TOPBAR_PREFS = [
  "wordsPracticedTopBar",
  "articleMinutesTopBar",
  "streakTopBar"
];


export default function TopBar() {
    const {weeksPracticed, setWeeksPracticed, setWeeklyTranslated, weeklyTranslated, weeklyReadingMinutes, setWeeklyReadingMinutes, setTotalTranslated, setTotalInLearning, setTotalLearned, setTotalReadingMinutes} = useContext(ProgressContext);

  const {weeklyProgressOverview} = getTopBarData({weeklyTranslated, weeklyReadingMinutes,weeksPracticed});
  const [showModalData, setShowModalData] = useState(null);
  const [api] = useState(new Zeeguu_API(API_ENDPOINT));

  useEffect(() => {
    const savedPrefs = JSON.parse(localStorage.getItem("topBarPrefs")) || [];
    setWhichItems(savedPrefs);

  api.getBookmarksCountsByDate((counts) => {
      const totalTranslatedWords = counts.reduce((sum, day) => sum + day.count, 0);

      setTotalTranslated(totalTranslatedWords);
      const thisWeek = getWeeklyTranslatedWordsCount(counts);
      const weeklyTotal = thisWeek.reduce((sum, day) => sum + day.count, 0);
      setWeeklyTranslated(weeklyTotal);
    });

  api.getUserActivityByDay((activity) => {
      setTotalReadingMinutes(calculateTotalReadingMinutes(activity.reading));
      const readingMinsPerWeek = calculateWeeklyReadingMinutes(activity.reading);
      setWeeklyReadingMinutes(readingMinsPerWeek);

      const weeksPracticed = calculateConsecutivePracticeWeeks(activity);
      setWeeksPracticed(weeksPracticed);
    });

  api.getAllScheduledBookmarks(false, (bookmarks) => {
      setTotalInLearning(bookmarks.length);
    });

  api.totalLearnedBookmarks((totalLearnedCount) =>{
      setTotalLearned(totalLearnedCount)
    }); 

  }, []);
  
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
    });
  };

  api.session = getSessionFromCookies();
  if (!api.session) return null;

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
