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

function normalizeLanguageCode(code) {
  if (typeof code !== "string") {
    return null;
  }

  const normalized = code.trim().toLowerCase();
  return normalized || null;
}

function normalizeProfileLanguages(friendDetails, profile, explicitLanguages = null) {
  const languages =
    explicitLanguages ??
    friendDetails?.learned_languages ??
    friendDetails?.languages ??
    friendDetails?.user?.learned_languages ??
    friendDetails?.user?.languages ??
    profile?.learned_languages ??
    profile?.languages ??
    [];

  if (!Array.isArray(languages)) {
    return [];
  }

  const normalized = languages
    .map((language) => {
      if (!language) {
        return null;
      }

      if (typeof language === "string") {
        const code = normalizeLanguageCode(language);
        return code ? { code, language } : null;
      }

      const code = normalizeLanguageCode(
        language?.language?.code ?? language.code ?? language.language_code,
      );

      if (!code) {
        return null;
      }

      return {
        code,
        language:
          language?.language?.language ??
          language?.language?.name ??
          language.language_name ??
          language.language ??
          language.name ??
          code,
      };
    })
    .filter(Boolean);

  if (normalized.length > 0) {
    // Keep language chips stable by de-duplicating repeated codes from mixed API payloads.
    const seenCodes = new Set();
    return normalized.filter((language) => {
      if (seenCodes.has(language.code)) {
        return false;
      }

      seenCodes.add(language.code);
      return true;
    });
  }

  const singleLanguageCode =
    normalizeLanguageCode(friendDetails?.learned_language) ??
    normalizeLanguageCode(friendDetails?.learned_language_code) ??
    normalizeLanguageCode(friendDetails?.user?.learned_language) ??
    normalizeLanguageCode(friendDetails?.user?.learned_language_code) ??
    normalizeLanguageCode(profile?.learned_language) ??
    normalizeLanguageCode(profile?.learned_language_code);

  return singleLanguageCode ? [{ code: singleLanguageCode, language: singleLanguageCode }] : [];
}

function resolveLanguageCode(languageEntry) {
  return languageEntry?.language?.code ?? languageEntry?.code ?? languageEntry?.language_code ?? null;
}

function resolveLanguageName(languageEntry) {
  return (
    languageEntry?.language?.language ??
    languageEntry?.language?.name ??
    languageEntry?.name ??
    languageEntry?.language ??
    languageEntry?.code ??
    "Unknown"
  );
}

function formatDate(dateString) {
  if (!dateString) {
    return "-";
  }

  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString();
}

