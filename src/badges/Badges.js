import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import * as s from "./Badges.sc.js";
import NotificationIcon from "@/components/NotificationIcon";

export default function Badges() {
  const api = useContext(APIContext);
  const iconBasePath = "../../../public/static/badges/";
  const defaultLogoPath = "../../../public/static/images/zeeguuLogo.svg";

  const [badges, setBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  const topBadges = badges.map((badge) => {
    const achieved = badge.levels.filter((l) => l.achieved);
    const top = achieved.length > 0 ? achieved[achieved.length - 1] : badge.levels[0];

    return {
      badge_id: badge.badge_id,
      level: top,
    };
  });

  useEffect(() => {
    api.getBadgesForUser((data) => {
      const normalized = data.map((badge) => ({
        ...badge,
        levels: badge.levels.map((lvl) => ({
          ...lvl,
          name: lvl.name ? lvl.name : `${badge.name} (Level ${lvl.badge_level})`,
          description: badge.description.replace("{target_value}", lvl.target_value),
        })),
      }));

      setBadges(normalized);
    });
  }, []);

  const openBadge = (id) => {
    const fullBadge = badges.find((b) => b.badge_id === id);
    if (!fullBadge) return;

    setSelectedBadge(fullBadge);

    const firstUnachieved = fullBadge.levels.findIndex((l) => !l.achieved);

    if (firstUnachieved === -1) {
      setCurrentLevelIndex(fullBadge.levels.length - 1);
    } else {
      setCurrentLevelIndex(Math.max(firstUnachieved - 1, 0));
    }
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

  const getIcon = (level) => (level.icon_name ? iconBasePath + level.icon_name : defaultLogoPath);
  const iconStyle = (achieved) => ({ filter: achieved ? "none" : "grayscale(100%)", opacity: achieved ? 1 : 0.5 });

  return (
    <s.Container>
      <s.BadgesRow>
        {topBadges.map((b) => (
          <s.BadgeCard key={b.badge_id} achieved={b.level.achieved} onClick={() => openBadge(b.badge_id)}>
            {!b.level.is_shown && b.level.achieved && <NotificationIcon text="NEW" position="top-absolute" />}
            <div className="icon-container">
              <img
                src={getIcon(b.level)}
                style={iconStyle(b.level.achieved)}
                alt={`Icon representing ${b.level.name}`}
              />
            </div>

            <h3>{b.level.name}</h3>
          </s.BadgeCard>
        ))}
      </s.BadgesRow>

      {selectedBadge && (
        <s.ModalOverlay onClick={() => setSelectedBadge(null)}>
          <s.BadgePanel onClick={(e) => e.stopPropagation()}>
            <h2>{selectedBadge.levels[currentLevelIndex].name}</h2>
            <div className="level-info">
              <img
                src={getIcon(selectedBadge.levels[currentLevelIndex])}
                style={iconStyle(selectedBadge.levels[currentLevelIndex].achieved)}
                alt={`Icon representing ${selectedBadge.levels[currentLevelIndex].name}`}
              />
              <div>{selectedBadge.levels[currentLevelIndex].description}</div>
              {selectedBadge.levels[currentLevelIndex].achieved ? (
                <s.AchievedAtBox>{`Achieved at: ${formatDateTime(selectedBadge.levels[currentLevelIndex].achieved_at)}`}</s.AchievedAtBox>
              ) : (
                <s.ProgressWrapper>
                  <s.ProgressBar>
                    <s.ProgressFill
                      style={{
                        width: `${
                          (Math.min(selectedBadge.current_value, selectedBadge.levels[currentLevelIndex].target_value) /
                            selectedBadge.levels[currentLevelIndex].target_value) *
                          100
                        }%`,
                      }}
                    />
                  </s.ProgressBar>
                  <s.ProgressText>
                    {selectedBadge.current_value} / {selectedBadge.levels[currentLevelIndex].target_value}
                  </s.ProgressText>
                </s.ProgressWrapper>
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
