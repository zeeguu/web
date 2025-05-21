import NavIcon from "../MainNav/NavIcon";
import * as s from "./TopBar.sc";
import {zeeguuOrange} from "../colors";
import { useEffect, useState, React } from "react";
import {getTopBarData} from "../../utils/progressTracking/ProgressOverviewItems";
import WeeklyMinutesReadModal from "../progress_tracking/WeeklyMinutesReadModal";
import WeeklyWordsPracticedModal from "../progress_tracking/WeeklyWordsPracticedModal";
import WeeklyStreakModal from "../progress_tracking/WeeklyStreakModal";

export default function TopBar({weeklyTranslated, weeklyReadingMinutes}) {
  const {weeklyProgressOverview} = getTopBarData({weeklyTranslated, weeklyReadingMinutes});
  const [showWeeklyMinutesReadModal, setShowWeeklyMinutesReadModal] = useState(false);
  const [showWeeklyWordsPracticedModal, setShowWeeklyWordsPracticedModal] = useState(false);
  const [showWeeklyStreakModal, setShowWeeklyStreakModal] = useState(false);

  useEffect(() => {
    const savedPrefs = JSON.parse(localStorage.getItem("topBarPrefs")) || [];
    setWhichItems(savedPrefs);
  }, []);
  
  const [whichItems, setWhichItems] = useState([]);
  console.log("whichItems", whichItems);
  const savedItems = JSON.parse(localStorage.getItem("topBarPrefs") || "[]");

  return (
    <>
    <s.StatContainer>
   {savedItems.includes("wordsPracticedTopBar") && (
  <s.ClickableStat onClick={() => setShowWeeklyWordsPracticedModal(true)}>
     <NavIcon name={weeklyProgressOverview[1].icon} color={zeeguuOrange} />
    <s.StatNumber>{weeklyProgressOverview[1].value}</s.StatNumber>
  </s.ClickableStat>
)}
 {savedItems.includes("articleMinutesTopBar") && (
    <s.ClickableStat onClick={() => setShowWeeklyMinutesReadModal(true)}>
    <NavIcon name={weeklyProgressOverview[0].icon} color= {zeeguuOrange}/>
    <s.StatNumber>{weeklyProgressOverview[0].value}</s.StatNumber>
  </s.ClickableStat>
)}
 {savedItems.includes("streakTopBar") && (
  <s.ClickableStat onClick={() => setShowWeeklyStreakModal(true)}>  
  <NavIcon name={weeklyProgressOverview[2].icon} color={zeeguuOrange} />
  <s.StatNumber>{weeklyProgressOverview[2].value}</s.StatNumber>
  </s.ClickableStat>
)}
      
      
    </s.StatContainer>

    <WeeklyMinutesReadModal
      open={showWeeklyMinutesReadModal}
      setOpen={setShowWeeklyMinutesReadModal}
    />
    <WeeklyWordsPracticedModal
      open={showWeeklyWordsPracticedModal}
      setOpen={setShowWeeklyWordsPracticedModal}
    />
    <WeeklyStreakModal
      open={showWeeklyStreakModal}
      setOpen={setShowWeeklyStreakModal}
    />
    </>
  );
}
