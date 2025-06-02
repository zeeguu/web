import NavIcon from "../MainNav/NavIcon";
import * as s from "./TopBar.sc";
import {zeeguuOrange} from "../colors";
import { useEffect, useState, React } from "react";
import {getTopBarData} from "../../utils/progressTracking/ProgressOverviewItems";
import ProgressModal from "../progress_tracking/ProgressModal";
import { getSessionFromCookies } from "../../utils/cookies/userInfo";
import Zeeguu_API from "../../api/Zeeguu_API";
import { API_ENDPOINT } from "../../appConstants";

const modalData = {
  articleMinutesTopBar: {
    linkText: "See statistics on activty",
    linkTo: "user_dashboard",
    size: 90,
  },
  wordsPracticedTopBar: {
    linkText: "More information about word progress",
    linkTo: "words",
    size: 90,
  },
  streakTopBar: {
    linkText: "See statistics on activity",
    linkTo: "user_dashboard",
    size: 90,
  },
};

export default function TopBar({weeklyTranslated, weeklyReadingMinutes,weeksPracticed}) {
  const {weeklyProgressOverview} = getTopBarData({weeklyTranslated, weeklyReadingMinutes,weeksPracticed});
  const [showModalData, setShowModalData] = useState(null);
  const [api] = useState(new Zeeguu_API(API_ENDPOINT));


  useEffect(() => {
    const savedPrefs = JSON.parse(localStorage.getItem("topBarPrefs")) || [];
    setWhichItems(savedPrefs);
  }, []);
  
  const [whichItems, setWhichItems] = useState([]);
  console.log("whichItems", whichItems);
  const savedItems = JSON.parse(localStorage.getItem("topBarPrefs") || "[]");

  const handleOpenModal = (key, item) => {
    const modalDefaults = modalData[key] || {};
    setShowModalData({
      ...modalDefaults,
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
