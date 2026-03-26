import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import * as s from "./Badges.sc.js";
import NotificationIcon from "../components/NotificationIcon";

export default function Badges({ userId }) {
  const api = useContext(APIContext);

  const iconBasePath = "../../../public/static/badges/";
  const defaultLogoPath = "../../../public/static/images/zeeguuLogo.svg";

  const [levels, setLevels] = useState([]);

  useEffect(() => {
    const handleData = (data) => {
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

      if (!userId && hasNewBadges) {
        api.updateNotShownForUser();
      }
    };

    if (userId) {
      api.getBadgesForFriend(userId, handleData);
    } else {
      api.getBadgesForUser(handleData);
    }
  }, [api, userId]);

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
    <s.BadgeContainer>
      {levels.map((level, index) => (
        <s.BadgeCard key={index}>
          {!userId && !level.is_shown && level.achieved && (
            <NotificationIcon text="NEW" position="card-corner" isActive={true} />
          )}

          <div className="icon-container">
            <img src={getIcon(level)} style={iconStyle(level.achieved)} alt={level.name} />
          </div>

          <h3>{level.name || `Level ${level.badge_level}`}</h3>

          <div>{level.description}</div>

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
  );
}
