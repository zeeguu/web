import * as s from "../styledComponents/FilterInput.sc";

/**
 * Type-to-narrow input for a long list that is already on screen.
 *
 * Unlike SearchField, this searches nothing remote and navigates nowhere:
 * the caller filters whatever it is rendering with the value it gets back.
 */
export default function FilterInput({ value, onChange, placeholder, ariaLabel }) {
  return (
    <s.FilterInputWrapper>
      <input
        type="text"
        aria-label={ariaLabel || placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="clear-filter" aria-label="Clear filter" onClick={() => onChange("")}>
          ×
        </button>
      )}
    </s.FilterInputWrapper>
  );
}
