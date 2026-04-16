import { useEffect, useState } from "react";

// Time-based "progress" messages for long-running backend ops that don't have
// a real progress stream yet (extension upload → simplify / translate /
// promote routinely take 15-25s of silent LLM work).
//
// Callers pass a stages array sorted by `atSeconds`; the hook swaps `message`
// at each threshold via a single setTimeout per stage, so re-renders fire
// only at stage transitions (not on a 500ms timer). Pass null to reset.
// IMPORTANT: pass a stable stages reference (module-scope or useMemo) —
// a fresh literal each render would restart all timers on every render.
//
//   const stages = [
//     { atSeconds: 0,  message: "Sending article to Zeeguu…" },
//     { atSeconds: 3,  message: "Reading the article…" },
//     { atSeconds: 10, message: "Rewriting for your level…" },
//   ];
//   const msg = useTimedProgressMessage(isProcessing ? stages : null);
export default function useTimedProgressMessage(stages) {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!stages || !stages.length) {
      setMessage(null);
      return;
    }
    setMessage(stages[0].message);
    const timers = stages
      .slice(1)
      .map((stage) =>
        setTimeout(() => setMessage(stage.message), stage.atSeconds * 1000),
      );
    return () => timers.forEach(clearTimeout);
  }, [stages]);

  return message;
}
