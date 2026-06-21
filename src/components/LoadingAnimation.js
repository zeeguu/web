import * as s from "./LoadingAnimation.sc";
import React from "react";
import { StyledGreyButton } from "../exercises/exerciseTypes/Exercise.sc";
import { useState, useEffect } from "react";
import FeedbackModal from "./FeedbackModal";
import { FEEDBACK_OPTIONS } from "./FeedbackConstants";
import isInTeacherWebsite from "../utils/misc/isTeacherWebsite";
import { API_ENDPOINT } from "../appConstants";
import LocalStorage from "../assorted/LocalStorage";
import { isDrillVocabEmpty } from "../assorted/drillCache";
import WaitDrill from "./WaitDrill";
import { useIsOffline } from "../contexts/ConnectivityContext";

/*
 * Long-wait diagnosis: probe the network and the server in parallel so we
 * can tell the user *why* a request is slow ("your connection" vs "our
 * server") instead of just spinning silently.
 *
 * Choice of net probe — `1.1.1.1/cdn-cgi/trace`:
 *   Cloudflare anycast resolves to the *nearest* network edge for every
 *   user globally. That isolates the user's local-network latency from
 *   geographic distance — a probe to `mircealungu.com` (or any fixed-DC
 *   host) would conflate "your wifi is slow" with "you're far from that
 *   server." We use `mode: "no-cors"` since 1.1.1.1's trace endpoint
 *   doesn't send permissive CORS headers; we don't need the body, only
 *   the timing, so an opaque response is fine.
 *
 * Choice of server probe — `${API_ENDPOINT}/ping`:
 *   Returns `"OK"` with zero DB work. That isolates infrastructure
 *   health (TLS, app server, request handling) from any specific
 *   endpoint's quirks. We deliberately do NOT probe a heavier endpoint
 *   like `/stats/monthly_active_users`: every loading screen would
 *   hammer a real query against prod, and the latency would vary for
 *   reasons unrelated to the user's actual wait.
 *
 * Why tiny payloads are correct:
 *   On a slow link, latency dominates transfer time. A 200-byte response
 *   over Slow 3G is ~RTT + a few ms; a 20KB response is ~RTT + a few
 *   hundred ms. Bigger payload = slower probe with no extra signal.
 *
 * What this does NOT catch:
 *   Endpoint-specific slowness (e.g. a slow simplification, a slow LLM
 *   call, a query that's slow only for this user's data) — both probes
 *   come back fast while the actual request drags on. That case falls
 *   through to the baseline "Still working…" message, which is honest.
 */

// A probe is "slow" if it takes longer than this, "failed" if it doesn't
// resolve before the overall probe budget elapses.
const PROBE_SLOW_THRESHOLD_MS = 1500;
const PROBE_TIMEOUT_MS = 4000;

const NET_PROBE_URL = "https://1.1.1.1/cdn-cgi/trace";

// When the drill mounts the orange dots become a muted grey heartbeat
// above it — same size, just toned down.
const MUTED_SPINNER_STYLE = { opacity: 0.7 };

const LANG_DISPLAY = (() => {
  try {
    return new Intl.DisplayNames(["en"], { type: "language" });
  } catch {
    return null;
  }
})();

function learnedLanguageName(code) {
  if (!code || !LANG_DISPLAY) return null;
  try { return LANG_DISPLAY.of(code); } catch { return null; }
}

async function timedProbe(url, signal, { noCors = false } = {}) {
  const start = performance.now();
  try {
    const init = { cache: "no-store", signal };
    if (noCors) init.mode = "no-cors";
    const res = await fetch(url, init);
    // Drain readable responses so timing reflects full delivery, not just
    // headers. Opaque (no-cors) responses can't be read — skip the drain.
    if (res.type !== "opaque") await res.text();
    const elapsed = performance.now() - start;
    return elapsed > PROBE_SLOW_THRESHOLD_MS ? "slow" : "fast";
  } catch (e) {
    // Distinguish: aborted because the overall probe budget elapsed (signal
    // is a real "slow" verdict — we couldn't measure in time) vs aborted
    // because the component unmounted (drop the result).
    if (signal.aborted) {
      return signal.reason === "timeout" ? "slow" : null;
    }
    return "failed";
  }
}

// Rotating suffixes signal that time is passing during long waits, so the
// screen doesn't read as frozen. Last entry is shown indefinitely once
// reached — we don't loop, escalation feels honest rather than chatty.
// Tone: first one straight, then progressively wrier, with a wink to the
// language-learner audience by the end.
const REASSURANCE_SUFFIXES = [
  "Still working…",
  "Hang in there…",
  "Bonus lesson: patience…",
  "Patience: nearing C1 level…",
];

