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
import { BadgeCounterContext } from "../badges/BadgeCounterContext";
import { FriendRequestContext } from "../contexts/FriendRequestContext";
import NotificationIcon from "./NotificationIcon";
import Feature from "../features/Feature";

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

  useEffect(() => {
    setAvatarCharacterId(validatedAvatarCharacterId(userDetails?.user_avatar?.image_name));
    setAvatarCharacterColor(validatedAvatarCharacterColor(userDetails?.user_avatar?.character_color));
    setAvatarBackgroundColor(validatedAvatarBackgroundColor(userDetails?.user_avatar?.background_color));
  }, [userDetails]);

  const closeLanguageModal = useCallback(() => setShowLanguageModal(false), []);
  const openLanguageModal = useCallback(() => setShowLanguageModal(true), []);

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
          <s.ProfileAvatarButton
            onClick={() => history.push("/profile")}
            aria-label="Go to profile"
          >
            <s.TopBarNavAvatar $backgroundColor={avatarBackgroundColor}>
              <AvatarImage $imageSource={AVATAR_IMAGE_MAP[avatarCharacterId]} $color={avatarCharacterColor} />
            </s.TopBarNavAvatar>
            {(hasBadgeNotification || hasFriendRequestNotification) && (
              <NotificationIcon position={"top"} text={totalNumberOfBadges + friendRequestCount} />
            )}
          </s.ProfileAvatarButton>
        )}
      </s.TopBarContainer>
      <LanguageModal
        open={showLanguageModal}
        setOpen={closeLanguageModal}
      />
    </>
  );
}
