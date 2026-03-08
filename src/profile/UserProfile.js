import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { setTitle } from "../assorted/setTitle";
import { UserContext } from "../contexts/UserContext";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext";
import DynamicFlagImage from "../components/DynamicFlagImage";
import * as s from "../components/MainNav/RadioGroup.sc";

const ProfileWrapper = styled.div`
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

  useEffect(() => {
    console.log(userDetails);
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
    </ProfileWrapper>
  );
}
