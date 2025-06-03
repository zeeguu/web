import NavIcon from "../MainNav/NavIcon";
import * as s from "./TopBar.sc";
import {zeeguuOrange} from "../colors";
import { useEffect, useState} from "react";
import {getTopBarData} from "../../utils/progressTracking/progressData";
import ProgressModal from "../progress_tracking/ProgressModal";
import { getSessionFromCookies } from "../../utils/cookies/userInfo";
import Zeeguu_API from "../../api/Zeeguu_API";
import { API_ENDPOINT } from "../../appConstants";

const DEFAULT_TOPBAR_PREFS = [
  "wordsPracticedTopBar",
  "articleMinutesTopBar",
  "streakTopBar"
];

export default function TopBar({weeklyTranslated, weeklyReadingMinutes,weeksPracticed}) {
  const {weeklyProgressOverview} = getTopBarData({weeklyTranslated, weeklyReadingMinutes,weeksPracticed});
  const [showModalData, setShowModalData] = useState(null);
  const [api] = useState(new Zeeguu_API(API_ENDPOINT));


  useEffect(() => {
    const savedPrefs = JSON.parse(localStorage.getItem("topBarPrefs")) || [];
    setWhichItems(savedPrefs);
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
      unit: item.unit || "",
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
