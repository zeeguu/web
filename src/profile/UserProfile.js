import { useContext, useEffect, useState } from "react";
import { setTitle } from "../assorted/setTitle";
import { UserContext } from "../contexts/UserContext";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext";
import DynamicFlagImage from "../components/DynamicFlagImage";
import { ProgressContext } from "../contexts/ProgressContext";
import * as s from "./UserProfile.sc";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import EditIcon from "@mui/icons-material/Edit";
import { useHistory } from "react-router-dom";
import Modal from "../components/modal_shared/Modal";
import Header from "../components/modal_shared/Header.sc";
import Heading from "../components/modal_shared/Heading.sc";
import Main from "../components/modal_shared/Main.sc";
import {
  AVATAR_IMAGE_MAP,
  validatedAvatarBackgroundColor,
  validatedAvatarCharacterColor,
  validatedAvatarCharacterId,
} from "./avatarOptions";
import Badges from "@/badges/Badges";
import { BadgeCounterContext } from "@/badges/BadgeCounterContext";

export default function UserProfile() {
  const history = useHistory();
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const { daysPracticed } = useContext(ProgressContext);
  const [allDailyStreakInfo, setAllDailyStreakInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showLanguagesModal, setShowLanguagesModal] = useState(false);
  const { hasBadgeNotification, totalNumberOfBadges } = useContext(BadgeCounterContext);
  const [avatarCharacterId, setAvatarCharacterId] = useState();
  const [avatarCharacterColor, setAvatarCharacterColor] = useState();
  const [avatarBackgroundColor, setAvatarBackgroundColor] = useState();

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "friends", label: "Friends" },
    {
      key: "badges",
      label: `Badges${hasBadgeNotification ? ` (${totalNumberOfBadges})` : ""}`,
    },
  ];

  const max_visible_languages = 3;
  const visibleLanguages = allDailyStreakInfo?.slice(0, max_visible_languages);
  const overflowCount = allDailyStreakInfo
    ? allDailyStreakInfo.length > max_visible_languages
      ? allDailyStreakInfo.length - max_visible_languages
      : 0
    : 0;

  useEffect(() => {
    setTitle(strings.titleUserProfile);
  }, []);

  useEffect(() => {
    api.getAllDailyStreak((data) => {
      data.sort(function (a, b) {
        const keyA = a.max_streak;
        const keyB = b.max_streak;
        return keyA > keyB ? -1 : 1;
      });
      setAllDailyStreakInfo(data);
    });

    setAvatarCharacterId(validatedAvatarCharacterId(userDetails.user_avatar?.image_name));
    setAvatarCharacterColor(validatedAvatarCharacterColor(userDetails.user_avatar?.character_color));
    setAvatarBackgroundColor(validatedAvatarBackgroundColor(userDetails.user_avatar?.background_color));
  }, [userDetails, api]);

  return (
    <s.ProfileWrapper>
      <s.HeaderCard>
        <s.EditProfileButton onClick={() => history.push("/account_settings/profile_details")}>
          <EditIcon sx={{ fontSize: "1rem" }} />
        </s.EditProfileButton>
        <s.AvatarBackground $backgroundColor={avatarBackgroundColor}>
          <s.AvatarImage $imageSource={AVATAR_IMAGE_MAP[avatarCharacterId]} $color={avatarCharacterColor} />
        </s.AvatarBackground>
        <div>
          <div className="name-wrapper">
            <h2 className="username">{userDetails.username}</h2>
            {userDetails.name && <h2 className="display-name">({userDetails.name})</h2>}
          </div>

          <div className="meta">
            <span className="label">Active languages:</span>
            {visibleLanguages?.map((streakInfo) => (
              <DynamicFlagImage key={streakInfo.language.code} languageCode={streakInfo.language.code} />
            ))}
            {overflowCount > 0 && (
              <s.OverflowBubble onClick={() => setShowLanguagesModal(true)}>+{overflowCount}</s.OverflowBubble>
            )}
          </div>

          <div className="meta">
            <span className="label">Member since:</span>
            {userDetails.created_at ? new Date(userDetails.created_at).toLocaleDateString() : "-"}
          </div>

          <s.StatsRow>
            <div className="stat">
              <div className="stat-streak-wrapper">
                <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.2rem" }} />
                <span className="stat-value">{daysPracticed ?? "-"}</span>
              </div>
            </div>
          </s.StatsRow>
        </div>
      </s.HeaderCard>

      <s.TabsSection>
        <s.TabBar>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? "active" : ""}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </s.TabBar>
        <s.TabContent>
          {activeTab === "overview" && <div>Overview content goes here.</div>}
          {activeTab === "friends" && <div>Friends content goes here.</div>}
          {activeTab === "badges" && <Badges />}
        </s.TabContent>
      </s.TabsSection>

      <Modal open={showLanguagesModal} onClose={() => setShowLanguagesModal(false)}>
        <Header>
          <Heading>Active Languages</Heading>
        </Header>
        <Main>
          <s.LanguagesGrid>
            {allDailyStreakInfo?.map((streakInfo) => (
              <s.LanguageCard key={streakInfo.language.code}>
                <DynamicFlagImage languageCode={streakInfo.language.code} />
                <span className="language-name">{streakInfo.language.language}</span>
                <div className="streaks-info">
                  <div className="streak-item">
                    <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1rem" }} />
                    <span>{streakInfo.current_streak ?? 0}</span>
                  </div>
                  <div className="streak-item max-streak">
                    <LocalFireDepartmentIcon sx={{ color: "#e65100", fontSize: "1rem" }} />
                    <span>{streakInfo.max_streak ?? 0}</span>
                  </div>
                </div>
              </s.LanguageCard>
            ))}
          </s.LanguagesGrid>
        </Main>
      </Modal>
    </s.ProfileWrapper>
  );
}
