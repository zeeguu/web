import { useContext, useEffect, useRef, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import { switchLanguage } from "../utils/languageSwitcher";
import { streakFireOrange, lightPurple } from "./colors";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import styled, { keyframes } from "styled-components";

const POLL_FAST_MS = 5_000;
const POLL_SLOW_MS = 60_000;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
`;

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
  background: transparent;
  border: none;
  box-shadow: none;
  border-radius: 1rem;
  padding: 0.15rem 0.4rem 0.15rem 0.2rem;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, opacity 0.2s;
  flex-shrink: 0;

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
  animation: ${({ $justPracticed }) => ($justPracticed ? pulse : "none")} 0.5s ease-out;
`;

const fireIconSx = { color: streakFireOrange, fontSize: "0.9rem" };
const fireIconGraySx = { color: "var(--text-faint, #999)", fontSize: "0.9rem" };

export default function LanguageStreakBar({ onMultipleLanguages, onOpenModal }) {
  const api = useContext(APIContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [languageStreaks, setLanguageStreaks] = useState([]);
  const [justPracticed, setJustPracticed] = useState({});
  const prevPracticedRef = useRef({});
  const intervalRef = useRef(null);

  useEffect(() => {
    function setPollingRate(ms) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(fetchStreaks, ms);
    }

    function fetchStreaks() {
      api.getAllLanguageStreaks((data) => {
        const newJustPracticed = {};
        const prev = prevPracticedRef.current;
        data.forEach((lang) => {
          if (lang.practiced_today && prev[lang.code] === false) {
            newJustPracticed[lang.code] = true;
          }
        });

        const currentPracticed = {};
        data.forEach((lang) => { currentPracticed[lang.code] = lang.practiced_today; });
        prevPracticedRef.current = currentPracticed;

        if (Object.keys(newJustPracticed).length > 0) {
          setJustPracticed(newJustPracticed);
          setTimeout(() => setJustPracticed({}), 600);
        }

        // Slow down polling once current language is practiced
        const current = data.find((l) => l.code === userDetails.learned_language);
        if (current?.practiced_today) {
          setPollingRate(POLL_SLOW_MS);
        }

        setLanguageStreaks(data);
        if (onMultipleLanguages) {
          const currentCode = userDetails.learned_language;
          const visible = data.filter(
            (l) => l.code === currentCode || l.daily_streak >= 2,
          );
          onMultipleLanguages(visible.length > 1);
        }
      });
    }

    fetchStreaks();
    setPollingRate(POLL_FAST_MS);

    return () => clearInterval(intervalRef.current);
  }, [api, userDetails.learned_language]);

  if (languageStreaks.length <= 1) return null;

  const currentCode = userDetails.learned_language;

  // Current language first so it's never hidden by CSS, then others by streak
  const currentLang = languageStreaks.find((l) => l.code === currentCode);
  const others = languageStreaks.filter(
    (l) => l.code !== currentCode && l.daily_streak >= 2,
  );
  const displayList = [...(currentLang ? [currentLang] : []), ...others];

  if (displayList.length <= 1) return null;

  return (
    <Bar>
      {displayList.map((lang) => {
        const isActive = lang.code === currentCode;
        const practiced = lang.practiced_today;
        const animating = justPracticed[lang.code];
        return (
          <LanguageItem
            key={lang.code}
            onClick={() => isActive ? onOpenModal() : switchLanguage(api, userDetails, setUserDetails, lang.code)}
            title={lang.language}
            style={{
              opacity: isActive ? 1 : 0.7,
              background: isActive ? `${lightPurple}33` : "transparent",
              boxShadow: isActive ? `inset 0 0 0 1.5px ${lightPurple}` : "none",
            }}
          >
            <Flag
              src={`/static/flags-new/${lang.code}.svg`}
              alt={lang.language}
            />
            {(lang.daily_streak >= 1 || isActive) && (
              <>
                <LocalFireDepartmentIcon sx={practiced ? fireIconSx : fireIconGraySx} />
                <StreakNumber $practiced={practiced} $justPracticed={animating}>
                  {lang.daily_streak}
                </StreakNumber>
              </>
            )}
          </LanguageItem>
        );
      })}
    </Bar>
  );
}
