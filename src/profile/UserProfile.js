import { useContext, useEffect, useState } from "react";
import { setTitle } from "../assorted/setTitle";
import { UserContext } from "../contexts/UserContext";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext";
import DynamicFlagImage from "../components/DynamicFlagImage";
import { ProgressContext } from "../contexts/ProgressContext";
import * as s from "./UserProfile.sc.js";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Modal from "../components/modal_shared/Modal";
import Header from "../components/modal_shared/Header.sc";
import Heading from "../components/modal_shared/Heading.sc";
import Main from "../components/modal_shared/Main.sc";
import {
  AVATAR_BACKGROUND_COLORS,
  AVATAR_CHARACTER_COLORS,
  AVATAR_IMAGES,
  getAvatarImageById,
  getSavedBackgroundColor,
  getSavedCharacterColor,
  getSavedCharacterId,
  saveCharacterBackgroundColor,
  saveCharacterColor,
  saveCharacterId,
} from "./avatarOptions";

const MAX_VISIBLE_LANGUAGES = 3;

export default function UserProfile() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const { daysPracticed } = useContext(ProgressContext);
  const [allDailyStreakInfo, setAllDailyStreakInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showLanguagesModal, setShowLanguagesModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState(getSavedCharacterId);
  const [selectedCharacterColor, setSelectedCharacterColor] = useState(getSavedCharacterColor);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(getSavedBackgroundColor);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "friends", label: "Friends" },
    { key: "badges", label: "Badges" },
  ];

  const currentAvatarImage = getAvatarImageById(selectedCharacterId);

  const visibleLanguages = allDailyStreakInfo?.slice(0, MAX_VISIBLE_LANGUAGES);
  const overflowCount = allDailyStreakInfo
    ? allDailyStreakInfo.length > MAX_VISIBLE_LANGUAGES
      ? allDailyStreakInfo.length - MAX_VISIBLE_LANGUAGES
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
      console.log(data);
    });
  }, [api]);

  return (
    <s.ProfileWrapper>
      <s.HeaderCard>
        <s.AvatarWrapper onClick={() => setShowAvatarModal(true)} $backgroundColor={selectedBackgroundColor}>
          <s.AvatarImage $imageSource={currentAvatarImage.src} $color={selectedCharacterColor} />
        </s.AvatarWrapper>
        <div>
          <h2 className="username">{userDetails.name}</h2>

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
          {activeTab === "badges" && <div>Badges content goes here.</div>}
        </s.TabContent>
      </s.TabsSection>

      <Modal open={showAvatarModal} onClose={() => setShowAvatarModal(false)}>
        <Header>
          <Heading>Choose Your Avatar</Heading>
        </Header>
        <Main>
          <s.PickerSection>
            <span className="picker-label">Character</span>
            <s.PickerGrid>
              {AVATAR_IMAGES.map((avatar) => (
                <s.AvatarOption
                  key={avatar.id}
                  $selected={selectedCharacterId === avatar.id}
                  $backgroundColor={selectedBackgroundColor}
                  onClick={() => {
                    setSelectedCharacterId(avatar.id);
                    saveCharacterId(avatar.id);
                  }}
                >
                  <s.AvatarImage $imageSource={avatar.src} $color={selectedCharacterColor} />
                </s.AvatarOption>
              ))}
            </s.PickerGrid>
          </s.PickerSection>

          <s.PickerSection>
            <span className="picker-label">Character Color</span>
            <s.PickerGrid>
              {AVATAR_CHARACTER_COLORS.map((color) => (
                <s.ColorOption
                  key={color}
                  $backgroundColor={color}
                  $selected={selectedCharacterColor === color}
                  onClick={() => {
                    setSelectedCharacterColor(color);
                    saveCharacterColor(color);
                  }}
                />
              ))}
            </s.PickerGrid>
          </s.PickerSection>

          <s.PickerSection>
            <span className="picker-label">Background Color</span>
            <s.PickerGrid>
              {AVATAR_BACKGROUND_COLORS.map((color) => (
                <s.ColorOption
                  key={color}
                  $backgroundColor={color}
                  $selected={selectedBackgroundColor === color}
                  onClick={() => {
                    setSelectedBackgroundColor(color);
                    saveCharacterBackgroundColor(color);
                  }}
                />
              ))}
            </s.PickerGrid>
          </s.PickerSection>
        </Main>
      </Modal>

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
