// Single source of truth for the interactive-text preferences.
//
// These are ONE preference set with two surfaces: the gear popover in the
// reader (ToolbarButtons) and the Text & highlighting settings page. Both read
// and write the same stored values — server-side via useUserPreferences, plus
// the per-device text size in useReaderFontSize — so the option list lives here
// to stop the two drifting apart the next time a toggle is added.
//
// `key` is the name both surfaces use for the value and its setter; `section`
// groups the options on the settings page. The popover renders them in list
// order under its own compact headings.
export const READING_TOGGLES = [
  {
    key: "translating",
    label: "See translation",
    description: "Tapping a word shows what it means in your language.",
    section: "onTap",
  },
  {
    key: "pronouncing",
    label: "Hear pronunciation",
    description: "Tapping a word also plays it out loud.",
    section: "onTap",
  },
  {
    key: "showReadingTimer",
    label: "Show reading timer",
    description: "Displays how long you have spent on the current article.",
    section: "whileReading",
  },
  {
    key: "showMweHints",
    label: "Show multi-word expressions hints",
    description:
      "Marks expressions whose meaning is not the sum of their words, so you can tap the whole phrase instead of one word.",
    section: "experimental",
  },
];

export const EXPERIMENTAL_SECTION = "experimental";
