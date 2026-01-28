import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import NavIcon from "../NavIcon";
import { getTopBarData, DEFAULT_TOPBAR_PREFS } from "../../../utils/progressTracking/progressData";
import { APIContext } from "../../../contexts/APIContext";
import { ProgressContext } from "../../../contexts/ProgressContext";
import { calculateWeeklyReadingMinutes } from "../../../utils/progressTracking/progressHelpers";
import { UserContext } from "../../../contexts/UserContext";
import { MEDIUM_WIDTH } from "../screenSize";
import ProgressModal from "../../progress_tracking/ProgressModal";

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  padding: 0.6rem 0.5rem;
  margin: 0.5rem;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.12);
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  transition: opacity 0.2s ease-in-out;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  color: white;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 4px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const StatValue = styled.span`
  font-weight: 500;
`;

export default function SideNavProgressStats({ screenWidth }) {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const { weeklyReadingMinutes, setWeeklyReadingMinutes, weeklyExercises, setWeeklyExercises, daysPracticed } = useContext(ProgressContext);
  const { weeklyProgressOverview } = getTopBarData({ weeklyReadingMinutes, daysPracticed, weeklyExercises });
  const [showModalData, setShowModalData] = useState(null);

  const isCollapsed = screenWidth <= MEDIUM_WIDTH;

  useEffect(() => {
    api.getUserActivityByDay((activity) => {
      const readingMinsPerWeek = calculateWeeklyReadingMinutes(activity.reading);
      setWeeklyReadingMinutes(readingMinsPerWeek);
    });

    api.getExercisesCompletedThisWeek((count) => {
      setWeeklyExercises(count);
    });
  }, [userDetails.learned_language]);

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

  if (isCollapsed) return null;

  return (
    <>
      <StatsContainer $collapsed={isCollapsed}>
        {savedItems.includes("articleMinutesTopBar") && weeklyProgressOverview[0] && (
          <StatItem onClick={() => handleOpenModal("articleMinutesTopBar", weeklyProgressOverview[0])}>
            <NavIcon name={weeklyProgressOverview[0].icon} color="white" size="1.1em" />
            <StatValue>{weeklyProgressOverview[0].value}</StatValue>
          </StatItem>
        )}
        {savedItems.includes("exercisesTopBar") && weeklyProgressOverview[1] && (
          <StatItem onClick={() => handleOpenModal("exercisesTopBar", weeklyProgressOverview[1])}>
            <NavIcon name={weeklyProgressOverview[1].icon} color="white" size="1.1em" />
            <StatValue>{weeklyProgressOverview[1].value}</StatValue>
          </StatItem>
        )}
        {savedItems.includes("streakTopBar") && weeklyProgressOverview[2] && (
          <StatItem onClick={() => handleOpenModal("streakTopBar", weeklyProgressOverview[2])}>
            <NavIcon name={weeklyProgressOverview[2].icon} color="white" size="1.1em" />
            <StatValue>{weeklyProgressOverview[2].value}</StatValue>
          </StatItem>
        )}
      </StatsContainer>
      {showModalData && <ProgressModal {...showModalData} />}
    </>
  );
}
