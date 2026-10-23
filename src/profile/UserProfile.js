import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { setTitle } from "../assorted/setTitle";
import { UserContext } from "../contexts/UserContext";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext";
import Friends from "../friends/Friends";
import { FriendRequestContext } from "../contexts/FriendRequestContext";
import Badges from "../badges/Badges";
import * as s from "./UserProfile.sc";
import { BadgeCounterContext } from "../contexts/BadgeCounterContext";
import LoadingAnimation from "../components/LoadingAnimation";
import CardPage from "../pages/_pages_shared/CardPage";
import SettingsPageHeader from "../pages/Settings/SharedComponents/SettingsPageHeader";
import Leaderboards from "../leaderboards/Leaderboards";
import useFriendActions from "../hooks/useFriendActions";
import { ProfileHeaderCard } from "./ProfileHeaderCard";
import { ProfileTabs } from "./ProfileTabs";
import { UnfriendConfirmModal } from "./UnfriendConfirmModal";
import { LanguagesModal } from "./LanguagesModal";
import AvatarPickerModal from "./AvatarPickerModal";
import { DEFAULT_PROFILE_TAB, PROFILE_TABS, profileTabPath } from "./profileTabRoutes";

export default function UserProfile() {
  const api = useContext(APIContext);
  const history = useHistory();
  const [profileData, setProfileData] = useState(null);
  const { userDetails } = useContext(UserContext);
  const [activeLanguages, setActiveLanguages] = useState([]);
  const [languagesModalOpen, setLanguagesModalOpen] = useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const { hasFriendRequestNotification, friendRequestCount } = useContext(FriendRequestContext);
  const { hasBadgeNotification, totalNumberOfBadges, updateBadgeCounter } = useContext(BadgeCounterContext);
  const { friendUsername, profileTab } = useParams();
  const activeTab = profileTab ?? DEFAULT_PROFILE_TAB;
  const [isOwnProfile, setIsOwnProfile] = useState(!friendUsername);
  const [loadingProfileDetails, setLoadingProfileDetails] = useState(true);
  const [friendDetailsError, setFriendDetailsError] = useState(null);
  const [unfriendModalOpen, setUnfriendModalOpen] = useState(false);
  const friendship = profileData?.friendship;
  const isFriendAccepted = friendship?.is_accepted === true;
  const { unfriend, sendFriendRequest, cancelFriendRequest, acceptFriendRequest, rejectFriendRequest } =
    useFriendActions();
  const [isPendingFriendAction, setIsPendingFriendAction] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [api, userDetails, friendUsername]);

  const loadProfile = () => {
    resetProfileState();

    if (!api) return;

    if (!friendUsername) {
      setIsOwnProfile(true);
      updateProfileView(userDetails, null, strings.titleOwnProfile);
      api.getMyLanguageStreakHistory(activeLanguagesCallback);
      return;
    }

    setIsOwnProfile(false);
    setFriendDetailsError(null);
    api.getFriendDetails(friendUsername, (data) => {
      if (!data || data.error) {
        updateProfileView({}, data?.error || "Failed to fetch profile.", strings.titleUserProfileDefault);
        setLoadingProfileDetails(false);
        return;
      }

      const isSameUser = data.username === userDetails?.username;
      if (isSameUser) {
        handleUserProfileNavigation(null);
      } else {
        updateProfileView(data, null, `${data.username}'s ${strings.titleUserProfilePostfix}`);
        api.getFriendLanguageStreakHistory(friendUsername, activeLanguagesCallback);
      }
    });
  };

  const resetProfileState = () => {
    setProfileData(null);
    setActiveLanguages([]);
    setLoadingProfileDetails(true);
    setFriendDetailsError(null);
  };

  const updateProfileView = (updatedProfileData, errorMsg, title) => {
    setProfileData(updatedProfileData);
    setFriendDetailsError(errorMsg);
    setTitle(title);
  };

  const activeLanguagesCallback = (data) => {
    setLoadingProfileDetails(false);
    if (!data) {
      setActiveLanguages([]);
      return;
    }
    setActiveLanguages(data);
  };

  const handleUserProfileNavigation = (target) => {
    setLoadingProfileDetails(true);
    history.push(target ? `/profile/${encodeURIComponent(target)}` : "/profile");
  };

  const updateProfileFriendship = (newFriendship) => {
    setProfileData((prev) => ({ ...prev, friendship: newFriendship }));
  };

  const handleUnfriend = () => {
    doFriendAction(unfriend, () => {
      setUnfriendModalOpen(false);
      loadProfile();
    });
  };

  const handleSendFriendRequest = () => {
    doFriendAction(sendFriendRequest, () => {
      updateProfileFriendship({ is_accepted: false, sender_username: userDetails.username });
    });
  };

  const handleCancelFriendRequest = () => {
    doFriendAction(cancelFriendRequest, () => {
      updateProfileFriendship(null);
    });
  };

  const handleAcceptFriendRequest = () => {
    doFriendAction(acceptFriendRequest, () => {
      loadProfile();
    });
  };

  const handleRejectFriendRequest = () => {
    doFriendAction(rejectFriendRequest, () => {
      updateProfileFriendship(null);
    });
  };

  const doFriendAction = (actionFn, onSuccess) => {
    setIsPendingFriendAction(true);
    actionFn({
      username: friendUsername,
      onSuccess: onSuccess,
      onError: (message) => setFriendDetailsError(message),
      onFinally: () => setIsPendingFriendAction(false),
    });
  };

  const friendActionHandlers = {
    onUnfriend: () => setUnfriendModalOpen(true),
    onAdd: handleSendFriendRequest,
    onCancel: handleCancelFriendRequest,
    onAccept: handleAcceptFriendRequest,
    onReject: handleRejectFriendRequest,
  };

  const tabs = [
    {
      key: PROFILE_TABS.BADGES,
      label: `Badges${isOwnProfile && hasBadgeNotification ? ` (${totalNumberOfBadges})` : ""}`,
    },
    {
      key: PROFILE_TABS.FRIENDS,
      label: `Friends${isOwnProfile && hasFriendRequestNotification ? ` (${friendRequestCount})` : ""}`,
    },
    ...(isOwnProfile ? [{ key: PROFILE_TABS.LEADERBOARDS, label: "Leaderboards" }] : []),
  ].map((tab) => ({ ...tab, link: profileTabPath(friendUsername, tab.key) }));

  const renderTabContent = () => {
    if (activeTab === PROFILE_TABS.BADGES) {
      return <Badges username={friendUsername} />;
    }

    if (activeTab === PROFILE_TABS.FRIENDS) {
      return <Friends friendUsername={friendUsername} navigationHandler={handleUserProfileNavigation} />;
    }

    if (activeTab === PROFILE_TABS.LEADERBOARDS) {
      return <Leaderboards navigationHandler={handleUserProfileNavigation} isStudent={profileData?.is_student} />;
    }

    return null;
  };

  // The tabs navigate on their own; opening any of them counts as having seen
  // the new badges.
  const handleTabClick = () => {
    if (isOwnProfile && hasBadgeNotification) {
      updateBadgeCounter();
    }
  };

  return (
    // Settings' page frame and header, so moving between the two keeps the
    // back arrow (tap or swipe right) in the same place. Opened directly there
    // is no history, so back falls back to the feed.
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <s.ProfileWrapper>
        <SettingsPageHeader
          title={isOwnProfile ? strings.titleOwnProfile : profileData?.username || "Profile"}
          func={() => (history.length > 1 ? history.goBack() : history.push("/articles"))}
        />

        {loadingProfileDetails && (
          <LoadingAnimation delay={0}>
            <p>Loading {!isOwnProfile ? "friend" : ""} profile...</p>
          </LoadingAnimation>
        )}

        {!isOwnProfile && friendDetailsError && <s.ErrorText>{friendDetailsError}</s.ErrorText>}

        {!loadingProfileDetails && !friendDetailsError && (
          <>
            <ProfileHeaderCard
              isOwnProfile={isOwnProfile}
              profileData={profileData}
              activeLanguages={activeLanguages}
              onOpenLanguagesModal={() => setLanguagesModalOpen(true)}
              onEditAvatar={() => setAvatarPickerOpen(true)}
              friendActionHandlers={friendActionHandlers}
              isPendingFriendAction={isPendingFriendAction}
            />

            {(isOwnProfile || isFriendAccepted) && (
              <ProfileTabs tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick}>
                {renderTabContent()}
              </ProfileTabs>
            )}

            <UnfriendConfirmModal
              open={unfriendModalOpen}
              onClose={() => setUnfriendModalOpen(false)}
              onConfirm={handleUnfriend}
              displayName={profileData?.name ?? profileData?.username}
              isPendingConfirm={isPendingFriendAction}
            />

            <LanguagesModal
              open={languagesModalOpen}
              onClose={() => setLanguagesModalOpen(false)}
              isOwnProfile={isOwnProfile}
              profileData={profileData}
              activeLanguages={activeLanguages}
            />

            {isOwnProfile && <AvatarPickerModal open={avatarPickerOpen} onClose={() => setAvatarPickerOpen(false)} />}
          </>
        )}
      </s.ProfileWrapper>
    </CardPage>
  );
}
