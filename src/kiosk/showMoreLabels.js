// Learned-language labels for the kiosk summary-expand toggle.
//
// Normal UI controls follow the app's UI language. The kiosk is the exception:
// it shows content in a language that may not be a UI language at all (e.g.
// Romanian), and its reader reads that content language — so this one control
// is localized to the FEED language, not the UI language. Falls back to English
// for any language not listed.
const LABELS = {
  da: ["Vis mere", "Vis mindre"],
  nl: ["Meer tonen", "Minder tonen"],
  en: ["Show more", "Show less"],
  fr: ["Voir plus", "Voir moins"],
  de: ["Mehr anzeigen", "Weniger anzeigen"],
  el: ["Περισσότερα", "Λιγότερα"],
  it: ["Mostra di più", "Mostra di meno"],
  pt: ["Ver mais", "Ver menos"],
  ro: ["Vezi mai mult", "Vezi mai puțin"],
  es: ["Ver más", "Ver menos"],
  sv: ["Visa mer", "Visa mindre"],
  pl: ["Pokaż więcej", "Pokaż mniej"],
  no: ["Vis mer", "Vis mindre"],
};

// languageCode may arrive as a bare code ("ro") or a {code} object depending on
// the feed payload — normalize both.
export function kioskExpandLabel(language, isExpanded) {
  const code = typeof language === "string" ? language : language?.code;
  const [more, less] = LABELS[code] || LABELS.en;
  return isExpanded ? less : more;
}
