import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import ConfirmUnfriendModal from "./ConfirmUnfriendModal";
import { setTitle } from "../assorted/setTitle";
import { UserContext } from "../contexts/UserContext";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext";
import DynamicFlagImage from "../components/DynamicFlagImage";
import { ProgressContext } from "../contexts/ProgressContext";
import FriendsTabContent from "./FriendsTabContent";
import { FriendRequestContext } from "../contexts/FriendRequestContext";
import Badges from "../badges/Badges";
import * as s from "./UserProfile.sc";
import EditIcon from "@mui/icons-material/Edit";
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
import { BadgeCounterContext } from "../badges/BadgeCounterContext";

export default function UserProfile() {
  const api = useContext(APIContext);
  const history = useHistory();
  const [profile, setProfile] = useState(null);
  const { userDetails } = useContext(UserContext);
  const { daysPracticed } = useContext(ProgressContext);
  const [activeLanguages, setActiveLanguages] = useState([]);
  const maxVisibleLanguages = 3;
  const [visibleLanguages, setVisibleLanguages] = useState([]);
  const [overflowCount, setOverflowCount] = useState(0);
  const [showLanguagesModal, setShowLanguagesModal] = useState(false);
  const [avatarCharacterId, setAvatarCharacterId] = useState(null);
  const [avatarCharacterColor, setAvatarCharacterColor] = useState(null);
  const [avatarBackgroundColor, setAvatarBackgroundColor] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { friendRequestCount } = useContext(FriendRequestContext);
  const { hasBadgeNotification, totalNumberOfBadges } = useContext(BadgeCounterContext);

  const { friendUserId } = useParams();
  const isOwnProfile = !friendUserId || String(friendUserId) === String(userDetails?.id);
  const [friendDetailsError, setFriendDetailsError] = useState(null);
  const [loadingFriendDetails, setLoadingFriendDetails] = useState(false);
  const [unfriendModalOpen, setUnfriendModalOpen] = useState(false);
  const [isFriendAccepted, setIsFriendAccepted] = useState(false);
  // If sender_id matches the friend's ID, they sent the request to us; otherwise we sent it to them
  const [pendingFromMe, setPendingFromMe] = useState(false);
  const [pendingFromThem, setPendingFromThem] = useState(false);
  // Get streak value based on whether it's a friend profile or own profile
  const [streakValue, setStreakValue] = useState(0);

  useEffect(() => {
    const setActiveLanguagesCallback = (data) => {
      if (!data) {
        setActiveLanguages([]);
        return;
      }
      const sorted = [...data].sort((a, b) => {
        const keyA = a.max_streak;
        const keyB = b.max_streak;
        return keyA > keyB ? -1 : 1;
      });
      setActiveLanguages(sorted);
    };

    if (isOwnProfile) {
      setProfile(userDetails);
      setStreakValue(daysPracticed);
      setFriendDetailsError(null);
      setLoadingFriendDetails(false);
      setTitle(strings.titleUserProfile);
      api.getAllDailyStreakForUser((data) => setActiveLanguagesCallback(data));
      return;
    }

    setLoadingFriendDetails(true);
    setFriendDetailsError(null);

    api.getFriendDetails(friendUserId, (data) => {
      if (!data) {
        setProfile({});
        setFriendDetailsError("Failed to fetch friend profile.");
        setLoadingFriendDetails(false);
        setTitle(strings.titleFriendProfile);
        return;
      }

      if (data.error) {
        setProfile({});
        setFriendDetailsError(data.error);
        setLoadingFriendDetails(false);
        setTitle(strings.titleFriendProfile);
        return;
      }

      setProfile(data);
      setStreakValue(data?.friendship?.friend_streak ?? "—");
      setLoadingFriendDetails(false);
      setTitle(`${data.username}'s ${strings.titleUserProfileDefault}`);
      api.getAllDailyStreakForFriend(friendUserId, (data) => setActiveLanguagesCallback(data));
    });
  }, [api, friendUserId, isOwnProfile, userDetails, daysPracticed]);

  useEffect(() => {
    setIsFriendAccepted(profile?.friendship?.friend_request_status === "accepted");
    setPendingFromMe(
      profile?.friendship?.friend_request_status === "pending" &&
        Number(profile?.friendship?.sender_id) !== Number(friendUserId),
    );
    setPendingFromThem(
      profile?.friendship?.friend_request_status === "pending" &&
        Number(profile?.friendship?.sender_id) === Number(friendUserId),
    );
  }, [profile]);

  useEffect(() => {
    setVisibleLanguages(activeLanguages.slice(0, maxVisibleLanguages));
    setOverflowCount(activeLanguages.length > maxVisibleLanguages ? activeLanguages.length - maxVisibleLanguages : 0);
  }, [activeLanguages]);

  useEffect(() => {
    setAvatarCharacterId(validatedAvatarCharacterId(profile?.user_avatar?.image_name));
    setAvatarCharacterColor(validatedAvatarCharacterColor(profile?.user_avatar?.character_color));
    setAvatarBackgroundColor(validatedAvatarBackgroundColor(profile?.user_avatar?.background_color));
  }, [profile]);

  const updateProfileFriendship = (newFriendship) => {
    setProfile((prev) => ({ ...prev, friendship: newFriendship }));
  };

  const handleSendFriendRequest = () => {
    api
      .sendFriendRequest(friendUserId)
      .then((response) => {
        if (response.status === 200) {
          updateProfileFriendship({ friend_request_status: "pending", sender_id: null });
        } else {
          response.json().then((json) => {
            setFriendDetailsError(json.error || "Failed to send friend request.");
          });
        }
      })
      .catch(() => {
        setFriendDetailsError("Failed to send friend request.");
      });
  };

  const handleCancelFriendRequest = () => {
    api
      .deleteFriendRequest(friendUserId)
      .then((response) => {
        if (response.status === 200) {
          updateProfileFriendship(null);
        } else {
          response.json().then((json) => {
            setFriendDetailsError(json.message || "Failed to cancel friend request.");
          });
        }
      })
      .catch(() => {
        setFriendDetailsError("Failed to cancel friend request.");
      });
  };

  const handleAcceptFriendRequest = () => {
    api
      .acceptFriendRequest(friendUserId)
      .then((response) => {
        if (response.status === 200) {
          updateProfileFriendship({ friend_request_status: "accepted" });
        } else {
          response.json().then((json) => {
            setFriendDetailsError(json.message || "Failed to accept friend request.");
          });
        }
      })
      .catch(() => {
        setFriendDetailsError("Failed to accept friend request.");
      });
  };

  const handleRejectFriendRequest = () => {
    api
      .rejectFriendRequest(friendUserId)
      .then((response) => {
        if (response.status === 200) {
          updateProfileFriendship(null);
        } else {
          response.json().then((json) => {
            setFriendDetailsError(json.message || "Failed to reject friend request.");
          });
        }
      })
      .catch(() => {
        setFriendDetailsError("Failed to reject friend request.");
      });
  };

  const handleUnfriend = () => {
    api
      .unfriend(friendUserId)
      .then((response) => {
        if (response.status === 200) {
          setUnfriendModalOpen(false);
          updateProfileFriendship(null);
        } else {
          response.json().then((json) => {
            setFriendDetailsError(json.message || "Failed to unfriend user.");
          });
        }
      })
      .catch(() => {
        setFriendDetailsError("Failed to unfriend user.");
      });
  };

  const tabs = [
    { key: "overview", label: "Overview" },
    {
      key: "friends",
      label: `Friends${friendRequestCount > 0 && !!isOwnProfile ? ` (${friendRequestCount})` : ""}`,
    },
    {
      key: "badges",
      label: `Badges${hasBadgeNotification && !!isOwnProfile ? ` (${totalNumberOfBadges})` : ""}`,
    },
  ];

  const renderTabContent = () => {
    if (activeTab === "overview") {
      return !isOwnProfile ? (
        <div>Overview content for this friend goes here.</div>
      ) : (
        <div>Overview content goes here.</div>
      );
    }

    if (activeTab === "friends") {
      return <FriendsTabContent friendUserId={friendUserId} />;
    }

    if (activeTab === "badges") {
      return <Badges userId={friendUserId} />;
    }

    return null;
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "—";
  };

  return (
    <s.ProfileWrapper>
      {!isOwnProfile && (
        <s.BackNavigation>
          <s.BackButton
            onClick={() => {
              history.push("/profile");
            }}
          >
            <ArrowBackIcon sx={{ fontSize: "1.2rem" }} />
            <span>Back to Profile</span>
          </s.BackButton>
        </s.BackNavigation>
      )}

      {!isOwnProfile && loadingFriendDetails && <p>Loading friend profile...</p>}
      {!isOwnProfile && friendDetailsError && <s.ErrorText>{friendDetailsError}</s.ErrorText>}

      {(isOwnProfile || (!loadingFriendDetails && !friendDetailsError)) && (
        <s.HeaderCard>
          {isOwnProfile ? (
            <s.EditProfileButton onClick={() => history.push("/account_settings/profile_details")}>
              <EditIcon sx={{ fontSize: "1rem" }} />
            </s.EditProfileButton>
          ) : (
            <s.FriendActionsContainer>
              {isFriendAccepted && (
                <s.FriendActionButton $variant="danger" onClick={() => setUnfriendModalOpen(true)}>
                  <PersonRemoveIcon sx={{ fontSize: "1.2rem" }} />
                  <span>Unfriend</span>
                </s.FriendActionButton>
              )}
              {!isFriendAccepted && !pendingFromMe && !pendingFromThem && (
                <s.FriendActionButton $variant="primary" onClick={handleSendFriendRequest}>
                  <PersonAddIcon sx={{ fontSize: "1.2rem" }} />
                  <span>Add friend</span>
                </s.FriendActionButton>
              )}
              {pendingFromMe && (
                <s.FriendActionButton $variant="warning" onClick={handleCancelFriendRequest}>
                  <CancelScheduleSendIcon sx={{ fontSize: "1.2rem" }} />
                  <span>Cancel request</span>
                </s.FriendActionButton>
              )}
              {pendingFromThem && (
                <>
                  <s.FriendActionButton $variant="success" onClick={handleAcceptFriendRequest}>
                    <CheckIcon sx={{ fontSize: "1.2rem" }} />
                    <span>Accept request</span>
                  </s.FriendActionButton>
                  <s.FriendActionButton $variant="danger" onClick={handleRejectFriendRequest}>
                    <ClearIcon sx={{ fontSize: "1.2rem" }} />
                    <span>Reject request</span>
                  </s.FriendActionButton>
                </>
              )}
            </s.FriendActionsContainer>
          )}

          <s.AvatarBackground $backgroundColor={avatarBackgroundColor}>
            <s.AvatarImage $imageSource={AVATAR_IMAGE_MAP[avatarCharacterId]} $color={avatarCharacterColor} />
          </s.AvatarBackground>

          <div>
            <div className="name-wrapper">
              <h2 className="username">{profile?.username || "-"}</h2>
              {profile?.name && <h2 className="display-name">({profile.name})</h2>}
            </div>

            <div className="meta">
              <span className="label">Active languages:</span>
              {visibleLanguages.length > 0 ? (
                <>
                  {visibleLanguages.map((languageInfo, index) => (
                    <span
                      className="flag-image-wrapper"
                      key={`${languageInfo.language.code}-${index}`}
                      onClick={() => setShowLanguagesModal(true)}
                    >
                      <DynamicFlagImage languageCode={languageInfo.language.code} />
                    </span>
                  ))}
                  {overflowCount > 0 && (
                    <s.OverflowBubble onClick={() => setShowLanguagesModal(true)}>
                      +{overflowCount}
                    </s.OverflowBubble>
                  )}
                </>
              ) : (
                "—"
              )}
            </div>

            <div className="meta">
              <span className="label">Member since:</span>
              {formatDate(profile?.created_at)}
            </div>

            {isFriendAccepted && (
              <div className="meta">
                <span className="label">Friends since:</span>
                {formatDate(profile?.friendship?.created_at)}
              </div>
            )}

            {(isOwnProfile || isFriendAccepted) && (
              <s.StatsRow>
                <div className="stat">
                  <div className="stat-streak-wrapper">
                    <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.2rem" }} />
                    <span className="stat-value">{streakValue}</span>
                  </div>
                  {isFriendAccepted && <span className="stat-label">Mutual streak</span>}
                </div>
              </s.StatsRow>
            )}
          </div>
        </s.HeaderCard>
      )}

      {(isOwnProfile || isFriendAccepted) && (
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
          <s.TabContent>{renderTabContent()}</s.TabContent>
        </s.TabsSection>
      )}

      <ConfirmUnfriendModal
        open={unfriendModalOpen}
        onClose={() => setUnfriendModalOpen(false)}
        onConfirm={handleUnfriend}
        friendName={profile?.name || profile?.username}
      />

      <Modal open={showLanguagesModal} onClose={() => setShowLanguagesModal(false)}>
        <Header>
          <Heading>{isOwnProfile ? "Your" : `${profile?.username}'s`} Languages</Heading>
        </Header>
        <Main>
          <s.LanguagesGrid>
            {activeLanguages.map((languageInfo) => (
              <s.LanguageCard key={languageInfo.language.code}>
                <DynamicFlagImage languageCode={languageInfo.language.code} />
                <span className="language-name">{languageInfo.language.language}</span>
                {(isOwnProfile || isFriendAccepted) && (
                  <div className="streaks-info">
                    <div className="streak-item">
                      <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1rem" }} />
                      <span>{languageInfo.current_streak ?? 0}</span>
                    </div>
                    <div className="streak-item max-streak">
                      <LocalFireDepartmentIcon sx={{ color: "#e65100", fontSize: "1rem" }} />
                      <span>{languageInfo.max_streak ?? 0}</span>
                    </div>
                  </div>
                )}
              </s.LanguageCard>
            ))}
          </s.LanguagesGrid>
        </Main>
      </Modal>
    </s.ProfileWrapper>
  );
}
