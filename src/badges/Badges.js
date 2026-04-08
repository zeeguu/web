import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import * as s from "./Badges.sc.js";
import Modal from "../components/modal_shared/Modal";
import Header from "../components/modal_shared/Header.sc";
import Heading from "../components/modal_shared/Heading.sc";
import Main from "../components/modal_shared/Main.sc";

export default function Badges({ username }) {
  const api = useContext(APIContext);

  const iconBasePath = "static/badges/";
  const defaultLogoPath = "static/images/zeeguuLogo.svg";

  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const fetchBadgesCallback = (data) => {
    if (!data || data.error) {
      setError(data?.error || "Could not load badges.");
      setIsLoading(false);
      return;
    }

    let hasNewBadges = false;

    const processedBadges = data.map((badge) => {
      const processedLevels = badge.levels.map((lvl) => ({
        ...lvl,
        description: lvl.description
          ? lvl.description.replace("{target_value}", lvl.target_value)
          : badge.description.replace("{target_value}", lvl.target_value),
      }));

      processedLevels.forEach((lvl) => {
        if (lvl.achieved && !lvl.is_shown) hasNewBadges = true;
      });

      return {
        name: badge.name,
        current_value: badge.current_value,
        levels: processedLevels,
      };
    });

    setBadges(processedBadges);

    if (!username && hasNewBadges) {
      api.updateNotShownForUser();
    }

    setIsLoading(false);
    setError(null);
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    if (username) {
      api.getBadgesForFriend(username, fetchBadgesCallback);
    } else {
      api.getBadgesForUser(fetchBadgesCallback);
    }
  }, [api, username]);

  const getIcon = (level) => (level.icon_name ? iconBasePath + level.icon_name : defaultLogoPath);

  const formatDateTime = (iso) =>
    iso
      ? new Date(iso)
          .toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          })
          .replace(",", "")
      : "—";

  return (
    <>
      {isLoading && <p>Loading badges...</p>}
      {!isLoading && error && <p style={{ color: "#b00020" }}>{error}</p>}

      {!isLoading && !error && (
        <s.BadgeContainer>
          {badges.map((badge, index) => {
            const achievedCount = badge.levels.filter((l) => l.achieved).length;
            const nextLevel = badge.levels.find((l) => !l.achieved);
            const highestAchieved = [...badge.levels].reverse().find((l) => l.achieved);
            const iconLevel = highestAchieved || badge.levels[0];
            const displayLevel = nextLevel || badge.levels[badge.levels.length - 1];
            const hasNewBadge = !username && badge.levels.some((l) => l.achieved && !l.is_shown);

            return (
              <s.BadgeCard key={index} onClick={() => setSelectedBadge(badge)}>
                {hasNewBadge && <s.NewTag>NEW</s.NewTag>}
                <s.IconContainer>
                  <s.BadgeIcon src={getIcon(iconLevel)} $achieved={achievedCount > 0} alt={badge.name} />
                </s.IconContainer>
                <s.BadgeTitle>
                  <div>{badge.name}</div>
                  <div>Level {nextLevel.badge_level}</div>
                </s.BadgeTitle>
                <s.BadgeDescription>{displayLevel.description}</s.BadgeDescription>
                {nextLevel ? (
                  <div className="card-bottom">
                    <s.ProgressWrapper>
                      <s.ProgressBar>
                        <s.ProgressFill
                          style={{
                            width: `${(Math.min(badge.current_value, nextLevel.target_value) / nextLevel.target_value) * 100}%`,
                          }}
                          $isCurrent={true}
                        />
                      </s.ProgressBar>
                      <s.ProgressText>
                        {badge.current_value} / {nextLevel.target_value}
                      </s.ProgressText>
                    </s.ProgressWrapper>
                  </div>
                ) : (
                  <s.AchievedAtBox>{formatDateTime(badge.levels[badge.levels.length - 1].achieved_at)}</s.AchievedAtBox>
                )}
              </s.BadgeCard>
            );
          })}
        </s.BadgeContainer>
      )}
      {selectedBadge &&
        (() => {
          const highestAchieved = [...selectedBadge.levels].reverse().find((l) => l.achieved);
          const nextLevel = selectedBadge.levels.find((l) => !l.achieved);

          return (
            <Modal
              open={!!selectedBadge}
              onClose={() => setSelectedBadge(null)}
              style={{ maxWidth: "400px", width: "90%", margin: "auto" }}
            >
              <Header>
                <s.IconContainer>
                  <s.BadgeIcon
                    src={getIcon(highestAchieved || selectedBadge.levels[0])}
                    $achieved={!!highestAchieved}
                  />
                </s.IconContainer>
                <Heading style={{ textAlign: "center" }}>{selectedBadge.name}</Heading>
              </Header>

              <Main style={{ gap: "0" }}>
                {selectedBadge.levels.map((level, i) => (
                  <s.LevelRow key={i} $achieved={level.achieved} $isCurrent={level === nextLevel}>
                    {level.achieved && !level.is_shown && <s.NewTag>New</s.NewTag>}
                    <s.LevelTitle>Level {level.badge_level}</s.LevelTitle>
                    <s.BadgeDescription>{level.description}</s.BadgeDescription>
                    {level.achieved ? (
                      <s.AchievedAtBox>{formatDateTime(level.achieved_at)}</s.AchievedAtBox>
                    ) : (
                      <s.ProgressWrapper>
                        <s.ProgressBar>
                          <s.ProgressFill
                            style={{
                              width: `${(Math.min(selectedBadge.current_value, level.target_value) / level.target_value) * 100}%`,
                            }}
                            $isCurrent={level === nextLevel}
                          />
                        </s.ProgressBar>
                        <s.ProgressText>
                          {selectedBadge.current_value} / {level.target_value}
                        </s.ProgressText>
                      </s.ProgressWrapper>
                    )}
                  </s.LevelRow>
                ))}
              </Main>
            </Modal>
          );
        })()}
    </>
  );
}
