import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import { switchLanguage } from "../utils/languageSwitcher";
import { streakFireOrange, lightPurple } from "./colors";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styled, { keyframes } from "styled-components";

const POLL_FAST_MS = 5_000;
const POLL_SLOW_MS = 60_000;
const ITEM_WIDTH_PX = 75; // approximate width of one language item
const MORE_BUTTON_PX = 30;
const BAR_GAP_PX = 6;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
`;

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
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  padding: 0.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: inherit;
  opacity: 0.6;
  flex-shrink: 0;

  &:hover {
    opacity: 1;
  }
`;

const moreIconSx = { fontSize: "1.1rem" };

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
  transition: background 0.3s, box-shadow 0.3s, opacity 0.3s;
  flex-shrink: 0;

  &:hover {
    opacity: 1;
    background: var(--streak-banner-hover);
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

function computeMaxSlots(wrapperEl) {
  if (!wrapperEl) return 4;
  const available = wrapperEl.parentElement.clientWidth - wrapperEl.offsetLeft - MORE_BUTTON_PX;
  return Math.max(2, Math.min(4, Math.floor(available / (ITEM_WIDTH_PX + BAR_GAP_PX))));
}

function pickVisible(allLangs, currentCode, maxSlots) {
  // Keep streak-descending order (from API), ensure current language has a slot
  const eligible = allLangs.filter(
    (l) => l.code === currentCode || l.daily_streak >= 1,
  );

  if (eligible.length <= maxSlots) return eligible;

  // Take top N by streak, but guarantee current language
  const top = eligible.slice(0, maxSlots);
  const currentInTop = top.find((l) => l.code === currentCode);
  if (!currentInTop) {
    const currentLang = eligible.find((l) => l.code === currentCode);
    if (currentLang) {
      top[maxSlots - 1] = currentLang; // replace last slot
    }
  }
  return top;
}

export default function LanguageStreakBar({ onMultipleLanguages, onOpenModal }) {
  const api = useContext(APIContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [languageStreaks, setLanguageStreaks] = useState([]);
  const [justPracticed, setJustPracticed] = useState({});
  const [switchingTo, setSwitchingTo] = useState(null);
  const [maxSlots, setMaxSlots] = useState(4);
  const prevPracticedRef = useRef({});
  const intervalRef = useRef(null);
  const wrapperRef = useRef(null);

  const updateSlots = useCallback(() => {
    setMaxSlots(computeMaxSlots(wrapperRef.current));
  }, []);

  useEffect(() => {
    updateSlots();
    window.addEventListener("resize", updateSlots);
    return () => window.removeEventListener("resize", updateSlots);
  }, [updateSlots]);

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

        const current = data.find((l) => l.code === userDetails.learned_language);
        if (current?.practiced_today) {
          setPollingRate(POLL_SLOW_MS);
        }

        setLanguageStreaks(data);
        if (onMultipleLanguages) {
          const currentCode = userDetails.learned_language;
          const visible = data.filter(
            (l) => l.code === currentCode || l.daily_streak >= 1,
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

  const currentCode = switchingTo || userDetails.learned_language;
  const visible = pickVisible(languageStreaks, currentCode, maxSlots);

  if (visible.length <= 1) return null;

  function handleClick(langCode) {
    if (langCode === currentCode) {
      onOpenModal();
    } else {
      setSwitchingTo(langCode);
      switchLanguage(api, userDetails, setUserDetails, langCode, () => {
        setSwitchingTo(null);
      });
    }
  }

  return (
    <Wrapper ref={wrapperRef}>
      <Bar>
        {visible.map((lang) => {
          const isActive = lang.code === currentCode;
          const practiced = lang.practiced_today;
          const animating = justPracticed[lang.code];
          return (
            <LanguageItem
              key={lang.code}
              onClick={() => handleClick(lang.code)}
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
      <MoreButton onClick={onOpenModal} title="More languages">
        <MoreHorizIcon sx={moreIconSx} />
      </MoreButton>
    </Wrapper>
  );
}
