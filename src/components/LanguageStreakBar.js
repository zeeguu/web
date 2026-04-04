import { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import LocalStorage from "../assorted/LocalStorage";
import { saveSharedUserInfo } from "../utils/cookies/userInfo";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LanguageModal from "./MainNav/LanguageModal";
import styled from "styled-components";

const MAX_VISIBLE = 4;

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const LanguageItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: ${({ $active }) => ($active ? "rgba(255,255,255,0.25)" : "none")};
  border: ${({ $active }) => ($active ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent")};
  border-radius: 1rem;
  padding: 0.15rem 0.5rem 0.15rem 0.2rem;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const Flag = styled.img`
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 50%;
  object-fit: cover;
  border: 0.05rem solid rgba(255, 255, 255, 0.3);
`;

const StreakNumber = styled.span`
  font-weight: 700;
  font-size: 0.85rem;
  color: inherit;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  padding: 0.15rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: inherit;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;

export default function LanguageStreakBar({ onMultipleLanguages }) {
  const api = useContext(APIContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [languageStreaks, setLanguageStreaks] = useState([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    api.getAllLanguageStreaks((data) => {
      setLanguageStreaks(data);
      if (onMultipleLanguages) {
        onMultipleLanguages(data.length > 1);
      }
    });
  }, [api, userDetails.learned_language]);

  function switchLanguage(langCode) {
    if (langCode === userDetails.learned_language) return;

    const newUserDetails = {
      ...userDetails,
      learned_language: langCode,
    };

    api.saveUserDetails(newUserDetails, () => {}, async () => {
      const freshUserDetails = await api.getUserDetails();
      setUserDetails(freshUserDetails);
      LocalStorage.setUserInfo(freshUserDetails);
      saveSharedUserInfo(freshUserDetails);
    });
  }

  if (languageStreaks.length <= 1) return null;

  const visible = languageStreaks.slice(0, MAX_VISIBLE);
  const hasMore = languageStreaks.length > MAX_VISIBLE;

  return (
    <>
      <Bar>
        {visible.map((lang) => (
          <LanguageItem
            key={lang.code}
            $active={lang.code === userDetails.learned_language}
            onClick={() => switchLanguage(lang.code)}
            title={lang.language}
          >
            <Flag src={`/static/flags-new/${lang.code}.svg`} alt={lang.language} />
            {lang.daily_streak > 0 && (
              <>
                <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "0.9rem" }} />
                <StreakNumber>{lang.daily_streak}</StreakNumber>
              </>
            )}
          </LanguageItem>
        ))}
        {hasMore && (
          <MoreButton onClick={() => setShowLanguageModal(true)} title="More languages">
            <MoreHorizIcon sx={{ fontSize: "1.2rem" }} />
          </MoreButton>
        )}
      </Bar>
      <LanguageModal open={showLanguageModal} setOpen={() => setShowLanguageModal(false)} />
    </>
  );
}
