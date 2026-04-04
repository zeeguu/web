import React from "react";
import ClearableInput from "../components/ClearableInput";
import {
  SuggestionWrapper,
  PillRow,
  SelectablePill,
  DescriptionText,
  InputArea,
} from "./SuggestionSelector.sc";

const MAX_SUGGESTION_LENGTH = 80;

const SUGGESTION_TYPES = {
  auto: {
    label: "Automatic",
    description: "A listening lesson with three of your words, each in a short dialogue.",
    placeholder: null,
  },
  topic: {
    label: "Topic",
    description: "A listening lesson with a conversation about a topic of your choice.",
    placeholder: "e.g. cooking, sports",
  },
  situation: {
    label: "Situation",
    description: "A listening lesson with a conversation simulating a real-world situation of your choice.",
    placeholder: "e.g. at a restaurant, job interview",
  },
};

const SELECTED_SUGGESTION_TYPE = "audio_lesson_suggestion_type_";
export const suggestionKey = (type, lang) => `audio_lesson_suggestion_${type}_${lang}`;

export function getSavedSuggestionType(lang) {
  return localStorage.getItem(SELECTED_SUGGESTION_TYPE + lang) || "auto";
}

export function getSavedSuggestion(lang) {
  return localStorage.getItem(suggestionKey(getSavedSuggestionType(lang), lang)) || "";
}

export default function SuggestionSelector({ suggestionType, setSuggestionType, suggestion, setSuggestion, lang }) {
  return (
    <SuggestionWrapper>

      <PillRow role="radiogroup" aria-label="Dialogue context">
        {Object.entries(SUGGESTION_TYPES).map(([key, { label }]) => (
          <SelectablePill
            key={key}
            type="button"
            $selected={suggestionType === key}
            role="radio"
            aria-checked={suggestionType === key}
            onClick={() => {
              if (suggestionType === key) return;
              setSuggestionType(key);
              localStorage.setItem(SELECTED_SUGGESTION_TYPE + lang, key);
              setSuggestion(key === "auto" ? "" : localStorage.getItem(suggestionKey(key, lang)) || "");
            }}
          >
            {label}
          </SelectablePill>
        ))}
      </PillRow>

      <DescriptionText>
        {SUGGESTION_TYPES[suggestionType].description}
      </DescriptionText>

      <InputArea $hidden={suggestionType === "auto"}>
        <ClearableInput
          placeholder={SUGGESTION_TYPES[suggestionType]?.placeholder || ""}
          maxLength={MAX_SUGGESTION_LENGTH}
          value={suggestion}
          tabIndex={suggestionType === "auto" ? -1 : 0}
          onChange={(e) => {
            const val = e.target.value.replace(/\n/g, " ");
            setSuggestion(val);
            const key = suggestionKey(suggestionType, lang);
            if (val.trim()) {
              localStorage.setItem(key, val);
            } else {
              localStorage.removeItem(key);
            }
          }}
          onClear={() => {
            setSuggestion("");
            localStorage.removeItem(suggestionKey(suggestionType, lang));
          }}
        />
      </InputArea>

    </SuggestionWrapper>
  );
}