function diagnosePrefix(netResult, serverResult) {
  if (netResult === "failed" && serverResult === "failed") {
    return "You may be offline.";
  }
  // Net probe failed (CORS / DNS / etc) — we can't be sure about the user's
  // network, but blaming the server would be wrong either. Default to the
  // connection-side message, which is the more common cause.
  if (netResult === "failed" || netResult === "slow") {
    return "Your connection seems slow.";
  }
  if (serverResult === "failed") {
    return "We're having trouble reaching our server.";
  }
  if (serverResult === "slow") {
    return "Our server is taking a bit longer than usual.";
  }
  return null;
}

function diagnoseMessage(netResult, serverResult, tick) {
  const idx = Math.min(tick, REASSURANCE_SUFFIXES.length - 1);
  const suffix = REASSURANCE_SUFFIXES[idx];
  const prefix = diagnosePrefix(netResult, serverResult);
  return prefix ? `${prefix} ${suffix}` : suffix;
}

// Caption above the wait-game. By the time the drill surfaces the probes have
// resolved (on a hard offline they're set instantly from navigator.onLine), so
// when we already know the connection is down or slow, say so plainly — the
// neutral "While waiting…" reads as fake when nothing is actually loading.
function drillCaption(netResult, serverResult, langName) {
  const subject = langName || "vocabulary";
  // Offline state is stated by the primary "You're offline" headline, so the
  // caption here is just the invitation — no need to repeat "no connection".
  if (netResult === "failed" && serverResult === "failed") {
    return `While you wait, let's practice some ${subject}!`;
  }
  if (netResult === "failed" || netResult === "slow") {
    return `Your connection seems slow — while you wait, let's practice some ${subject}!`;
  }
  return `While waiting, let's practice some ${subject}!`;
}

