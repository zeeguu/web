import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import { BadgeCounterContext } from "./BadgeCounterContext";
import * as s from "./Badges.sc.js";
import Modal from "../components/modal_shared/Modal";
import Header from "../components/modal_shared/Header.sc";
import Main from "../components/modal_shared/Main.sc";

export default function Badges({ username }) {
  const api = useContext(APIContext);
  const { updateBadgeCounter } = useContext(BadgeCounterContext);

  const iconBasePath = "static/badges/";
  const defaultLogoPath = "static/images/zeeguuLogo.svg";

  const [activityTypes, setActivityTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActivityType, setSelectedActivityType] = useState(null);

  const fetchBadgesCallback = (data) => {
    if (!data || data.error) {
      setError(data?.error || "Could not load badges.");
      setIsLoading(false);
      return;
    }

    let hasNewBadges = false;

    const processedActivityTypes = data.map((activity_type) => {
      const processedBadges = activity_type.badges.map((lvl) => ({
        ...lvl,
        description: lvl.description
          ? lvl.description.replace("{threshold}", lvl.threshold)
          : activity_type.description.replace("{threshold}", lvl.threshold),
      }));

      processedBadges.forEach((badge) => {
        if (badge.achieved && !badge.is_shown) hasNewBadges = true;
      });

      return {
        name: activity_type.name,
        current_value: activity_type.current_value,
        badges: processedBadges,
      };
    });

    setActivityTypes(processedActivityTypes);

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

  const getIcon = (badge) => (badge.icon_name ? iconBasePath + badge.icon_name : defaultLogoPath);

  const formatDateTime = (iso) =>
    iso
      ? new Date(iso)
          .toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          })
          .replace(",", "")
      : "—";

  const getActivityTypeMeta = (activityType) => {
    const achievedBadges = activityType.badges.filter((b) => b.achieved);
    const highestAchieved = [...activityType.badges].reverse().find((b) => b.achieved);
    const nextLevel = activityType.badges.find((b) => !b.achieved) || highestAchieved;

    return {
      achievedCount: achievedBadges.length,
      highestAchieved,
      nextLevel,
      iconLevel: highestAchieved || activityType.badges[0],
      displayLevel: nextLevel || activityType.badges[activityType.badges.length - 1],
      hasNewBadge: !username && activityType.badges.some((b) => b.achieved && !b.is_shown),
    };
  };

  return (
    <>
      {isLoading && <p>Loading badges...</p>}
      {!isLoading && error && <p style={{ color: "#b00020" }}>{error}</p>}

      {!isLoading && !error && (
        <s.BadgeContainer>
          {activityTypes.map((activityType, index) => {
            const meta = getActivityTypeMeta(activityType);

            return (
              <s.BadgeCard key={index} onClick={() => setSelectedActivityType(activityType)}>
                {meta.hasNewBadge && <s.NewTag>NEW</s.NewTag>}
                <s.IconContainer>
                  <s.BadgeIcon
                    src={getIcon(meta.iconLevel)}
                    $achieved={meta.achievedCount > 0}
                    alt={activityType.name}
                  />
                </s.IconContainer>
                <s.BadgeTitle>
                  <div>{meta.nextLevel.name}</div>
                </s.BadgeTitle>
                <s.BadgeDescription>{meta.displayLevel.description}</s.BadgeDescription>
                {!meta.nextLevel.achieved ? (
                  <div className="card-bottom">
                    <s.ProgressWrapper>
                      <s.ProgressBar>
                        <s.ProgressFill
                          style={{
                            width: `${(Math.min(activityType.current_value, meta.nextLevel.threshold) / meta.nextLevel.threshold) * 100}%`,
                          }}
                          $isCurrent={true}
                        />
                      </s.ProgressBar>
                      <s.ProgressText>
                        {activityType.current_value} / {meta.nextLevel.threshold}
                      </s.ProgressText>
                    </s.ProgressWrapper>
                  </div>
                ) : (
                  <s.AchievedAtBox>
                    {formatDateTime(activityType.badges[activityType.badges.length - 1].achieved_at)}
                  </s.AchievedAtBox>
                )}
              </s.BadgeCard>
            );
          })}
        </s.BadgeContainer>
      )}
      {selectedActivityType &&
        (() => {
          const meta = getActivityTypeMeta(selectedActivityType);

          return (
            <Modal
              open={!!selectedActivityType}
              onClose={() => setSelectedActivityType(null)}
              style={{ maxWidth: "400px", width: "90%", margin: "auto" }}
            >
              <Header>
                <s.IconContainer>
                  <s.BadgeIcon
                    src={getIcon(meta.highestAchieved || selectedActivityType.badges[0])}
                    $achieved={!!meta.highestAchieved}
                  />
                </s.IconContainer>
              </Header>

              <Main style={{ gap: "0" }}>
                {selectedActivityType.badges.map((badge, i) => (
                  <s.LevelRow key={i} $achieved={badge.achieved} $isCurrent={badge === meta.nextLevel}>
                    {badge.achieved && !badge.is_shown && <s.NewTag>New</s.NewTag>}
                    <s.LevelTitle>{badge.name}</s.LevelTitle>
                    <s.BadgeDescription>{badge.description}</s.BadgeDescription>
                    {badge.achieved ? (
                      <s.AchievedAtBox>{formatDateTime(badge.achieved_at)}</s.AchievedAtBox>
                    ) : (
                      <s.ProgressWrapper>
                        <s.ProgressBar>
                          <s.ProgressFill
                            style={{
                              width: `${(Math.min(selectedActivityType.current_value, badge.threshold) / badge.threshold) * 100}%`,
                            }}
                            $isCurrent={badge === meta.nextLevel}
                          />
                        </s.ProgressBar>
                        <s.ProgressText>
                          {selectedActivityType.current_value} / {badge.threshold}
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
