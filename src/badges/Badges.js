import React, { useContext, useEffect, useRef, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import * as s from "./Badges.sc.js";
import NotificationIcon from "@/components/NotificationIcon";

export default function Badges() {
  const api = useContext(APIContext);

  const [badges, setBadges] = useState([]);
  const [topBadges, setTopBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  //TODO remove this
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    //TODO
    const userId = 1;
    api.getBadgesForUser(userId, (data) => {
      setBadges(data);
      setTopBadges(getTopBadgeLevels(data));
    });
  }, []);

  const getTopBadgeLevels = (badges) =>
    badges.map((badge) => {
      const achieved = badge.levels.filter((l) => l.achieved);
      const top = achieved.length > 0 ? achieved[achieved.length - 1] : badge.levels[0];
      return {
        badge_id: badge.badge_id,
        name: badge.name,
        level: {
          ...top,
          description: badge.description.replace("{target_value}", top.target_value),
        },
      };
    });

  const openBadge = (id) => {
    const fullBadge = badges.find((b) => b.badge_id === id);
    if (!fullBadge) return;

    const levels = fullBadge.levels.map((lvl) => ({
      ...lvl,
      description: fullBadge.description.replace("{target_value}", lvl.target_value),
    }));

    setSelectedBadge({ ...fullBadge, levels });
    const firstUnachieved = levels.findIndex((l) => !l.achieved);
    setCurrentLevelIndex(firstUnachieved > 0 ? firstUnachieved - 1 : 0);
  };

  const formatDateTime = (iso) =>
    iso
      ? new Date(iso).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "—";

  const getIcon = (level) => (level.achieved ? level.icon_url : "../../public/static/images/zeeguuLogo.svg");
  const iconStyle = (achieved) => ({ filter: achieved ? "none" : "grayscale(100%)", opacity: achieved ? 1 : 0.5 });

  return (
    <s.Container>
      <h1>My Badges</h1>

      <s.BadgesRow>
        {topBadges.map((b) => (
          <s.BadgeCard key={b.badge_id} achieved={b.level.achieved} onClick={() => openBadge(b.badge_id)}>
            {!b.level.is_shown && b.level.achieved && <NotificationIcon text="NEW" position="top-absolute" />}
            <div className="icon-container">
              <img src={getIcon(b.level)} style={iconStyle(b.level.achieved)} />
            </div>

            <h3>
              {b.level.name ? (
                b.level.name
              ) : (
                <>
                  <div>{b.name}</div>
                  <div>{`(Level ${b.level.badge_level})`}</div>
                </>
              )}
            </h3>
          </s.BadgeCard>
        ))}
      </s.BadgesRow>

      {selectedBadge && (
        <s.ModalOverlay onClick={() => setSelectedBadge(null)}>
          <s.BadgePanel onClick={(e) => e.stopPropagation()}>
            <h2>
              {selectedBadge.levels[currentLevelIndex].name ||
                `${selectedBadge.name} (Level ${selectedBadge.levels[currentLevelIndex].badge_level})`}
            </h2>

            <div className="level-info">
              <img
                src={
                  selectedBadge.levels[currentLevelIndex].achieved
                    ? selectedBadge.levels[currentLevelIndex].icon_url
                    : "../../public/static/images/zeeguuLogo.svg"
                }
                style={{
                  filter: selectedBadge.levels[currentLevelIndex].achieved ? "none" : "grayscale(100%)",
                  opacity: selectedBadge.levels[currentLevelIndex].achieved ? 1 : 0.5,
                  marginBottom: "0.5rem",
                }}
              />
              <div>{selectedBadge.levels[currentLevelIndex].description}</div>
              {selectedBadge.levels[currentLevelIndex].achieved && (
                <s.AchievedAtBox>{`Achieved at: ${formatDateTime(selectedBadge.levels[currentLevelIndex].achieved_at)}`}</s.AchievedAtBox>
              )}
            </div>

            <s.CarouselButtons>
              <button
                onClick={() => setCurrentLevelIndex((i) => Math.max(i - 1, 0))}
                disabled={currentLevelIndex === 0}
              >
                ◀
              </button>
              <button
                onClick={() => setCurrentLevelIndex((i) => Math.min(i + 1, selectedBadge.levels.length - 1))}
                disabled={currentLevelIndex === selectedBadge.levels.length - 1}
              >
                ▶
              </button>
            </s.CarouselButtons>
          </s.BadgePanel>
        </s.ModalOverlay>
      )}
    </s.Container>
  );
}
