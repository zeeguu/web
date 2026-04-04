import { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import LocalStorage from "../assorted/LocalStorage";
import { saveSharedUserInfo } from "../utils/cookies/userInfo";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LanguageModal from "./MainNav/LanguageModal";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: auto;
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  overflow: hidden;
`;

const LanguageItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: ${({ $active }) => ($active ? "2px solid var(--streak-banner-text)" : "2px solid transparent")};
  border-radius: 1rem;
  padding: 0.15rem 0.4rem 0.15rem 0.2rem;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;

  opacity: ${({ $active }) => ($active ? "1" : "0.6")};

  &:hover {
    opacity: 1;
    background: var(--streak-banner-hover);
  }

  &:nth-child(n+4) {
    display: none;
  }

  @media (min-width: 400px) {
    &:nth-child(n+4) {
      display: flex;
    }
    &:nth-child(n+5) {
      display: none;
    }
  }
`;

const Flag = styled.img`
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--streak-banner-border);
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

  const currentCode = userDetails.learned_language;

  // Current language first, then others by streak descending
  const currentLang = languageStreaks.find((l) => l.code === currentCode);
  const others = languageStreaks.filter(
    (l) => l.code !== currentCode && l.daily_streak >= 2,
  );
  const displayList = [...(currentLang ? [currentLang] : []), ...others];

  if (displayList.length <= 1) return null;

  const visible = displayList.slice(0, 4);

  return (
    <>
      <Wrapper>
        <Bar>
          {visible.map((lang) => {
            const isActive = lang.code === currentCode;
            return (
              <LanguageItem
                key={lang.code}
                $active={isActive}
                onClick={() => switchLanguage(lang.code)}
                title={lang.language}
              >
                <Flag
                  $active={isActive}
                  src={`/static/flags-new/${lang.code}.svg`}
                  alt={lang.language}
                />
                {lang.daily_streak >= 2 && (
                  <>
                    <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "0.9rem" }} />
                    <StreakNumber>{lang.daily_streak}</StreakNumber>
                  </>
                )}
              </LanguageItem>
            );
          })}
        </Bar>
        <MoreButton onClick={() => setShowLanguageModal(true)} title="More languages">
          <MoreHorizIcon sx={{ fontSize: "1.2rem" }} />
        </MoreButton>
      </Wrapper>
      <LanguageModal open={showLanguageModal} setOpen={() => setShowLanguageModal(false)} />
    </>
  );
}
