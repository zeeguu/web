import { useContext, useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import ConfirmUnfriendModal from "./ConfirmUnfriendModal";
import { setTitle } from "../assorted/setTitle";
import { UserContext } from "../contexts/UserContext";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext";
import DynamicFlagImage from "../components/DynamicFlagImage";
import { ProgressContext } from "../contexts/ProgressContext";
import * as s from "./UserProfile.sc.js";
import FriendsTabContent from "./FriendsTabContent";
import Badges from "../badges/Badges";

function normalizeLanguageCodes(friendDetails, profile) {
  const languages =
    friendDetails?.learned_languages ??
    friendDetails?.languages ??
    profile?.learned_languages ??
    profile?.languages ??
    [];

  if (!Array.isArray(languages)) {
    return [];
  }

  return languages
    .map((language) =>
      typeof language === "string" ? language : language?.code,
    )
    .filter(Boolean);
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
  const history = useHistory();
  const { friendUserId } = useParams();
  const { userDetails } = useContext(UserContext);
  const { daysPracticed } = useContext(ProgressContext);
  const [learnedLanguages, setLearnedLanguages] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [friendDetails, setFriendDetails] = useState(null);
  const [loadingFriendDetails, setLoadingFriendDetails] = useState(false);
  const [friendDetailsError, setFriendDetailsError] = useState(null);
  const [unfriendModalOpen, setUnfriendModalOpen] = useState(false);

  const isFriendProfile = Boolean(friendUserId);

  useEffect(() => {
    setTitle(isFriendProfile ? "Friend Profile" : strings.titleUserProfile);
  }, [isFriendProfile]);

  useEffect(() => {
    if (isFriendProfile) {
      return;
    }

    api.getUserLanguages((data) => {
      if (!Array.isArray(data)) {
        setLearnedLanguages([]);
        return;
      }

      const sortedLanguages = [...data].sort((a, b) => {
        const keyA = a?.max_streak ?? 0;
        const keyB = b?.max_streak ?? 0;
        return keyA > keyB ? 1 : -1;
      });

      setLearnedLanguages(sortedLanguages);
    });
  }, [api, isFriendProfile]);

  useEffect(() => {
    if (!isFriendProfile) {
      setFriendDetails(null);
      setFriendDetailsError(null);
      setLoadingFriendDetails(false);
      return;
    }

    setLoadingFriendDetails(true);
    setFriendDetailsError(null);

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
      setLoadingFriendDetails(false);
    });
  }, [api, friendUserId, isFriendProfile]);

  const profile = isFriendProfile
    ? friendDetails?.user ?? friendDetails ?? {}
    : userDetails ?? {};

  const languageCodes = useMemo(() => {
    if (isFriendProfile) {
      return normalizeLanguageCodes(friendDetails, profile);
    }

    return learnedLanguages.map((language) => language?.code).filter(Boolean);
  }, [friendDetails, isFriendProfile, learnedLanguages, profile]);

  // Get streak value based on whether it's a friend profile or own profile
  const isFriend = Boolean(friendDetails?.friends_since);

  const streakValue = isFriendProfile
    ? friendDetails?.mutual_streak ?? "-"
    : daysPracticed ?? "-";

  const handleUnfriend = () => {
    api.unfriend(friendUserId).then((response) => {
      if (response.status === 200) {
        setUnfriendModalOpen(false);
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

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "friends", label: "Friends" },
    { key: "badges", label: "Badges" },
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
        <div style={{ marginBottom: "0.8rem" }}>
          <button
            onClick={() => {
              if (history.length > 1) {
                history.goBack();
                return;
              }

              history.push("/profile");
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              border: "1px solid #d0d0d0",
              borderRadius: "6px",
              background: "#fff",
              padding: "0.4rem 0.75rem",
              cursor: "pointer",
            }}
          >
            <ArrowBackIcon sx={{ fontSize: "1.2rem" }} />
            <span>Back to Profile</span>
          </button>
        </div>
      )}

      {showLoadingProfile && <p>Loading friend profile...</p>}
      {profileError && <p style={{ color: "red" }}>{profileError}</p>}

      {!showLoadingProfile && !profileError && (
        <>
          <s.HeaderCard>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
              <div className="avatar">
                <img src="../static/images/zeeguuLogo.svg" alt={isFriendProfile ? "Friend profile" : "Profile"} />
              </div>
              {isFriendProfile && isFriend && (
                <button
                  onClick={() => setUnfriendModalOpen(true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    border: "1px solid #e74c3c",
                    borderRadius: "6px",
                    background: "#fff",
                    color: "#e74c3c",
                    padding: "0.4rem 0.75rem",
                    cursor: "pointer",
                  }}
                >
                  <PersonRemoveIcon sx={{ fontSize: "1.2rem" }} />
                  <span>Unfriend</span>
                </button>
              )}
            </div>
            <div>
              <h2 className="username">{displayName}</h2>

              {isFriendProfile && (
                <div className="meta">
                  <span className="label">Username:</span>
                  {profile?.username ? `@${profile.username}` : "-"}
                </div>
              )}

              <div className="meta">
                <span className="label">Active languages:</span>
                {languageCodes.length > 0 ? (
                  languageCodes.map((languageCode) => (
                    <DynamicFlagImage key={languageCode} languageCode={languageCode} />
                  ))
                ) : (
                  <span>-</span>
                )}
              </div>

              <div className="meta">
                <span className="label">Member since:</span>
                {formatDate(profile?.created_at ?? friendDetails?.created_at ?? "UNKNOWN")}
              </div>

              {isFriendProfile && isFriend && (
                <div className="meta">
                  <span className="label">Friends since:</span>
                  {formatDate(friendDetails?.friends_since)}
                </div>
              )}

              {(!isFriendProfile || isFriend) && (
                <s.StatsRow>
                  <div className="stat">
                    <div className="stat-streak-wrapper">
                      <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.4rem" }} />
                      <span className="stat-value">{streakValue}</span>
                    </div>
                    <span className="stat-label">
                      {isFriendProfile ? "Mutual streak" : "Current daily streak"}
                    </span>
                  </div>
                </s.StatsRow>
              )}
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
            <s.TabContent>{renderTabContent()}</s.TabContent>
          </s.TabsSection>
        </>
      )}

      <ConfirmUnfriendModal
        open={unfriendModalOpen}
        onClose={() => setUnfriendModalOpen(false)}
        onConfirm={handleUnfriend}
        friendName={displayName}
      />
    </s.ProfileWrapper>
  );
}
