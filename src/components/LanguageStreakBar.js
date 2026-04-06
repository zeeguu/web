import { useContext, useEffect, useRef, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import { switchLanguage } from "../utils/languageSwitcher";
import { streakFireOrange, lightPurple } from "./colors";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import styled, { keyframes } from "styled-components";

const POLL_INTERVAL_MS = 60_000;

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
  animation: ${({ $justPracticed }) => ($justPracticed ? pulse : "none")} 0.5s ease-out;
`;

const fireIconSx = { color: streakFireOrange, fontSize: "0.9rem" };
const fireIconGraySx = { color: "var(--text-faint, #999)", fontSize: "0.9rem" };

function streaksChanged(prev, next) {
  if (prev.length !== next.length) return true;
  for (let i = 0; i < prev.length; i++) {
    if (prev[i].code !== next[i].code ||
        prev[i].daily_streak !== next[i].daily_streak ||
        prev[i].practiced_today !== next[i].practiced_today) return true;
  }
  return false;
}

export default function LanguageStreakBar({ onMultipleLanguages, onOpenModal }) {
  const api = useContext(APIContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [languageStreaks, setLanguageStreaks] = useState([]);
  const [justPracticed, setJustPracticed] = useState({});
  const prevPracticedRef = useRef({});
  const prevMultipleRef = useRef(null);
  const animationTimerRef = useRef(null);
  const onMultipleLanguagesRef = useRef(onMultipleLanguages);
  onMultipleLanguagesRef.current = onMultipleLanguages;

  useEffect(() => {
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
          clearTimeout(animationTimerRef.current);
          animationTimerRef.current = setTimeout(() => setJustPracticed({}), 600);
        }

        setLanguageStreaks((prev) => streaksChanged(prev, data) ? data : prev);

        const hasMultiple = data.length > 1;
        if (hasMultiple !== prevMultipleRef.current) {
          prevMultipleRef.current = hasMultiple;
          onMultipleLanguagesRef.current?.(hasMultiple);
        }
      });
    }

    fetchStreaks();
    let interval = setInterval(fetchStreaks, POLL_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(interval);
      } else {
        fetchStreaks();
        interval = setInterval(fetchStreaks, POLL_INTERVAL_MS);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearInterval(interval);
      clearTimeout(animationTimerRef.current);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [api, userDetails.learned_language]);

  if (languageStreaks.length <= 1) return null;

  const currentCode = userDetails.learned_language;

  const displayList = languageStreaks.filter(
    (l) => l.code === currentCode || l.daily_streak >= 2,
  );

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
            $active={isActive}
            onClick={() => isActive ? onOpenModal() : switchLanguage(api, userDetails, setUserDetails, lang.code)}
            title={lang.language}
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
