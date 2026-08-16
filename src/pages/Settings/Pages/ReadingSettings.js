import { useContext, useEffect } from "react";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import { setTitle } from "../../../assorted/setTitle";
import { APIContext } from "../../../contexts/APIContext";
import useUserPreferences from "../../../hooks/useUserPreferences";
import useReaderFontSize, { FONT_SIZE_STEP } from "../../../hooks/useReaderFontSize";
import ToggleOption from "../../../components/Toggles/ToggleOption";
import TextSizeControl from "../../../components/Controls/TextSizeControl";
import { READING_TOGGLES } from "../../../reader/readingPreferences";
import * as s from "./ReadingSettings.sc";

const PAGE_TITLE = "Text & highlighting";

// The full home of the interactive-text preferences — the same values the gear
// popover in the reader writes (see reader/readingPreferences.js). They apply
// wherever Zeeguu renders tappable text, which is why they live under Reading
// rather than under Feed: someone who wants to turn off the multi-word
// underlines after a full article read would not think to look in feed
// settings.
//
// Unlike the popover, this page has room for a description under each toggle,
// so what each one actually does is explained rather than guessed at.
const SECTIONS = [
  { key: "onTap", header: "When you tap a word" },
  { key: "whileReading", header: "While reading" },
  { key: "experimental", header: "Experimental" },
];

export default function ReadingSettings() {
  const api = useContext(APIContext);
  const {
    translateInReader,
    updateTranslateInReader,
    pronounceInReader,
    updatePronounceInReader,
    showMweHints,
    updateShowMweHints,
    showReadingTimer,
    updateShowReadingTimer,
  } = useUserPreferences(api);
  const [readerFontSize, setReaderFontSize] = useReaderFontSize();

  useEffect(() => {
    setTitle(PAGE_TITLE);
  }, []);

  // Bind the shared option list to this page's values, keyed by the list's
  // `key` — same contract as ToolbarButtons, different preference accessors.
  const isOn = {
    translating: translateInReader,
    pronouncing: pronounceInReader,
    showReadingTimer: showReadingTimer,
    showMweHints: showMweHints,
  };
  const setOn = {
    translating: updateTranslateInReader,
    pronouncing: updatePronounceInReader,
    showReadingTimer: updateShowReadingTimer,
    showMweHints: updateShowMweHints,
  };

  function renderToggle(option) {
    const label = (
      <s.OptionText>
        <s.OptionLabel>{option.label}</s.OptionLabel>
        <s.OptionDescription>{option.description}</s.OptionDescription>
      </s.OptionText>
    );

    return (
      <s.OptionRow key={option.key}>
        <ToggleOption
          checked={isOn[option.key]}
          onToggle={setOn[option.key]}
          className={isOn[option.key] ? "selected" : ""}
          label={label}
        />
      </s.OptionRow>
    );
  }

  const textSize = (
    <s.SizeRow>
      <TextSizeControl
        value={readerFontSize}
        onDecrease={() => setReaderFontSize(readerFontSize - FONT_SIZE_STEP)}
        onIncrease={() => setReaderFontSize(readerFontSize + FONT_SIZE_STEP)}
      />
      <s.SizeDescription>Applies to articles and previews on this device.</s.SizeDescription>
    </s.SizeRow>
  );

  function renderSection(section) {
    const options = READING_TOGGLES.filter((option) => option.section === section.key);

    return (
      <s.Section key={section.key}>
        <s.SectionHeader>{section.header}</s.SectionHeader>
        {options.map(renderToggle)}
        {section.key === "whileReading" && textSize}
      </s.Section>
    );
  }

  return (
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <SettingsPageHeader title={PAGE_TITLE} />
      <Main>
        <s.PageBody>{SECTIONS.map(renderSection)}</s.PageBody>
      </Main>
    </CardPage>
  );
}
