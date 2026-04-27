import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import strings from "../i18n/definitions";
import * as s from "./Badges.sc.js";
import Modal from "../components/modal_shared/Modal";
import Header from "../components/modal_shared/Header.sc";
import Main from "../components/modal_shared/Main.sc";

export default function Badges({ username }) {
  const api = useContext(APIContext);

  const iconBasePath = "static/badges/";
  const defaultLogoPath = "static/images/zeeguuLogo.svg";

  const [badgeCategories, setBadgeCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBadgeCategory, setSelectedBadgeCategory] = useState(null);

  const fetchBadgesCallback = (data) => {
    if (!data || data.error) {
      setError(data?.error || strings.couldNotLoadBadges);
      setIsLoading(false);
      return;
    }

    let hasNewBadges = false;

    const processedBadgeCategories = data.map((badge_category) => {
      const processedBadges = badge_category.badges.map((lvl) => ({
        ...lvl,
        description: lvl.achieved ? lvl.description : lvl.default_description,
      }));

      processedBadges.forEach((badge) => {
        if (badge.achieved && !badge.is_shown) hasNewBadges = true;
      });

      return {
        name: badge_category.name,
        current_value: badge_category.current_value,
        badges: processedBadges,
      };
    });

    setBadgeCategories(processedBadgeCategories);

    if (!username && hasNewBadges) {
      api.markAllBadgesSeen();
    }

    setIsLoading(false);
    setError(null);
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    if (username) {
      api.getFriendBadges(username, fetchBadgesCallback);
    } else {
      api.getMyBadges(fetchBadgesCallback);
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

  const getBadgeCategoryMeta = (badgeCategory) => {
    const achievedBadges = badgeCategory.badges.filter((b) => b.achieved);
    const highestAchieved = [...badgeCategory.badges].reverse().find((b) => b.achieved);
    const nextLevel = badgeCategory.badges.find((b) => !b.achieved) || highestAchieved;

    return {
      achievedCount: achievedBadges.length,
      highestAchieved,
      nextLevel,
      currentLevel: highestAchieved || badgeCategory.badges[0],
      hasNewBadge: !username && badgeCategory.badges.some((b) => b.achieved && !b.is_shown),
    };
  };

  return (
    <>
      {isLoading && <p>{strings.loadingBadges}</p>}
      {!isLoading && error && <p style={{ color: "#b00020" }}>{error}</p>}

      {!isLoading && !error && (
        <s.BadgeContainer>
          {badgeCategories.map((badgeCategory, index) => {
            const meta = getBadgeCategoryMeta(badgeCategory);

            return (
              <s.BadgeCard key={index} onClick={() => setSelectedBadgeCategory(badgeCategory)}>
                {meta.hasNewBadge && <s.NewTag>{strings.badgeNewTag}</s.NewTag>}
                <s.IconContainer>
                  <s.BadgeIcon
                    src={getIcon(meta.currentLevel)}
                    $achieved={meta.achievedCount > 0}
                    alt={badgeCategory.name}
                  />
                </s.IconContainer>
                <s.BadgeTitle>
                  <div>{meta.currentLevel.name}</div>
                </s.BadgeTitle>
                <s.BadgeDescription>{meta.currentLevel.description}</s.BadgeDescription>
                {!meta.nextLevel.achieved ? (
                  <div className="card-bottom">
                    <s.ProgressWrapper>
                      {meta.currentLevel.achieved ? <span>Next level:</span> : <span>Unlock:</span>}
                      <s.ProgressBar>
                        <s.ProgressFill
                          style={{
                            width: `${(Math.min(badgeCategory.current_value, meta.nextLevel.threshold) / meta.nextLevel.threshold) * 100}%`,
                          }}
                          $isCurrent={true}
                        />
                      </s.ProgressBar>
                      <s.ProgressText>
                        {badgeCategory.current_value} / {meta.nextLevel.threshold}
                      </s.ProgressText>
                    </s.ProgressWrapper>
                  </div>
                ) : (
                  <s.AchievedAtBox>
                    {formatDateTime(badgeCategory.badges[badgeCategory.badges.length - 1].achieved_at)}
                  </s.AchievedAtBox>
                )}
              </s.BadgeCard>
            );
          })}
        </s.BadgeContainer>
      )}
      {selectedBadgeCategory &&
        (() => {
          const meta = getBadgeCategoryMeta(selectedBadgeCategory);

          return (
            <Modal
              open={!!selectedBadgeCategory}
              onClose={() => setSelectedBadgeCategory(null)}
              style={{ maxWidth: "400px", width: "90%", margin: "auto" }}
            >
              <Header>
                <s.IconContainer>
                  <s.BadgeIcon
                    src={getIcon(meta.highestAchieved || selectedBadgeCategory.badges[0])}
                    $achieved={!!meta.highestAchieved}
                  />
                </s.IconContainer>
              </Header>

              <Main style={{ gap: "0" }}>
                {selectedBadgeCategory.badges.map((badge, i) => (
                  <s.LevelRow key={i} $achieved={badge.achieved} $isCurrent={badge === meta.nextLevel}>
                    {badge.achieved && !badge.is_shown && <s.NewTag>{strings.badgeNewTag}</s.NewTag>}
                    <s.LevelTitle>{badge.name}</s.LevelTitle>
                    <s.BadgeDescription>{badge.description}</s.BadgeDescription>
                    {badge.achieved ? (
                      <s.AchievedAtBox>{formatDateTime(badge.achieved_at)}</s.AchievedAtBox>
                    ) : (
                      <s.ProgressWrapper>
                        <s.ProgressBar>
                          <s.ProgressFill
                            style={{
                              width: `${(Math.min(selectedBadgeCategory.current_value, badge.threshold) / badge.threshold) * 100}%`,
                            }}
                            $isCurrent={badge === meta.nextLevel}
                          />
                        </s.ProgressBar>
                        <s.ProgressText>
                          {selectedBadgeCategory.current_value} / {badge.threshold}
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