export default function UserProfile() {
  const api = useContext(APIContext);
  const { friendRequestCount } = useContext(FriendRequestContext);
  const history = useHistory();
  const { friendUserId } = useParams();
  const { userDetails } = useContext(UserContext);
  const { daysPracticed } = useContext(ProgressContext);
  //const [learnedLanguages, setLearnedLanguages] = useState([]);
  const [friendDetails, setFriendDetails] = useState(null);
  const [loadingFriendDetails, setLoadingFriendDetails] = useState(false);
  const [friendDetailsError, setFriendDetailsError] = useState(null);
  const [friendLanguages, setFriendLanguages] = useState([]);
  const [unfriendModalOpen, setUnfriendModalOpen] = useState(false);
  // localFriendship mirrors friendDetails.friendship and is updated optimistically after mutations
  const [localFriendship, setLocalFriendship] = useState(null);

  const isFriendProfile = Boolean(friendUserId);

  useEffect(() => {
    setTitle(isFriendProfile ? "Friend Profile" : strings.titleUserProfile);
  }, [isFriendProfile]);

  const [allDailyStreakInfo, setAllDailyStreakInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showLanguagesModal, setShowLanguagesModal] = useState(false);
  const { hasBadgeNotification, totalNumberOfBadges } = useContext(BadgeCounterContext);

  useEffect(() => {
    if (isFriendProfile) {
      return;
    }

    api.getUserLanguages((data) => {
      if (!Array.isArray(data)) {
        //setLearnedLanguages([]);
        return;
      }

      //const sortedLanguages = [...data].sort((a, b) => {
      //  const keyA = a?.max_streak ?? 0;
      //  const keyB = b?.max_streak ?? 0;
      //  return keyA > keyB ? 1 : -1;
      //});

      //setLearnedLanguages(sortedLanguages);
    });
  }, [api, isFriendProfile]);

  useEffect(() => {
    if (!isFriendProfile) {
      setFriendDetails(null);
      setFriendDetailsError(null);
      setLoadingFriendDetails(false);
      setFriendLanguages([]);
      return;
    }

    setLoadingFriendDetails(true);
    setFriendDetailsError(null);
    setFriendLanguages([]);

    api.getFriendDetails(friendUserId, (data) => {
      if (!data) {
        setFriendDetailsError("Failed to fetch friend profile.");
        setLoadingFriendDetails(false);
        return;
      }

      if (data.error) {
        setFriendDetailsError(data.error);
        setLoadingFriendDetails(false);
        return;
      }

      setFriendDetails(data);
      setLocalFriendship(data?.friendship ?? null);
      setLoadingFriendDetails(false);
    });

  }, [api, friendUserId, isFriendProfile]);

  const profile = isFriendProfile
    ? friendDetails?.user ?? friendDetails ?? {}
    : userDetails ?? {};

  const avatarCharacterId = validatedAvatarCharacterId(profile?.user_avatar?.image_name);
  const avatarCharacterColor = validatedAvatarCharacterColor(profile?.user_avatar?.character_color);
  const avatarBackgroundColor = validatedAvatarBackgroundColor(profile?.user_avatar?.background_color);

  const maxVisibleLanguages = 3;
  const ownProfileLanguages = Array.isArray(allDailyStreakInfo) ? allDailyStreakInfo : [];
  const friendProfileLanguages = isFriendProfile
    ? normalizeProfileLanguages(
      friendDetails,
      profile,
      friendLanguages.length > 0 ? friendLanguages : null,
    )
    : [];
  const profileLanguages = isFriendProfile ? friendProfileLanguages : ownProfileLanguages;
  const visibleLanguages = profileLanguages.slice(0, maxVisibleLanguages);
  const overflowCount =
    profileLanguages.length > maxVisibleLanguages
      ? profileLanguages.length - maxVisibleLanguages
      : 0;

  // Get streak value based on whether it's a friend profile or own profile
  const isFriend = localFriendship?.friend_request_status === "accepted";
  // If sender_id matches the friend's ID, they sent the request to us; otherwise we sent it to them
  const pendingFromMe = localFriendship?.friend_request_status === "pending" && Number(localFriendship?.sender_id) !== Number(friendUserId);
  const pendingFromThem = localFriendship?.friend_request_status === "pending" && Number(localFriendship?.sender_id) === Number(friendUserId);

  const streakValue = isFriendProfile
    ? localFriendship?.friend_streak ?? "-"
    : daysPracticed ?? "-";

  const handleSendFriendRequest = () => {
    api.sendFriendRequest(friendUserId).then((response) => {  
      if (response.status === 200) {
        setLocalFriendship({ friend_request_status: "pending", sender_id: null });
      } else {
        response.json().then((json) => {
          setFriendDetailsError(json.error || "Failed to send friend request.");
        });
      }
    }).catch(() => {
      setFriendDetailsError("Failed to send friend request.");
    });
  };

  const handleCancelFriendRequest = () => {
    api.deleteFriendRequest(friendUserId).then((response) => {
      if (response.status === 200) {
        setLocalFriendship(null);
      } else {
        response.json().then((json) => {
          setFriendDetailsError(json.message || "Failed to cancel friend request.");
        });
      }
    }).catch(() => {
      setFriendDetailsError("Failed to cancel friend request.");
    });
  };

  const handleAcceptFriendRequest = () => {
    api.acceptFriendRequest(friendUserId).then((response) => {
      if (response.status === 200) {
        setLocalFriendship({ friend_request_status: "accepted" });
      } else {
        response.json().then((json) => {
          setFriendDetailsError(json.message || "Failed to accept friend request.");
        });
      }
    }).catch(() => {
      setFriendDetailsError("Failed to accept friend request.");
    });
  };

  const handleRejectFriendRequest = () => {
    api.rejectFriendRequest(friendUserId).then((response) => {
      if (response.status === 200) {
        setLocalFriendship(null);
      } else {
        response.json().then((json) => {
          setFriendDetailsError(json.message || "Failed to reject friend request.");
        });
      }
    }).catch(() => {
      setFriendDetailsError("Failed to reject friend request.");
    });
  };

  const handleUnfriend = () => {
    api.unfriend(friendUserId).then((response) => {
      if (response.status === 200) {
        setUnfriendModalOpen(false);
        setLocalFriendship(null);
      } else {
        response.json().then((json) => {
          setFriendDetailsError(json.message || "Failed to unfriend user.");
        });
      }
    }).catch(() => {
      setFriendDetailsError("Failed to unfriend user.");
    });
  };

  const showLoadingProfile = isFriendProfile && loadingFriendDetails;
  const profileError = isFriendProfile ? friendDetailsError : null;
  const displayName = profile?.name || profile?.username || "-";

  useEffect(() => {
    if (isFriendProfile) {
      setAllDailyStreakInfo([]);
      return;
    }

    api.getAllDailyStreak((data) => {
      if (!Array.isArray(data)) {
        setAllDailyStreakInfo([]);
        return;
      }

      const sorted = [...data].sort((a, b) => {
        const keyA = a.max_streak;
        const keyB = b.max_streak;
        return keyA > keyB ? -1 : 1;
      });

      setAllDailyStreakInfo(sorted);
    });
  }, [api, isFriendProfile]);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "friends", label: friendRequestCount > 0 ? `Friends (${friendRequestCount})` : "Friends" },
    {
      key: "badges",
      label: `Badges${hasBadgeNotification ? ` (${totalNumberOfBadges})` : ""}`,
    },
  ];

  const renderTabContent = () => {
    if (activeTab === "overview") {
      return isFriendProfile
        ? <div>Overview content for this friend goes here.</div>
        : <div>Overview content goes here.</div>;
    }

    if (activeTab === "friends") {
      return <FriendsTabContent friendUserId={friendUserId} />;
    }

    if (activeTab === "badges") {
      return <Badges userId={friendUserId} />;
    }

    return null;
  };

  return (
    <s.ProfileWrapper>
      {isFriendProfile && (
        <s.BackNavigation>
          <s.BackButton
            onClick={() => {
              if (history.length > 1) {
                history.goBack();
                return;
              }

              history.push("/profile");
            }}
          >
            <ArrowBackIcon sx={{ fontSize: "1.2rem" }} />
            <span>Back to Profile</span>
          </s.BackButton>
        </s.BackNavigation>
      )}

      {showLoadingProfile && <p>Loading friend profile...</p>}
      {profileError && <s.ErrorText>{profileError}</s.ErrorText>}

      {!showLoadingProfile && !profileError && (
        <>
          {isFriendProfile ? (
            <s.HeaderCard>
              <s.FriendActionsContainer>
                {isFriend && (
                  <s.FriendActionButton
                    $variant="danger"
                    onClick={() => setUnfriendModalOpen(true)}
                  >
                    <PersonRemoveIcon sx={{ fontSize: "1.2rem" }} />
                    <span>Unfriend</span>
                  </s.FriendActionButton>
                )}
                {!isFriend && !pendingFromMe && !pendingFromThem && (
                  <s.FriendActionButton
                    $variant="primary"
                    onClick={handleSendFriendRequest}
                  >
                    <PersonAddIcon sx={{ fontSize: "1.2rem" }} />
                    <span>Add friend</span>
                  </s.FriendActionButton>
                )}
                {pendingFromMe && (
                  <s.FriendActionButton
                    $variant="warning"
                    onClick={handleCancelFriendRequest}
                  >
                    <CancelScheduleSendIcon sx={{ fontSize: "1.2rem" }} />
                    <span>Cancel request</span>
                  </s.FriendActionButton>
                )}
                {pendingFromThem && (
                  <>
                    <s.FriendActionButton
                      $variant="success"
                      onClick={handleAcceptFriendRequest}
                    >
                      <CheckIcon sx={{ fontSize: "1.2rem" }} />
                      <span>Accept request</span>
                    </s.FriendActionButton>
                    <s.FriendActionButton
                      $variant="danger"
                      onClick={handleRejectFriendRequest}
                    >
                      <ClearIcon sx={{ fontSize: "1.2rem" }} />
                      <span>Reject request</span>
                    </s.FriendActionButton>
                  </>
                )}
              </s.FriendActionsContainer>
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
                  {visibleLanguages.map((language, index) => {
                    const languageCode = resolveLanguageCode(language);

                    if (!languageCode) {
                      return null;
                    }

                    return (
                      <DynamicFlagImage
                        key={`${languageCode}-${index}`}
                        languageCode={languageCode}
                      />
                    );
                  })}
                  {overflowCount > 0 && (
                    <s.OverflowBubble onClick={() => setShowLanguagesModal(true)}>+{overflowCount}</s.OverflowBubble>
                  )}
                  {visibleLanguages.length === 0 && "-"}
                </div>

                <div className="meta">
                  <span className="label">Member since:</span>
                  {formatDate(profile?.created_at ?? friendDetails?.created_at ?? "UNKNOWN")}
                </div>

                {isFriend && (
                  <div className="meta">
                    <span className="label">Friends since:</span>
                    {formatDate(localFriendship?.created_at)}
                  </div>
                )}

                {isFriend && (
                  <s.StatsRow>
                    <div className="stat">
                      <div className="stat-streak-wrapper">
                        <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.4rem" }} />
                        <span className="stat-value">{streakValue}</span>
                      </div>
                      <span className="stat-label">Mutual streak</span>
                    </div>
                  </s.StatsRow>
                )}
              </div>
            </s.HeaderCard>
          ) : (
            <s.HeaderCard>
              <s.EditProfileButton onClick={() => history.push("/account_settings/profile_details")}>
                <EditIcon sx={{ fontSize: "1rem" }} />
              </s.EditProfileButton>
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
                  {visibleLanguages.map((streakInfo, index) => {
                    const languageCode = resolveLanguageCode(streakInfo);

                    if (!languageCode) {
                      return null;
                    }

                    return <DynamicFlagImage key={`${languageCode}-${index}`} languageCode={languageCode} />;
                  })}
                  {overflowCount > 0 && (
                    <s.OverflowBubble onClick={() => setShowLanguagesModal(true)}>+{overflowCount}</s.OverflowBubble>
                  )}
                  {visibleLanguages.length === 0 && "-"}
                </div>

                <div className="meta">
                  <span className="label">Member since:</span>
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"}
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
          )}

          {(!isFriendProfile || isFriend) && (
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
        </>
      )}

      <ConfirmUnfriendModal
        open={unfriendModalOpen}
        onClose={() => setUnfriendModalOpen(false)}
        onConfirm={handleUnfriend}
        friendName={displayName}
      />

      <Modal open={showLanguagesModal} onClose={() => setShowLanguagesModal(false)}>
        <Header>
          <Heading>Active Languages</Heading>
        </Header>
        <Main>
          {isFriendProfile ? (
            <s.LanguagesGrid>
              {profileLanguages.map((language, index) => {
                const languageCode = resolveLanguageCode(language);
                const languageName = resolveLanguageName(language);

                return (
                  <s.LanguageCard key={`${languageCode ?? languageName}-${index}`}>
                    {languageCode && <DynamicFlagImage languageCode={languageCode} />}
                    <span className="language-name">{languageName}</span>
                  </s.LanguageCard>
                );
              })}
            </s.LanguagesGrid>
          ) : (
            <s.LanguagesGrid>
              {profileLanguages.map((streakInfo) => (
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
          )}
        </Main>
      </Modal>
    </s.ProfileWrapper>
  );
}
