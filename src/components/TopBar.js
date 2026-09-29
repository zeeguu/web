import { useCallback, useContext, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import useScrollDirection from "../hooks/useScrollDirection";
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

export default function TopBar() {
  const { userDetails } = useContext(UserContext);
  const history = useHistory();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [hasStreakBar, setHasStreakBar] = useState(null);
  const [avatarCharacterId, setAvatarCharacterId] = useState();
  const [avatarCharacterColor, setAvatarCharacterColor] = useState();
  const [avatarBackgroundColor, setAvatarBackgroundColor] = useState();
  const { hasBadgeNotification, totalNumberOfBadges } = useContext(BadgeCounterContext);
  const { hasFriendRequestNotification, friendRequestCount } = useContext(FriendRequestContext);

  // Same gesture as the tab row below: hidden while scrolling down, back on the
  // first pull. Without this the language switcher was only reachable by
  // scrolling a feed all the way back to the top.
  const scrollDirection = useScrollDirection();

  // Publish our height so TopTabs can park directly underneath instead of
  // overlapping us. It changes with content -- the streak bar replaces the lone
  // flag button once the learner has more than one language -- so observe it
  // rather than measuring once.
  const barRef = useRef(null);
  useEffect(() => {
    const element = barRef.current;
    if (!element) return;

    const publishHeight = () =>
      document.documentElement.style.setProperty(
        "--top-bar-height",
        `${element.offsetHeight}px`,
      );

    publishHeight();
    const observer = new ResizeObserver(publishHeight);
    observer.observe(element);
    return () => {
      observer.disconnect();
      // Desktop renders no TopBar, and TopTabs falls back to 0 only if the
      // variable is actually gone -- a stale value would indent it by a bar
      // that is not there.
      document.documentElement.style.removeProperty("--top-bar-height");
    };
  }, []);

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

  return (
    <>
      <s.TopBarContainer
        ref={barRef}
        className={scrollDirection === "down" ? "header--hidden" : ""}
      >
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
          <s.ProfileAvatarButton
            onClick={handleProfileClick}
            aria-label="Go to profile"
          >
            <s.TopBarNavAvatar $backgroundColor={avatarBackgroundColor}>
              <AvatarImage $imageSource={AVATAR_IMAGE_MAP[avatarCharacterId]} $color={avatarCharacterColor} />
            </s.TopBarNavAvatar>
            {(hasBadgeNotification || hasFriendRequestNotification) && (
              <NotificationIcon position={"top-absolute"} style={{top: 0, right: 0}} text={totalNumberOfBadges + friendRequestCount} />
            )}
          </s.ProfileAvatarButton>
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
