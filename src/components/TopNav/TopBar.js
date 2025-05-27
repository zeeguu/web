import NavIcon from "../MainNav/NavIcon";
import * as s from "./TopBar.sc";
import {zeeguuOrange} from "../colors";
import { getTopBarData } from "../../utils/progressTracking/ProgressOverviewItems";
import { useEffect, useState} from "react";
import ProgressModal from "../progress_tracking/ProgressModal";

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


export default function TopBar({weeklyTranslated, weeklyReadingMinutes}) {
  const {weeklyProgressOverview} = getTopBarData({weeklyTranslated, weeklyReadingMinutes});
  const [showModalData, setShowModalData] = useState(null);

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
      value: item.value,
      title: item.iconText,
      descriptionStart: item.beforeText,
      descriptionEnd: item.afterText,
      iconName: item.icon,
      unit: item.unit || "",
    });
  };

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
