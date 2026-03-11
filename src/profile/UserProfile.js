import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { setTitle } from "../assorted/setTitle";
import { UserContext } from "../contexts/UserContext";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext";
import DynamicFlagImage from "../components/DynamicFlagImage";
import * as s from "../components/MainNav/RadioGroup.sc";

const ProfileWrapper = styled.div`
    .profile-tabs-section {
      margin-top: 2em;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      padding: 1.2em;
    }
    .profile-tabs-bar {
      display: flex;
      gap: 1em;
      margin-bottom: 1em;
    }
    .profile-tab-btn {
      padding: 0.5em 1.2em;
      font-size: 1em;
      border: none;
      border-radius: 16px 16px 0 0;
      background: #e3eafc;
      color: #1976d2;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s, color 0.2s;
    }
    .profile-tab-btn.active {
      background: #1976d2;
      color: #fff;
    }
    .profile-tab-content {
      min-height: 120px;
      padding: 1em 0 0 0;
    }
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: 1em;

  .profile-header-card {
    background: white;
    border-radius: 8px;
    padding: 1.2em;
    margin-bottom: 1.5em;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    gap: 1.5em;
    position: relative;
  }

  .edit-btn-wrapper {
    position: absolute;
    top: 1em;
    right: 1em;
  }

  .edit-btn {
    padding: 0.6em 1.2em;
    font-size: 1.1em;
    border-radius: 24px;
    border: none;
    background: #1976d2;
    color: #fff;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.15);
    transition: background 0.2s, box-shadow 0.2s;
  }
  .edit-btn:hover {
    background: #1565c0;
    box-shadow: 0 4px 16px rgba(25, 118, 210, 0.25);
  }

  .profile-img-wrapper {
    min-width: 8rem;
    min-height: 8rem;
  }

  .profile-img {
    width: 100%;
    height: auto;
  }

  .profile-info {
    flex: 1;
  }
`;

export default function UserProfile() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const [learnedLanguages, setLearnedLanguages] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userDetails?.name || "");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    console.log(userDetails);
    setEditedName(userDetails?.name || "");
  }, [userDetails]);

  useEffect(() => {
    setTitle(strings.titleUserProfile);
  }, []);

  useEffect(() => {
    api.getUserLanguages((data) => {
      setLearnedLanguages(data);
      console.log(data);
    });
  }, [api]);

  return (
    <ProfileWrapper>
      <div className="profile-header-card">
        <div className="edit-btn-wrapper">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editedName}
                onChange={e => setEditedName(e.target.value)}
                style={{ marginBottom: "0.5em", fontSize: "1em", padding: "0.4em 1em", borderRadius: "8px", border: "1px solid #ccc" }}
              />
              <button className="edit-btn" onClick={() => setIsEditing(false)} style={{ marginRight: "0.5em" }}>Save</button>
              <button className="edit-btn" onClick={() => setIsEditing(false)} style={{ background: "#eee", color: "#333" }}>Cancel</button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
          )}
        </div>
        <div className="profile-img-wrapper">
          <img className="profile-img" src="../static/images/zeeguuLogo.svg" alt="ProfileIcon" />
        </div>
        <div className="profile-info">
          <div>{userDetails.name}</div>
          <div>Languages: </div>
          {learnedLanguages?.map((language) => (
            <DynamicFlagImage key={`user-profile-lang-${language.code}`} languageCode={language.code} />
          ))}
          <div>Member since: </div>
          <div>Highest streak: </div>
        </div>
      </div>
      <div className="profile-tabs-section">
        <div className="profile-tabs-bar">
          <button
            className={`profile-tab-btn${activeTab === "overview" ? " active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >Overview</button>
          <button
            className={`profile-tab-btn${activeTab === "friends" ? " active" : ""}`}
            onClick={() => setActiveTab("friends")}
          >Friends</button>
          <button
            className={`profile-tab-btn${activeTab === "badges" ? " active" : ""}`}
            onClick={() => setActiveTab("badges")}
          >Badges</button>
        </div>
        <div className="profile-tab-content">
          {activeTab === "overview" && <div>Overview content goes here.</div>}
          {activeTab === "friends" && <div>Friends content goes here.</div>}
          {activeTab === "badges" && <div>Badges content goes here.</div>}
        </div>
      </div>
    </ProfileWrapper>
  );
}