export default function LoadingAnimation({
  specificStyle,
  delay = 1000,
  children,
  showReportIssue = true,
  reportIssueDelay = 4000,
}) {
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [netProbe, setNetProbe] = useState(null);
  const [serverProbe, setServerProbe] = useState(null);
  const [reassuranceTick, setReassuranceTick] = useState(0);
  const [showReportButton, setShowReportButton] = useState(false);
  const [showDrill, setShowDrill] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isTeacherWebsite] = useState(isInTeacherWebsite());
  const isOffline = useIsOffline();

  useEffect(() => {
    // Code from: https://stackoverflow.com/questions/53090432/react-hooks-right-way-to-clear-timeouts-and-intervals
    // Only show the loading if more that 1000ms have passed.
    const loadingTimer = setTimeout(() => setShowLoadingScreen(true), delay);

    if (!showReportIssue) {
      return () => clearTimeout(loadingTimer);
    }

    const abortController = new AbortController();
    let serverResult = null;

    // Diagnostic display tier: show contextual message ~3s after the spinner.
    const diagnosticTimer = setTimeout(() => setShowDiagnostic(true), delay + 3000);

    // Rotate reassurance suffix every 5s after the diagnostic appears so a
    // long wait visibly progresses. Cap at the last entry — same-value
    // return short-circuits React's render path, so we stop firing real
    // updates past 20s even though the interval keeps ticking.
    const reassuranceInterval = setInterval(() => {
      setReassuranceTick((t) =>
        t >= REASSURANCE_SUFFIXES.length - 1 ? t : t + 1,
      );
    }, 5000);

    // Wait-time vocab drill (see WaitDrill.js). Two timings:
    //   - hard-offline: surface the drill almost immediately, since the
    //     diagnostic will already say "You may be offline" and nothing
    //     productive is coming back from the network.
    //   - normal: let the diagnostic line land first, then ~3s later swap
    //     the spinner for the drill so the wait stops being dead time.
    // Skipped entirely when delay=0 (inline spinners like pagination).
    // The empty-cache check is deferred to the drill timer so fast loads
    // (which unmount before the spinner shows) don't pay the JSON parse.
    const hardOffline = typeof navigator !== "undefined" && navigator.onLine === false;
    const drillDelay = hardOffline ? delay + 200 : delay + 6000;
    const drillTimer = delay > 0
      ? setTimeout(() => {
          // Drill window has elapsed: kill the reassurance rotation either
          // way (it's been visible long enough; further ticks are wasted
          // timer wakeups, even though the reducer already bails on render).
          clearInterval(reassuranceInterval);
          const lang = LocalStorage.getLearnedLanguage();
          if (!isDrillVocabEmpty(lang)) setShowDrill(true);
        }, drillDelay)
      : null;

    // Probe race — kick off as soon as the spinner appears, so results are
    // ready by the time the diagnostic message displays.
    const probeStartTimer = setTimeout(() => {
      // Fast path: browser already knows we're offline — skip the probes.
      if (typeof navigator !== "undefined" && navigator.onLine === false) {
        setNetProbe("failed");
        setServerProbe("failed");
        serverResult = "failed";
        return;
      }
      const overallTimeout = setTimeout(
        () => abortController.abort("timeout"),
        PROBE_TIMEOUT_MS,
      );
      timedProbe(NET_PROBE_URL, abortController.signal, { noCors: true }).then((r) => {
        if (r !== null) setNetProbe(r);
      });
      timedProbe(`${API_ENDPOINT}/ping`, abortController.signal).then((r) => {
        if (r !== null) {
          setServerProbe(r);
          serverResult = r;
        }
        clearTimeout(overallTimeout);
      });
    }, delay);

    // Report Issue tier: only surface if the server probe came back fast.
    // A slow/failed server probe means infra is likely the cause and the
    // button would invite a non-actionable report.
    const reportIssueTimer = setTimeout(() => {
      if (serverResult === "fast") setShowReportButton(true);
    }, delay + reportIssueDelay);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(diagnosticTimer);
      clearTimeout(probeStartTimer);
      clearTimeout(reportIssueTimer);
      if (drillTimer) clearTimeout(drillTimer);
      clearInterval(reassuranceInterval);
      abortController.abort("unmount");
    };
    // eslint-disable-next-line
  }, []);

  // Offline state comes from the shared connectivity source (continuous, so it
  // often knows before this screen's delayed probes run). When there's no
  // connection nothing is actually loading, so a spinning loader would be
  // dishonest — hide it and let the offline message + wait-game stand on their
  // own. The probes below still run, but only to grade slow vs server-trouble.
  const knownOffline = isOffline;

  const spinnerVariant = showDrill
    ? "muted"
    : isTeacherWebsite
    ? "teacher"
    : "student";
  const spinnerStyle = showDrill ? MUTED_SPINNER_STYLE : undefined;
  const langName = showDrill
    ? learnedLanguageName(LocalStorage.getLearnedLanguage())
    : null;

  return (
    <>
      <FeedbackModal
        prefixMsg={"Loading"}
        open={showFeedbackModal}
        setOpen={() => {
          setShowFeedbackModal(!showFeedbackModal);
        }}
        componentCategories={FEEDBACK_OPTIONS.ALL}
      />
      {showLoadingScreen && (
        <s.LoadingContainer style={specificStyle}>
          {/* Primary status reads first, then the spinner confirms it's
              working, then the diagnostic line and the wait-game caption it
              introduces. Once we've concluded we're offline there's nothing to
              wait for, so state that plainly here instead of the caller's
              "loading…" message (a lie when nothing is in flight) — and the
              spinner below is dropped too. */}
          {knownOffline ? <p>You're offline</p> : children}
          {!knownOffline && (
            <s.LoadingAnimation style={spinnerStyle}>
              <div className={`lds-ellipsis ${spinnerVariant}`}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </s.LoadingAnimation>
          )}
          {/* The drill caption must ride with the drill, not the connection
              diagnostic: hard-offline surfaces the drill at delay+200ms while
              showDiagnostic only flips at delay+3000ms, so gating the caption on
              showDiagnostic alone made the game card appear ~3s before its
              caption. Show the caption as soon as either is up. */}
          {(showDrill || showDiagnostic) && (
            <div
              style={{
                color: "#888",
                fontSize: "0.9em",
                textAlign: "center",
                maxWidth: "22rem",
                marginBottom: "0.75rem",
              }}
            >
              {showDrill
                ? drillCaption(netProbe, serverProbe, langName)
                : diagnoseMessage(netProbe, serverProbe, reassuranceTick)}
            </div>
          )}
          {showDrill && <WaitDrill />}
          {showReportButton && !showDrill && (
            <StyledGreyButton
              style={{
                marginTop: showDiagnostic ? "0" : "-1.5rem",
                zIndex: 1000,
              }}
              onClick={() => {
                setShowFeedbackModal(!showFeedbackModal);
              }}
            >
              Report Issue
            </StyledGreyButton>
          )}
        </s.LoadingContainer>
      )}
    </>
  );
}
