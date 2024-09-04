import strings from "../i18n/definitions";
import * as s from "./Selector.sc";

export default function LanguageSelector({
  languages,
  selected,
  onChange,
  label,
  name,
  id,
}) {
  languages.sort((a, b) => (a.name > b.name ? 1 : -1));

  return (
    <s.SelectWrapper>
      <s.Label htmlFor={id} name={name}>
        {label}
      </s.Label>
      <s.SelectStyledContainer>
        <s.Select
          id={id}
          name="language-selector"
          value={strings[selected.toLowerCase()]}
          onChange={(e) => onChange(e)}
        >
          {languages.map((lang) => (
            <option key={lang.code} code={lang.code}>
              {strings[lang.name.toLowerCase()]}
            </option>
          ))}
        </s.Select>
      </s.SelectStyledContainer>
    </s.SelectWrapper>
  );
}
