import EditIcon from "@mui/icons-material/Edit";
import {
  AVATAR_IMAGE_MAP,
  validatedAvatarBackgroundColor,
  validatedAvatarCharacterColor,
  validatedAvatarCharacterId,
} from "./avatarOptions";
import Stack from "@mui/material/Stack";
import DynamicFlagImage from "../components/DynamicFlagImage";
import { useContext } from "react";
import { ProgressContext } from "../contexts/ProgressContext";
import * as s from "./ProfileHeaderCard.sc";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { streakFireOrange } from "../components/colors";
import { AvatarBackground, AvatarImage, LanguageOverflowBubble } from "./UserProfile.sc";
import { FriendActionButtons } from "./FriendActionButtons";

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString() : "-";
}

export function ProfileHeaderCard({
  isOwnProfile,
  profileData,
  activeLanguages,
  onOpenLanguagesModal,
  onEditProfile,
  friendActionHandlers,
  isPendingFriendAction,
}) {
  const { daysPracticed } = useContext(ProgressContext);
  const maxVisibleLanguages = 3;
  const visibleLanguages = activeLanguages.slice(0, maxVisibleLanguages);
  const overflowCount = Math.max(0, activeLanguages.length - maxVisibleLanguages);
  const avatarCharacterId = validatedAvatarCharacterId(profileData?.user_avatar?.image_name);
  const avatarCharacterColor = validatedAvatarCharacterColor(profileData?.user_avatar?.character_color);
  const avatarBackgroundColor = validatedAvatarBackgroundColor(profileData?.user_avatar?.background_color);
  const friendship = profileData?.friendship;
  const isFriendAccepted = friendship?.is_accepted === true;
  const streakValue = (isOwnProfile ? daysPracticed : friendship?.friend_streak) ?? 0;

  return (
    <s.HeaderCard>
      {isOwnProfile && (
        <s.EditProfileButton onClick={onEditProfile}>
          <EditIcon sx={{ fontSize: "1rem" }} />
        </s.EditProfileButton>
      )}

      <AvatarBackground $backgroundColor={avatarBackgroundColor}>
        <AvatarImage $imageSource={AVATAR_IMAGE_MAP[avatarCharacterId]} $color={avatarCharacterColor} />
      </AvatarBackground>

      <div>
        <div className="name-wrapper">
          <h2 className="username">{profileData?.username ?? "-"}</h2>
          {profileData?.name && <h2 className="display-name">({profileData.name})</h2>}
        </div>

        <div className="meta">
          <span className="label">Active languages:</span>
          {visibleLanguages.length > 0 ? (
            <>
              {visibleLanguages.map((languageInfo, index) => (
                <span
                  className="flag-image-wrapper"
                  key={`${languageInfo.code}-${index}`}
                  onClick={onOpenLanguagesModal}
                >
                  <DynamicFlagImage languageCode={languageInfo.code} />
                </span>
              ))}
              {overflowCount > 0 && (
                <LanguageOverflowBubble $isSmallSized={false} onClick={onOpenLanguagesModal}>
                  +{overflowCount}
                </LanguageOverflowBubble>
              )}
            </>
          ) : (
            "-"
          )}
        </div>

        <div className="meta">
          <span className="label">Member since:</span>
          {formatDate(profileData?.created_at)}
        </div>

        {!isOwnProfile && isFriendAccepted && (
          <div className="meta">
            <span className="label">Friends since:</span>
            {formatDate(profileData?.friendship?.created_at)}
          </div>
        )}

        {(isOwnProfile || isFriendAccepted) && (
          <s.StatsRow>
            <div className="stat">
              <div className="stat-streak-wrapper">
                {isFriendAccepted ? (
                  <Stack direction="row" spacing={-1.2} alignItems="center">
                    <LocalFireDepartmentIcon
                      sx={{
                        color: streakFireOrange,
                        fontSize: "1.2rem",
                        filter:
                          "drop-shadow(2px 0 0 var(--streak-banner-border)) drop-shadow(0 2px 0 var(--streak-banner-border))",
                      }}
                    />
                    <LocalFireDepartmentIcon sx={{ color: streakFireOrange, fontSize: "1.2rem" }} />
                  </Stack>
                ) : (
                  <LocalFireDepartmentIcon sx={{ color: streakFireOrange, fontSize: "1.2rem" }} />
                )}
                <span className="stat-value">{streakValue}</span>
                <span className="stat-label">{isFriendAccepted ? "day friend streak" : "day streak"}</span>
              </div>
            </div>
          </s.StatsRow>
        )}
      </div>

      {!isOwnProfile && (
        <FriendActionButtons
          profileData={profileData}
          friendship={friendship}
          isFriendAccepted={isFriendAccepted}
          friendActionHandlers={friendActionHandlers}
          isPendingFriendAction={isPendingFriendAction}
        />
      )}
    </s.HeaderCard>
  );
}
