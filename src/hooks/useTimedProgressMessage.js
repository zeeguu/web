import { useEffect, useState } from "react";

// Time-based "progress" messages for long-running backend ops that don't have
// a real progress stream yet (extension upload → simplify / translate /
// promote routinely take 15-25s of silent LLM work).
//
// Callers pass a stages array sorted by `atSeconds`; the hook returns the
// message whose threshold has just been crossed. Pass null to stop the timer
// and reset — e.g. when leaving the loading state.
//
//   const stages = [
//     { atSeconds: 0,  message: "Sending article to Zeeguu…" },
//     { atSeconds: 3,  message: "Reading the article…" },
//     { atSeconds: 10, message: "Rewriting for your level…" },
//   ];
//   const msg = useTimedProgressMessage(isProcessing ? stages : null);
export default function useTimedProgressMessage(stages) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!stages) {
      setElapsed(0);
      return;
    }
    const start = Date.now();
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - start) / 1000)),
      500,
    );
    return () => clearInterval(id);
  }, [stages]);

  if (!stages || !stages.length) return null;
  let current = stages[0].message;
  for (const stage of stages) {
    if (elapsed >= stage.atSeconds) current = stage.message;
    else break;
  }
  return current;
}
