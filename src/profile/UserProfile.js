import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
import Button from "../pages/_pages_shared/Button.sc";
import Leaderboards from "../leaderboards/Leaderboards";
import { LEADERBOARD_SCOPES } from "../leaderboards/leaderboardTypes";
import useFriendActions from "../hooks/useFriendActions";
import { ProfileHeaderCard } from "./ProfileHeaderCard";
import { ProfileTabs } from "./ProfileTabs";
import { UnfriendConfirmModal } from "./UnfriendConfirmModal";
import { LanguagesModal } from "./LanguagesModal";

export default function UserProfile() {
  const api = useContext(APIContext);
  const history = useHistory();
  const [profileData, setProfileData] = useState(null);
  const { userDetails } = useContext(UserContext);
  const [activeLanguages, setActiveLanguages] = useState([]);
  const [languagesModalOpen, setLanguagesModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("badges");
  const { hasFriendRequestNotification, friendRequestCount } = useContext(FriendRequestContext);
  const { hasBadgeNotification, totalNumberOfBadges } = useContext(BadgeCounterContext);
  const { friendUsername } = useParams();
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
      api.getAllLanguageStreaksDetailed(activeLanguagesCallback);
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
        api.getAllLanguageStreaksDetailedForFriend(friendUsername, activeLanguagesCallback);
      }
    });
  };

  const resetProfileState = () => {
    setProfileData(null);
    setActiveLanguages([]);
    setActiveTab("badges");
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
      key: "badges",
      label: `Badges${isOwnProfile && hasBadgeNotification ? ` (${totalNumberOfBadges})` : ""}`,
    },
    {
      key: "friends",
      label: `Friends${isOwnProfile && hasFriendRequestNotification ? ` (${friendRequestCount})` : ""}`,
    },
    ...(isOwnProfile
      ? [
          { key: "friendLeaderboards", label: "Friend Leaderboards" },
          ...(profileData?.is_student ? [{ key: "cohortLeaderboards", label: "Classroom Leaderboards" }] : []),
        ]
      : []),
  ];

  const renderTabContent = () => {
    if (activeTab === "badges") {
      return <Badges username={friendUsername} />;
    }

    if (activeTab === "friends") {
      return <Friends friendUsername={friendUsername} navigationHandler={handleUserProfileNavigation} />;
    }

    if (activeTab === "friendLeaderboards") {
      return <Leaderboards navigationHandler={handleUserProfileNavigation} scope={LEADERBOARD_SCOPES.FRIENDS} />;
    }

    if (activeTab === "cohortLeaderboards") {
      return <Leaderboards navigationHandler={handleUserProfileNavigation} scope={LEADERBOARD_SCOPES.COHORT} />;
    }

    return null;
  };

  return (
    <s.ProfileWrapper>
      {!isOwnProfile && (
        <s.BackNavigation>
          <Button
            type={"button"}
            className={"small"}
            onClick={() => {
              handleUserProfileNavigation(null);
            }}
          >
            <ArrowBackIcon sx={{ fontSize: "1.2rem" }} />
            <span>Back to Profile</span>
          </Button>
        </s.BackNavigation>
      )}

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
            onEditProfile={() =>
              history.push({
                pathname: "/account_settings/profile_details",
                state: { from: "/profile" },
              })
            }
            friendActionHandlers={friendActionHandlers}
            isPendingFriendAction={isPendingFriendAction}
          />

          {(isOwnProfile || isFriendAccepted) && (
            <ProfileTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
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
        </>
      )}
    </s.ProfileWrapper>
  );
}
