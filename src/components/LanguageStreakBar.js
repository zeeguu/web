import { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import { switchLanguage } from "../utils/languageSwitcher";
import { streakFireOrange, lightPurple } from "./colors";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import styled from "styled-components";

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  overflow: hidden;
  margin-left: auto;
`;

const LanguageItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: ${({ $active }) => ($active ? `${lightPurple}33` : "none")};
  border: ${({ $active }) => ($active ? `1.5px solid ${lightPurple}` : "1.5px solid transparent")};
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

  @media (min-width: 500px) {
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
  color: ${({ $practiced }) => ($practiced ? "var(--streak-banner-text)" : "var(--text-faint, #999)")};
  ${({ $practiced }) => $practiced && `
    animation: streakPulse 0.4s ease-out;
  `}

  @keyframes streakPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
`;

const fireIconSx = { color: streakFireOrange, fontSize: "0.9rem" };
const fireIconGraySx = { color: "var(--text-faint, #999)", fontSize: "0.9rem" };

export default function LanguageStreakBar({ onMultipleLanguages, onOpenModal }) {
  const api = useContext(APIContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [languageStreaks, setLanguageStreaks] = useState([]);

  useEffect(() => {
    let cancelled = false;
    api.getAllLanguageStreaks((data) => {
      if (cancelled) return;
      setLanguageStreaks(data);
      if (onMultipleLanguages) {
        onMultipleLanguages(data.length > 1);
      }
    });
    return () => { cancelled = true; };
  }, [api, userDetails.learned_language]);

  if (languageStreaks.length <= 1) return null;

  const currentCode = userDetails.learned_language;

  // Keep API order (by streak descending), always include current language
  const displayList = languageStreaks.filter(
    (l) => l.code === currentCode || l.daily_streak >= 2,
  );

  if (displayList.length <= 1) return null;

  return (
    <Bar>
      {displayList.map((lang) => {
        const isActive = lang.code === currentCode;
        const practiced = lang.practiced_today;
        return (
          <LanguageItem
            key={lang.code}
            $active={isActive}
            onClick={() => isActive ? onOpenModal() : switchLanguage(api, userDetails, setUserDetails, lang.code)}
            title={lang.language}
          >
            <Flag
              src={`/static/flags-new/${lang.code}.svg`}
              alt={lang.language}
            />
            {lang.daily_streak >= 2 && (
              <>
                <LocalFireDepartmentIcon sx={practiced ? fireIconSx : fireIconGraySx} />
                <StreakNumber $practiced={practiced}>{lang.daily_streak}</StreakNumber>
              </>
            )}
          </LanguageItem>
        );
      })}
    </Bar>
  );
}
