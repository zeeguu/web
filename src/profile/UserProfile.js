import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { setTitle } from "../assorted/setTitle";
import { UserContext } from "../contexts/UserContext";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext";
import DynamicFlagImage from "../components/DynamicFlagImage";
import { ProgressContext } from "../contexts/ProgressContext";
import Friends from "../friends/Friends";
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
import LoadingAnimation from "../components/LoadingAnimation";
import Button from "../pages/_pages_shared/Button.sc";
import Stack from "@mui/material/Stack";
import { FriendActionButton } from "../friends/FriendRow.sc";
import Leaderboards from "../leaderboards/Leaderboards";

export default function UserProfile() {
  const api = useContext(APIContext);
  const history = useHistory();
  const [profileData, setProfileData] = useState(null);
  const { userDetails } = useContext(UserContext);
  const { daysPracticed } = useContext(ProgressContext);
  const [activeLanguages, setActiveLanguages] = useState([]);
  const maxVisibleLanguages = 3;
  const visibleLanguages = activeLanguages.slice(0, maxVisibleLanguages);
  const overflowCount = Math.max(0, activeLanguages.length - maxVisibleLanguages);
  const [languagesModalOpen, setLanguagesModalOpen] = useState(false);
  const avatarCharacterId = validatedAvatarCharacterId(profileData?.user_avatar?.image_name);
  const avatarCharacterColor = validatedAvatarCharacterColor(profileData?.user_avatar?.character_color);
  const avatarBackgroundColor = validatedAvatarBackgroundColor(profileData?.user_avatar?.background_color);
  const [activeTab, setActiveTab] = useState("badges");
  const { friendRequestCount } = useContext(FriendRequestContext);
  const { hasBadgeNotification, totalNumberOfBadges } = useContext(BadgeCounterContext);
  const { friendUsername } = useParams();
  const [isOwnProfile, setIsOwnProfile] = useState(!friendUsername);
  const [loadingProfileDetails, setLoadingProfileDetails] = useState(true);
  const [friendDetailsError, setFriendDetailsError] = useState(null);
  const [unfriendModalOpen, setUnfriendModalOpen] = useState(false);
  const friendship = profileData?.friendship;
  const isFriendAccepted = friendship?.friend_request_status === "accepted";
  const pendingFromMe =
    friendship?.friend_request_status === "pending" && friendship?.sender_username !== friendUsername;
  const pendingFromThem =
    friendship?.friend_request_status === "pending" && friendship?.sender_username === friendUsername;
  const streakValue = (isOwnProfile ? daysPracticed : friendship?.friend_streak) ?? 0;

  const resetProfileState = () => {
    setProfileData(null);
    setActiveLanguages([]);
    setActiveTab("badges");
    setLoadingProfileDetails(true);
    setFriendDetailsError(null);
  };

  const updateProfileView = (profileData, errorMsg, title) => {
    setProfileData(profileData);
    setFriendDetailsError(errorMsg);
    setTitle(title);
  };

  const activeLanguagesCallback = (data) => {
    setLoadingProfileDetails(false);
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

  const handleUserProfileNavigation = (target) => {
    setLoadingProfileDetails(true);
    history.push(target ? `/profile/${target}` : "/profile");
  };

  useEffect(() => {
    resetProfileState();

    if (!api) return;

    if (!friendUsername) {
      setIsOwnProfile(true);
      updateProfileView(userDetails, null, strings.titleOwnProfile);
      api.getAllDailyStreakForUser(activeLanguagesCallback);
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
        api.getAllDailyStreakForFriend(friendUsername, activeLanguagesCallback);
      }
    });
  }, [api, userDetails, friendUsername]);

  const updateProfileFriendship = (newFriendship) => {
    setProfileData((prev) => ({ ...prev, friendship: newFriendship }));
  };

  const handleSendFriendRequest = () => {
    api
      .sendFriendRequest(friendUsername)
      .then((response) => {
        if (response.status === 200) {
          updateProfileFriendship({ friend_request_status: "pending", sender_username: null });
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
      .deleteFriendRequest(friendUsername)
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
      .acceptFriendRequest(friendUsername)
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
      .rejectFriendRequest(friendUsername)
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
      .unfriend(friendUsername)
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
    {
      key: "badges",
      label: `Badges${isOwnProfile && hasBadgeNotification ? ` (${totalNumberOfBadges})` : ""}`,
    },
    {
      key: "friends",
      label: `Friends${isOwnProfile && friendRequestCount > 0 ? ` (${friendRequestCount})` : ""}`,
    },
    ...(isOwnProfile ? [{ key: "leaderboards", label: "Leaderboards" }] : []),
  ];

  const renderTabContent = () => {
    if (activeTab === "badges") {
      return <Badges username={friendUsername} />;
    }

    if (activeTab === "friends") {
      return <Friends friendUsername={friendUsername} navigationHandler={handleUserProfileNavigation} />;
    }

    if (activeTab === "leaderboards") {
      return <Leaderboards navigationHandler={handleUserProfileNavigation} />;
    }

    return null;
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "—";
  };

  return (
    <s.ProfileWrapper>
      {!isOwnProfile && (
        <>
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
        </>
      )}

      {loadingProfileDetails && (
        <LoadingAnimation delay={0}>
          <p>Loading {!isOwnProfile ? "friend" : ""} profile...</p>
        </LoadingAnimation>
      )}

      {!isOwnProfile && <>{friendDetailsError && <s.ErrorText>{friendDetailsError}</s.ErrorText>}</>}

      {!loadingProfileDetails && !friendDetailsError && (
        <>
          <s.HeaderCard>
            {isOwnProfile ? (
              <s.EditProfileButton onClick={() => history.push("/account_settings/profile_details")}>
                <EditIcon sx={{ fontSize: "1rem" }} />
              </s.EditProfileButton>
            ) : (
              <s.FriendActionsContainer>
                {isFriendAccepted && (
                  <FriendActionButton $variant="cancel" onClick={() => setUnfriendModalOpen(true)}>
                    <PersonRemoveIcon sx={{ fontSize: "1rem" }} />
                    <span>Unfriend</span>
                  </FriendActionButton>
                )}
                {!isFriendAccepted && !pendingFromMe && !pendingFromThem && (
                  <FriendActionButton $variant="add" onClick={handleSendFriendRequest}>
                    <PersonAddIcon sx={{ fontSize: "1rem" }} />
                    <span>Add</span>
                  </FriendActionButton>
                )}
                {pendingFromMe && (
                  <FriendActionButton $variant="cancel" onClick={handleCancelFriendRequest}>
                    <CancelScheduleSendIcon sx={{ fontSize: "1rem" }} />
                    <span>Cancel</span>
                  </FriendActionButton>
                )}
                {pendingFromThem && (
                  <>
                    <FriendActionButton $variant="accept" onClick={handleAcceptFriendRequest}>
                      <CheckIcon sx={{ fontSize: "1rem" }} />
                      <span>Accept</span>
                    </FriendActionButton>
                    <FriendActionButton $variant="reject" onClick={handleRejectFriendRequest}>
                      <ClearIcon sx={{ fontSize: "1rem" }} />
                      <span>Reject</span>
                    </FriendActionButton>
                  </>
                )}
              </s.FriendActionsContainer>
            )}

            <s.AvatarBackground $backgroundColor={avatarBackgroundColor}>
              <s.AvatarImage $imageSource={AVATAR_IMAGE_MAP[avatarCharacterId]} $color={avatarCharacterColor} />
            </s.AvatarBackground>

            <div>
              <div className="name-wrapper">
                <h2 className="username">{profileData?.username ?? "—"}</h2>
                {profileData?.name && <h2 className="display-name">({profileData.name})</h2>}
              </div>

              <div className="meta">
                <span className="label">Active languages:</span>
                {visibleLanguages.length > 0 ? (
                  <>
                    {visibleLanguages.map((languageInfo, index) => (
                      <span
                        className="flag-image-wrapper"
                        key={`${languageInfo.language.code}-${index}`}
                        onClick={() => setLanguagesModalOpen(true)}
                      >
                        <DynamicFlagImage languageCode={languageInfo.language.code} />
                      </span>
                    ))}
                    {overflowCount > 0 && (
                      <s.LanguageOverflowBubble $isSmallSized={false} onClick={() => setLanguagesModalOpen(true)}>
                        +{overflowCount}
                      </s.LanguageOverflowBubble>
                    )}
                  </>
                ) : (
                  "—"
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
                              color: "#ff9800",
                              fontSize: "1.2rem",
                              filter:
                                "drop-shadow(2px 0 0 var(--streak-banner-border)) drop-shadow(0 2px 0 var(--streak-banner-border))",
                            }}
                          />
                          <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.2rem" }} />
                        </Stack>
                      ) : (
                        <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.2rem" }} />
                      )}
                      <span className="stat-value">{streakValue}</span>
                      <span className="stat-label">{isFriendAccepted ? "day friend streak" : "day streak"}</span>
                    </div>
                  </div>
                </s.StatsRow>
              )}
            </div>
          </s.HeaderCard>

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

          <Modal open={unfriendModalOpen} onClose={() => setUnfriendModalOpen(false)}>
            <Header>
              <Heading>Confirm Unfriend</Heading>
            </Header>
            <Main>
              <div>
                Are you sure you want to unfriend <b>{profileData?.name ?? profileData?.username}</b>?
              </div>
              <s.UnfriendModalButtonWrapper>
                <Button type={"button"} className={"small grey"} onClick={() => setUnfriendModalOpen(false)}>
                  Cancel
                </Button>
                <Button type={"button"} className={"small warning"} onClick={handleUnfriend}>
                  Unfriend
                </Button>
              </s.UnfriendModalButtonWrapper>
            </Main>
          </Modal>

          <Modal open={languagesModalOpen} onClose={() => setLanguagesModalOpen(false)}>
            <Header>
              <Heading>{isOwnProfile ? "Your" : `${profileData?.username}'s`} Languages</Heading>
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
        </>
      )}
    </s.ProfileWrapper>
  );
}
