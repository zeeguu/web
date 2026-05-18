import * as s from "./LoadingAnimation.sc";
import React from "react";
import { StyledGreyButton } from "../exercises/exerciseTypes/Exercise.sc";
import { useState, useEffect } from "react";
import FeedbackModal from "./FeedbackModal";
import { FEEDBACK_OPTIONS } from "./FeedbackConstants";
import isInTeacherWebsite from "../utils/misc/isTeacherWebsite";
import { API_ENDPOINT } from "../appConstants";

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
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isTeacherWebsite] = useState(isInTeacherWebsite());

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
    // long wait visibly progresses; the message generator caps at the last
    // entry, so this stops being meaningful past 20s.
    const reassuranceInterval = setInterval(() => {
      setReassuranceTick((t) => t + 1);
    }, 5000);

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
      clearInterval(reassuranceInterval);
      abortController.abort("unmount");
    };
    // eslint-disable-next-line
  }, []);

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
          <s.LoadingAnimation>
            <div
              className={
                "lds-ellipsis " + (isTeacherWebsite ? "teacher" : "student")
              }
            >
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </s.LoadingAnimation>
          {showDiagnostic && (
            <div
              style={{
                color: "#888",
                fontSize: "0.9em",
                textAlign: "center",
                maxWidth: "22rem",
                marginBottom: "0.75rem",
              }}
            >
              {diagnoseMessage(netProbe, serverProbe, reassuranceTick)}
            </div>
          )}
          {showReportButton && (
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
          {children}
        </s.LoadingContainer>
      )}
    </>
  );
}
