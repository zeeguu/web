import NavIcon from "../MainNav/NavIcon";
import * as s from "./TopBar.sc";
import {zeeguuOrange} from "../colors";
import { getTopBarData } from "../../utils/progressTracking/ProgressOverviewItems";
import { useEffect, useState, React } from "react";


export default function TopBar({weeklyTranslated, weeklyReadingMinutes}) {
  const {weeklyProgressOverview} = getTopBarData({weeklyTranslated, weeklyReadingMinutes});

  useEffect(() => {
    const savedPrefs = JSON.parse(localStorage.getItem("topBarPrefs")) || [];
    setWhichItems(savedPrefs);
  }, []);
  
  const [whichItems, setWhichItems] = useState([]);
  console.log("whichItems", whichItems);
  const savedItems = JSON.parse(localStorage.getItem("topBarPrefs") || "[]");

  return (
    <s.StatContainer>
   {savedItems.includes("wordsPracticedTopBar") && (
  <>
    <NavIcon name={weeklyProgressOverview[1].icon} color={zeeguuOrange} />
    <s.StatNumber>{weeklyProgressOverview[1].value}</s.StatNumber>
  </>
)}
 {savedItems.includes("articleMinutesTopBar") && (
  <>
    <NavIcon name={weeklyProgressOverview[0].icon} color= {zeeguuOrange}/>
    <s.StatNumber>{weeklyProgressOverview[0].value}</s.StatNumber>
  </>
)}
 {savedItems.includes("streakTopBar") && (
  <>
   <NavIcon name={weeklyProgressOverview[2].icon} color={zeeguuOrange} />
   <s.StatNumber>{weeklyProgressOverview[2].value}</s.StatNumber>
  </>
)}
      
      
    </s.StatContainer>
  );
}
