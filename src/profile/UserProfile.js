import { useContext, useEffect, useState } from "react";
import { setTitle } from "../assorted/setTitle";
import { UserContext } from "../contexts/UserContext";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext";
import DynamicFlagImage from "../components/DynamicFlagImage";
import { ProgressContext } from "../contexts/ProgressContext";
import * as s from "./UserProfile.sc.js";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

export default function UserProfile() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const { daysPracticed } = useContext(ProgressContext);
  const [learnedLanguages, setLearnedLanguages] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    console.log(userDetails);
  }, [userDetails]);

  useEffect(() => {
    console.log(daysPracticed);
  }, [daysPracticed]);

  useEffect(() => {
    setTitle(strings.titleUserProfile);
  }, []);

  useEffect(() => {
    api.getUserLanguages((data) => {
      data.sort(function(a, b) {
        const keyA = a.max_streak;
        const keyB = b.max_streak;
        console.log(keyA);
        console.log(keyB);
        return keyA > keyB ? 1 : -1;
      });
      setLearnedLanguages(data);
      console.log(data);
    });
  }, [api]);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "friends", label: "Friends" },
    { key: "badges", label: "Badges" },
  ];

  return (
    <s.ProfileWrapper>
      <s.HeaderCard>
        <div className="avatar">
          <img src="../static/images/zeeguuLogo.svg" alt="Profile" />
        </div>
        <div>
          <h2 className="username">{userDetails.name}</h2>

          <div className="meta">
            <span className="label">Active languages:</span>
            {learnedLanguages?.map((lang) => (
              <DynamicFlagImage key={lang.code} languageCode={lang.code} />
            ))}
          </div>

          <div className="meta">
            <span className="label">Member since:</span>
            {userDetails.created_at ? new Date(userDetails.created_at).toLocaleDateString() : "-"}
          </div>

          <s.StatsRow>
            <div className="stat">
              <div className="stat-streak-wrapper">
                <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.4rem" }} />
                <span className="stat-value">{daysPracticed ?? "-"}</span>
              </div>
              <span className="stat-label">Current daily streak</span>
            </div>
          </s.StatsRow>
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
        <s.TabContent>
          {activeTab === "overview" && <div>Overview content goes here.</div>}
          {activeTab === "friends" && <div>Friends content goes here.</div>}
          {activeTab === "badges" && <div>Badges content goes here.</div>}
        </s.TabContent>
      </s.TabsSection>
    </s.ProfileWrapper>
  );
}
