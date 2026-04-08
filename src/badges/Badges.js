import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import * as s from "./Badges.sc.js";

export default function Badges({ username }) {
  const api = useContext(APIContext);

  const iconBasePath = "static/badges/";
  const defaultLogoPath = "static/images/zeeguuLogo.svg";

  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const iconStyle = (achieved) => ({
    filter: achieved ? "none" : "grayscale(100%)",
    opacity: achieved ? 1 : 0.5,
  });

  const formatDateTime = (iso) =>
    iso
      ? new Date(iso)
          .toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          })
          .replace(",", "")
      : "—";

  const renderStars = (achievedCount) => "★".repeat(achievedCount);

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
              <s.BadgeCard key={index}>
                {hasNewBadge && <s.NewTag>NEW</s.NewTag>}
                <s.IconContainer>
                  <s.BadgeIcon
                    src={getIcon(iconLevel)}
                    style={iconStyle(achievedCount > 0)}
                    alt={badge.name}
                  />
                </s.IconContainer>
                <s.BadgeTitle>
                  <div>{badge.name}</div>
                  {achievedCount > 0 && (
                    <s.Stars>{renderStars(achievedCount)}</s.Stars>
                  )}
                </s.BadgeTitle>
                <s.BadgeDescription>{displayLevel.description}</s.BadgeDescription>
                {nextLevel ? (
                  <s.ProgressWrapper>
                    <s.ProgressBar>
                      <s.ProgressFill
                        style={{
                          width: `${(Math.min(badge.current_value, nextLevel.target_value) / nextLevel.target_value) * 100}%`,
                        }}
                      />
                    </s.ProgressBar>
                    <s.ProgressText>
                      {badge.current_value} / {nextLevel.target_value}
                    </s.ProgressText>
                  </s.ProgressWrapper>
                ) : (
                  <s.AchievedAtBox>
                    {formatDateTime(badge.levels[badge.levels.length - 1].achieved_at)}
                  </s.AchievedAtBox>
                )}
              </s.BadgeCard>
            );
          })}
        </s.BadgeContainer>
      )}
    </>
  );
}
