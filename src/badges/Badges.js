import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import * as s from "./Badges.sc.js";

export default function Badges({ username }) {
  const api = useContext(APIContext);

  const iconBasePath = "../../../public/static/badges/";
  const defaultLogoPath = "../../../public/static/images/zeeguuLogo.svg";

  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBadgesCallback = (data) => {
    if (!data || data.error) {
      setError(data?.error || "Could not load badges.");
      setIsLoading(false);
      return;
    }

    const allLevels = [];
    let hasNewBadges = false;

    data.forEach((badge) => {
      badge.levels.forEach((lvl) => {
        const level = {
          ...lvl,
          badgeName: badge.name,
          current_value: badge.current_value,
          description: lvl.description
            ? lvl.description.replace("{target_value}", lvl.target_value)
            : badge.description.replace("{target_value}", lvl.target_value),
        };

        if (level.achieved && !level.is_shown) {
          hasNewBadges = true;
        }

        allLevels.push(level);
      });
    });

    setLevels(allLevels);

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

  return (
    <>
      {isLoading && <p>Loading badges...</p>}
      {!isLoading && error && <p style={{ color: "#b00020" }}>{error}</p>}

      {!isLoading && !error && (
        <s.BadgeContainer>
          {levels.map((level, index) => (
            <s.BadgeCard key={index}>
              {!username && !level.is_shown && level.achieved && <s.NewTag>NEW</s.NewTag>}
              <s.IconContainer>
                <s.BadgeIcon src={getIcon(level)} style={iconStyle(level.achieved)} alt={level.name} />
              </s.IconContainer>
              <s.BadgeTitle>{level.name || `Level ${level.badge_level}`}</s.BadgeTitle>
              <s.BadgeDescription>{level.description}</s.BadgeDescription>

              {level.achieved ? (
                <s.AchievedAtBox>{formatDateTime(level.achieved_at)}</s.AchievedAtBox>
              ) : (
                <s.ProgressWrapper>
                  <s.ProgressBar>
                    <s.ProgressFill
                      style={{
                        width: `${(Math.min(level.current_value, level.target_value) / level.target_value) * 100}%`,
                      }}
                    />
                  </s.ProgressBar>

                  <s.ProgressText>
                    {level.current_value} / {level.target_value}
                  </s.ProgressText>
                </s.ProgressWrapper>
              )}
            </s.BadgeCard>
          ))}
        </s.BadgeContainer>
      )}
    </>
  );
}
