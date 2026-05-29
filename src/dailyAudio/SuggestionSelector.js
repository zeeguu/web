import React from "react";
import ClearableInput from "../components/ClearableInput";
import {
  SuggestionWrapper,
  PillRow,
  SelectablePill,
  DescriptionText,
  InputArea,
} from "./SuggestionSelector.sc";

export const MAX_SUGGESTION_LENGTH = 80;

export const SUGGESTION_TYPES = {
  auto: {
    label: "Vocabulary",
    description: "A new lesson built from words on your study list, each in a short dialogue.",
    placeholder: null,
  },
  topic: {
    label: "Topic",
    description: "A daily conversation about a subject you care about.",
    placeholder: "e.g. cooking, sports",
  },
  situation: {
    label: "Situation",
    description: "A daily conversation that role-plays a real-world situation.",
    placeholder: "e.g. at a restaurant, job interview",
  },
};

// The UI pills use friendly keys ("auto"); the backend / preference store
// the canonical lesson_type ("three_words_lesson"). Convert at the boundary.
const PILL_TO_BACKEND = { auto: "three_words_lesson", topic: "topic", situation: "situation" };

export const pillToBackend = (pillKey) => PILL_TO_BACKEND[pillKey] || "three_words_lesson";

export const backendToPill = (lessonType) =>
  lessonType === "topic" || lessonType === "situation" ? lessonType : "auto";

/**
 * Pure controlled selector. The parent owns the (suggestionType, suggestion)
 * state and is responsible for persistence — this component just renders the
 * pills + description + input and reports changes upward.
 */
export default function SuggestionSelector({
  suggestionType,
  setSuggestionType,
  suggestion,
  setSuggestion,
  autoDisabled,
}) {
  const selectType = (key) => {
    if (suggestionType === key) return;
    // Only switch the type — the parent keeps a per-type subject, so it supplies
    // the right text for whichever pill is selected (and clears nothing).
    setSuggestionType(key);
  };

  return (
    <SuggestionWrapper>
      <PillRow role="radiogroup" aria-label="Daily lesson type">
        {Object.entries(SUGGESTION_TYPES).map(([key, { label }]) => (
          <SelectablePill
            key={key}
            type="button"
            $selected={suggestionType === key}
            role="radio"
            aria-checked={suggestionType === key}
            onClick={() => selectType(key)}
          >
            {label}
          </SelectablePill>
        ))}
      </PillRow>

      {autoDisabled && (
        <small
          style={{
            display: "block",
            color: "var(--text-secondary)",
            fontSize: "0.85em",
            fontStyle: "italic",
            marginTop: "0.25rem",
          }}
        >
          Vocabulary lessons need three study words — add a few to your list first.
        </small>
      )}

      <DescriptionText>{SUGGESTION_TYPES[suggestionType].description}</DescriptionText>

      <InputArea $hidden={suggestionType === "auto"}>
        <ClearableInput
          placeholder={SUGGESTION_TYPES[suggestionType]?.placeholder || ""}
          maxLength={MAX_SUGGESTION_LENGTH}
          value={suggestion}
          tabIndex={suggestionType === "auto" ? -1 : 0}
          onChange={(e) => setSuggestion(e.target.value.replace(/\n/g, " "))}
          onClear={() => setSuggestion("")}
        />
      </InputArea>
    </SuggestionWrapper>
  );
}
