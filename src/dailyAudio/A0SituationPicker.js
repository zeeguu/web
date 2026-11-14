import { useEffect, useState } from "react";
import styled from "styled-components";
import ClearableInput from "../components/ClearableInput";
import { SelectablePill } from "./SuggestionSelector.sc";
import { zeeguuOrange } from "../components/colors";
import { A0_SITUATIONS, findA0Situation, lessonsIn } from "./a0Situations";
import { MAX_SUGGESTION_LENGTH } from "./SuggestionSelector";

// An A0 learner picks their daily situation. Twelve at once is too many to
// choose from, so the picker first shows their current situation and the next
// three in the list (a0Situations.js, ordered the way a newcomer needs them)
// that they have not had yet: a recommendation, not a sample. Below them,
// "More situations" shows the whole list and "Type your own" a text field.
// Each pill says how many lessons they have had in it.

const RECOMMENDED = 3;

const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Links = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-top: 0.7rem;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${zeeguuOrange};
  cursor: pointer;

  &[aria-pressed="true"] {
    text-decoration: underline;
  }
`;

const Count = styled.span`
  font-weight: 400;
  opacity: 0.7;
`;

export function recommendedSituations(current, situations) {
  const notHad = A0_SITUATIONS.filter((s) => s !== current && lessonsIn(s.value, situations) === 0);
  // Had them all: the ones they had least.
  const rest = notHad.length
    ? notHad
    : A0_SITUATIONS.filter((s) => s !== current).sort(
        (a, b) => lessonsIn(a.value, situations) - lessonsIn(b.value, situations),
      );
  return [...(current ? [current] : []), ...rest.slice(0, RECOMMENDED)];
}

export default function A0SituationPicker({ api, language, subject, setSubject }) {
  // null until loaded: the recommendation depends on it, and pills that move
  // under the learner's finger once it arrives would be worse than a moment's wait.
  const [situations, setSituations] = useState(null);
  // Typing their own: chosen, or a saved subject that is not in the list.
  const [other, setOther] = useState(() => Boolean(subject && subject.trim()) && !findA0Situation(subject));
  const [expanded, setExpanded] = useState(false);
  // The saved situation, fixed for the life of the dialog: tapping another pill
  // must not reshuffle the recommendation.
  const [current] = useState(() => findA0Situation(subject));

  useEffect(() => {
    api.getAudioLessonSituations(language, setSituations, () => setSituations([]));
  }, [api, language]);

  if (situations === null) return null;

  const selected = other ? null : findA0Situation(subject);
  const shown = expanded ? A0_SITUATIONS : recommendedSituations(current, situations);

  return (
    <div>
      <Pills role="radiogroup" aria-label="Situation">
        {shown.map(({ emoji, label, value }) => {
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
              <span aria-hidden="true">{emoji} </span>
              {label}
              {n > 0 && <Count> · {n}</Count>}
            </SelectablePill>
          );
        })}
      </Pills>
      <Links>
        {!expanded && (
          <LinkButton type="button" onClick={() => setExpanded(true)}>
            More situations
          </LinkButton>
        )}
        <LinkButton
          type="button"
          aria-pressed={other}
          onClick={() => {
            if (!other) setSubject("");
            setOther(true);
          }}
        >
          Type your own
        </LinkButton>
      </Links>
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
