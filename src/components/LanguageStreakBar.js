import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import useGuardedLanguageSwitch from "../hooks/useGuardedLanguageSwitch";
import { streakFireOrange, lightPurple } from "./colors";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CircularProgress from "@mui/material/CircularProgress";
import styled, { keyframes } from "styled-components";
import { playStreakChime } from "../utils/chimes";
import { noteStreaks } from "../reminder/useStudyReminder";
import useReminderOffer from "../reminder/useReminderOffer";
import { isCountingDown, streakCountdownHint, studiedPercent } from "../utils/streakCountdown";

const POLL_FAST_MS = 5_000;
const POLL_SLOW_MS = 60_000;
const ITEM_WIDTH_PX = 75; // approximate width of one language item
const MORE_BUTTON_PX = 30;
const BAR_GAP_PX = 6;
// A switch waits for the server to save it; only a slow one shows a spinner.
const SPINNER_DELAY_MS = 300;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
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

// Takes the flag's place, at the flag's size, so the bar does not shift.
const FlagSpinner = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.3rem;
  height: 1.3rem;
`;

const spinnerSx = { color: "var(--streak-banner-text)" };

const StreakNumber = styled.span`
  font-weight: 700;
  font-size: 0.85rem;
  color: ${({ $practiced }) => ($practiced ? "var(--streak-banner-text)" : "var(--text-faint, #999)")};
  animation: ${({ $justPracticed }) => ($justPracticed ? pulse : "none")} 0.5s ease-out;
`;

const fireIconSx = { color: streakFireOrange, fontSize: "0.9rem" };
const fireIconGraySx = { color: "var(--text-faint, #999)", fontSize: "0.9rem" };

// The flame inside a ring that fills as today's study time adds up toward the
// daily goal.
const FlameRing = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.3rem;
  height: 1.3rem;
`;

const ringSx = { position: "absolute", inset: 0, color: streakFireOrange };
const ringTrackSx = { ...ringSx, color: "var(--streak-banner-border)" };

function StreakFlame({ lang, goalMinutes, countingDown, animating }) {
  const practiced = lang.practiced_today;
  const icon = <LocalFireDepartmentIcon sx={practiced ? fireIconSx : fireIconGraySx} />;
  const percent = studiedPercent(lang.ms_to_streak, goalMinutes);
  const flame = countingDown ? (
    <FlameRing>
      <CircularProgress variant="determinate" value={100} size="1.3rem" thickness={3} sx={ringTrackSx} />
      <CircularProgress variant="determinate" value={percent} size="1.3rem" thickness={3} sx={ringSx} />
      {icon}
    </FlameRing>
  ) : (
    icon
  );
  return (
    <>
      {flame}
      <StreakNumber $practiced={practiced} $justPracticed={animating}>
        {lang.daily_streak}
      </StreakNumber>
    </>
  );
}

// A tap on a language in the bar: on the current one (whose flame carries the
// ring toward today's goal) it opens the languages, on another it switches.
// Logged with where the day stood, so a study can tell whether the ring was
// looked at before or after the goal was met.
export const STREAK_BAR_TAPPED = "STREAK_BAR_TAPPED";

export function streakBarTapDetails(lang, isCurrent) {
  return JSON.stringify({
    current: isCurrent,
    practiced_today: Boolean(lang?.practiced_today),
    ms_to_streak: lang?.ms_to_streak ?? null,
    streak: lang?.daily_streak ?? null,
  });
}

