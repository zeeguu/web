import { useCallback, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import LanguageModal from "./MainNav/LanguageModal";
import LanguageStreakBar from "./LanguageStreakBar";
import * as s from "./Banners.sc";
import { AvatarBackground, AvatarImage } from "../profile/UserProfile.sc";
import {
  AVATAR_IMAGE_MAP,
  validatedAvatarBackgroundColor,
  validatedAvatarCharacterColor,
  validatedAvatarCharacterId,
} from "../profile/avatarOptions";
import { BadgeCounterContext } from "../contexts/BadgeCounterContext";
import { FriendRequestContext } from "../contexts/FriendRequestContext";
import NotificationIcon from "./NotificationIcon";
import Feature from "../features/Feature";
import UpgradeAccountModal from "./UpgradeAccountModal";
import NavIcon from "./MainNav/NavIcon";

export default function TopBar() {
  const { userDetails } = useContext(UserContext);
  const history = useHistory();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [hasStreakBar, setHasStreakBar] = useState(null);
  const [avatarCharacterId, setAvatarCharacterId] = useState();
  const [avatarCharacterColor, setAvatarCharacterColor] = useState();
  const [avatarBackgroundColor, setAvatarBackgroundColor] = useState();
  const { hasBadgeNotification, totalNumberOfBadges } = useContext(BadgeCounterContext);
  const { friendRequestCount } = useContext(FriendRequestContext);

  // The friend shortcut's dot is scoped to pending friend requests only.
  // Shared articles are content and keep their own unread badge on the homepage
  // reading inbox, so we don't double-surface them here. Keeping this separate
  // from the avatar's badge dot means: dot on the avatar = "new badge", dot on
  // the friend icon = "someone wants to connect".
  const friendNotificationCount = friendRequestCount;

  useEffect(() => {
    setAvatarCharacterId(validatedAvatarCharacterId(userDetails?.user_avatar?.image_name));
    setAvatarCharacterColor(validatedAvatarCharacterColor(userDetails?.user_avatar?.character_color));
    setAvatarBackgroundColor(validatedAvatarBackgroundColor(userDetails?.user_avatar?.background_color));
  }, [userDetails]);

  const closeLanguageModal = useCallback(() => setShowLanguageModal(false), []);
  const openLanguageModal = useCallback(() => setShowLanguageModal(true), []);

  const isAnonymous = userDetails?.is_anonymous;
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleProfileClick = () => {
    if (isAnonymous) {
      setShowUpgradeModal(true);
      return;
    }
    history.push("/profile");
  };

  const handleFriendsClick = () => {
    if (isAnonymous) {
      setShowUpgradeModal(true);
      return;
    }
    history.push("/friends");
  };

  return (
    <>
      <s.TopBarContainer>
        {hasStreakBar === false && (
          <s.FlagButton onClick={openLanguageModal} aria-label="Change language">
            <s.FlagImage src={`/static/flags-new/${userDetails?.learned_language}.svg`} alt="" />
          </s.FlagButton>
        )}
        <LanguageStreakBar
          onMultipleLanguages={setHasStreakBar}
          onOpenModal={openLanguageModal}
        />
        {Feature.has_gamification() && (
          <s.TopBarRight>
            <s.TopBarIconButton onClick={handleFriendsClick} aria-label="Go to friends">
              <NavIcon name="friends" />
              {friendNotificationCount > 0 && (
                <NotificationIcon
                  position={"top-absolute"}
                  style={{ top: 0, right: 0 }}
                  text={friendNotificationCount}
                />
              )}
            </s.TopBarIconButton>
            <s.ProfileAvatarButton onClick={handleProfileClick} aria-label="Go to profile">
              <s.TopBarNavAvatar $backgroundColor={avatarBackgroundColor}>
                <AvatarImage $imageSource={AVATAR_IMAGE_MAP[avatarCharacterId]} $color={avatarCharacterColor} />
              </s.TopBarNavAvatar>
              {hasBadgeNotification && (
                <NotificationIcon
                  position={"top-absolute"}
                  style={{ top: 0, right: 0 }}
                  text={totalNumberOfBadges}
                />
              )}
            </s.ProfileAvatarButton>
          </s.TopBarRight>
        )}
      </s.TopBarContainer>
      <LanguageModal
        open={showLanguageModal}
        setOpen={closeLanguageModal}
      />
      <UpgradeAccountModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSuccess={() => {}}
        triggerReason="profile"
        bookmarkCount={userDetails?.bookmark_count || 0}
      />
    </>
  );
}
