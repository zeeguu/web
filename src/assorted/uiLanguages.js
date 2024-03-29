const uiLanguages = [
  {
    name: "Danish",
    code: "da",
    selectedIcon: "/static/icons/dan-selected.png",
    deselectedIcon: "/static/icons/dan-deselected.png",
  },
  {
    name: "English",
    code: "en",
    selectedIcon: "/static/icons/eng-selected.png",
    deselectedIcon: "/static/icons/eng-deselected.png",
  },
];

const defaultUILanguage = uiLanguages[1];

export { uiLanguages as default, defaultUILanguage };
