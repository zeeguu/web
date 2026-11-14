import { useEffect, useState } from "react";
import styled from "styled-components";
import ClearableInput from "../components/ClearableInput";
import { SelectablePill } from "./SuggestionSelector.sc";
import { A0_SITUATIONS, findA0Situation, lessonsIn } from "./a0Situations";
import { MAX_SUGGESTION_LENGTH } from "./SuggestionSelector";

// An A0 learner picks their daily situation from a list (a0Situations.js), or
// "Other…" to type their own. Each pill says how many lessons they have had in
// it, so they can see where they have been and what is still new.

const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Count = styled.span`
  font-weight: 400;
  opacity: 0.7;
`;

export default function A0SituationPicker({ api, language, subject, setSubject }) {
  const [situations, setSituations] = useState([]);
  // Typing their own: chosen, or a saved subject that is not in the list.
  const [other, setOther] = useState(() => Boolean(subject && subject.trim()) && !findA0Situation(subject));

  useEffect(() => {
    api.getAudioLessonSituations(language, setSituations, () => setSituations([]));
  }, [api, language]);

  const selected = other ? null : findA0Situation(subject);

  return (
    <div>
      <Pills role="radiogroup" aria-label="Situation">
        {A0_SITUATIONS.map(({ label, value }) => {
          const n = lessonsIn(value, situations);
          const isSelected = selected?.value === value;
          return (
            <SelectablePill
              key={value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              $selected={isSelected}
              title={n ? `${n} ${n === 1 ? "lesson" : "lessons"} so far` : "New"}
              onClick={() => {
                setOther(false);
                setSubject(value);
              }}
            >
              {label}
              {n > 0 && <Count> · {n}</Count>}
            </SelectablePill>
          );
        })}
        <SelectablePill
          type="button"
          role="radio"
          aria-checked={other}
          $selected={other}
          onClick={() => {
            if (!other) setSubject("");
            setOther(true);
          }}
        >
          Other…
        </SelectablePill>
      </Pills>
      {other && (
        <div style={{ marginTop: "0.8rem" }}>
          <ClearableInput
            placeholder="A situation to get through, e.g. at the post office"
            maxLength={MAX_SUGGESTION_LENGTH}
            value={subject}
            onChange={(e) => setSubject(e.target.value.replace(/\n/g, " "))}
            onClear={() => setSubject("")}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