function logStreakBarTap(api, lang, isCurrent) {
  api.logUserActivity(STREAK_BAR_TAPPED, "", lang?.code || "", streakBarTapDetails(lang, isCurrent));
}

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
  const { userDetails, userPreferences } = useContext(UserContext);
  const { requestSwitch, confirmModal, willConfirm } = useGuardedLanguageSwitch();
  const [languageStreaks, setLanguageStreaks] = useState([]);
  const [justPracticed, setJustPracticed] = useState({});
  const [switchingTo, setSwitchingTo] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [maxSlots, setMaxSlots] = useState(4);
  const prevPracticedRef = useRef({});
  const intervalRef = useRef(null);
  const wrapperRef = useRef(null);
  // The poll below is set up once per language; the offer reads the latest
  // preferences through this ref.
  const { offer, offerModal } = useReminderOffer();
  const offerRef = useRef(offer);
  offerRef.current = offer;

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
        if (!data) return;
        noteStreaks(data);
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
          playStreakChime();
          const lang = data.find((l) => newJustPracticed[l.code]);
          if (lang) {
            toast(`🔥 ${lang.daily_streak} day streak!`, { autoClose: 3000 });
            offerRef.current(lang.daily_streak);
          }
        }

        const current = data.find((l) => l.code === userDetails.learned_language);
        if (current?.practiced_today) {
          setPollingRate(POLL_SLOW_MS);
        }

        setLanguageStreaks(data);
        if (onMultipleLanguages) {
          onMultipleLanguages(true);
        }
      });
    }

    fetchStreaks();
    setPollingRate(POLL_FAST_MS);

    return () => clearInterval(intervalRef.current);
  }, [api, userDetails.learned_language]);

  useEffect(() => {
    setShowSpinner(false);
    if (!switchingTo) return;
    const timer = setTimeout(() => setShowSpinner(true), SPINNER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [switchingTo]);

  if (languageStreaks.length === 0) return null;

  const currentCode = switchingTo || userDetails.learned_language;
  const visible = pickVisible(languageStreaks, currentCode, maxSlots);
  const eligible = languageStreaks.filter(
    (l) => l.code === currentCode || l.daily_streak >= 1,
  );
  const hasHiddenStreaks = eligible.length > visible.length;

  function handleClick(langCode) {
    logStreakBarTap(api, languageStreaks.find((l) => l.code === langCode), langCode === currentCode);
    if (langCode === currentCode) {
      onOpenModal();
    } else {
      // Skip optimistic highlight when a confirmation will be shown — the
      // user might cancel, in which case the bar would have been lying.
      if (!willConfirm) setSwitchingTo(langCode);
      requestSwitch(langCode, () => {
        setSwitchingTo(null);
      });
    }
  }

  return (
    <Wrapper ref={wrapperRef}>
      {confirmModal}
      {offerModal}
      <Bar>
        {visible.map((lang) => {
          const isActive = lang.code === currentCode;
          // The ring is on the current language. While a switch is pending the
          // numbers are from before it, so the ring waits for the switch to land.
          const countingDown = isActive && !switchingTo && isCountingDown(lang.practiced_today, lang.ms_to_streak);
          const title = countingDown
            ? `${lang.language}: ${streakCountdownHint(lang.ms_to_streak, lang.daily_streak)}`
            : lang.language;
          const animating = justPracticed[lang.code];
          return (
            <LanguageItem
              key={lang.code}
              onClick={() => handleClick(lang.code)}
              title={title}
              style={{
                opacity: isActive ? 1 : 0.7,
                background: isActive && visible.length > 1 ? `${lightPurple}33` : "transparent",
                boxShadow: isActive && visible.length > 1 ? `inset 0 0 0 1.5px ${lightPurple}` : "none",
              }}
            >
              {showSpinner && lang.code === switchingTo ? (
                <FlagSpinner role="status" aria-label={`Switching to ${lang.language}`}>
                  <CircularProgress size="1rem" thickness={5} sx={spinnerSx} />
                </FlagSpinner>
              ) : (
                <Flag
                  src={`/static/flags-new/${lang.code}.svg`}
                  alt={lang.language}
                />
              )}
              {(lang.daily_streak >= 1 || isActive) && (
                <StreakFlame
                  lang={lang}
                  goalMinutes={userPreferences?.daily_goal_minutes}
                  countingDown={countingDown}
                  animating={animating}
                />
              )}
            </LanguageItem>
          );
        })}
      </Bar>
      {hasHiddenStreaks && (
        <MoreButton onClick={onOpenModal} title="More languages">
          <MoreHorizIcon sx={moreIconSx} />
        </MoreButton>
      )}
    </Wrapper>
  );
}
