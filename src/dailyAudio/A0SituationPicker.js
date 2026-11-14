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
// Each pill says how many lessons they have had in it. A saved situation the
// learner typed themselves is a pill too (✏️), selected: opening the dialog on
// a text field with the keyboard up read as being asked to type something.

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

function SituationPill({ emoji, label, lessons, selected, onClick }) {
  return (
    <SelectablePill
      type="button"
      role="radio"
      aria-checked={selected}
      $selected={selected}
      title={lessons ? `${lessons} ${lessons === 1 ? "lesson" : "lessons"} so far` : "New"}
      onClick={onClick}
    >
      <span aria-hidden="true">{emoji} </span>
      {label}
      {lessons > 0 && <Count> · {lessons}</Count>}
    </SelectablePill>
  );
}

export default function A0SituationPicker({ api, language, subject, setSubject }) {
  // null until loaded: the recommendation depends on it, and pills that move
  // under the learner's finger once it arrives would be worse than a moment's wait.
  const [situations, setSituations] = useState(null);
  // Typing their own, after tapping "Type your own".
  const [typing, setTyping] = useState(false);
  // What was selected before "Type your own", put back by "Back to the list".
  const [previous, setPrevious] = useState(subject);
  // What they typed, kept when they go back to the list, for when they return.
  const [draft, setDraft] = useState("");
  const [expanded, setExpanded] = useState(false);
  // The saved situation when the learner typed it themselves, fixed for the
  // life of the dialog.
  const [custom] = useState(() => (subject && subject.trim() && !findA0Situation(subject) ? subject.trim() : null));
  // The saved situation, fixed for the life of the dialog: tapping another pill
  // must not reshuffle the recommendation.
  const [current] = useState(() => findA0Situation(subject));

  useEffect(() => {
    api.getAudioLessonSituations(language, setSituations, () => setSituations([]));
  }, [api, language]);

  if (situations === null) return null;

  // Typing their own takes the dialog over: the field alone, and a way back.
  // A second popup on top of this one would be two layers on a phone, with
  // the keyboard covering the second.
  if (typing) {
    return (
      <div>
        <ClearableInput
          placeholder="A situation to get through, e.g. at the post office"
          maxLength={MAX_SUGGESTION_LENGTH}
          value={subject}
          onChange={(e) => setSubject(e.target.value.replace(/\n/g, " "))}
          onClear={() => setSubject("")}
          autoFocus
        />
        <Links>
          <LinkButton
            type="button"
            onClick={() => {
              setDraft(subject);
              setSubject(previous);
              setTyping(false);
            }}
          >
            ← Back to the list
          </LinkButton>
        </Links>
      </div>
    );
  }

  const selected = findA0Situation(subject);
  const shown = expanded ? A0_SITUATIONS : recommendedSituations(current, situations);
  const isCustom = custom !== null && (subject || "").trim() === custom;

  return (
    <div>
      <Pills role="radiogroup" aria-label="Situation">
        {custom && (
          <SituationPill
            emoji="✏️"
            label={custom}
            lessons={lessonsIn(custom, situations)}
            selected={isCustom}
            onClick={() => setSubject(custom)}
          />
        )}
        {shown.map(({ emoji, label, value }) => (
          <SituationPill
            key={value}
            emoji={emoji}
            label={label}
            lessons={lessonsIn(value, situations)}
            selected={selected?.value === value}
            onClick={() => setSubject(value)}
          />
        ))}
      </Pills>
      <Links>
        {!expanded && (
          <LinkButton type="button" onClick={() => setExpanded(true)}>
            More situations
          </LinkButton>
        )}
        <LinkButton
          type="button"
          onClick={() => {
            setPrevious(subject);
            // Their own situation, or what they typed before going back, to
            // edit rather than retype.
            setSubject(draft || (isCustom ? subject : ""));
            setTyping(true);
          }}
        >
          Type your own
        </LinkButton>
      </Links>
    </div>
  );
}
