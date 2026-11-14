// The situations an A0 learner can pick for their daily lessons, roughly in
// the order a newcomer meets them. Drawn from what the study's learners chose
// themselves (café, supermarket, numbers, the time, a restaurant, weekend
// plans; Nov 2026) and filled in with the usual first weeks. "Other…" in the
// dialog keeps the learner's own ideas possible.
//
// value is what the lesson is generated from (and what the API stores as
// raw_suggestion); emoji and label are the pill.
export const A0_SITUATIONS = [
  { emoji: "👋", label: "Hello and introductions", value: "saying hello and introducing yourself" },
  { emoji: "🤷", label: "I don't understand", value: "saying you don't understand and asking for English" },
  { emoji: "☕", label: "At the café", value: "ordering at a café" },
  { emoji: "🛒", label: "At the supermarket", value: "shopping at the supermarket" },
  { emoji: "🔢", label: "Numbers and prices", value: "numbers and prices" },
  { emoji: "🕐", label: "Asking the time", value: "asking the time" },
  { emoji: "🥐", label: "At the bakery", value: "buying bread at the bakery" },
  { emoji: "🧭", label: "Asking for directions", value: "asking for directions" },
  { emoji: "🚆", label: "Bus or train ticket", value: "buying a bus or train ticket" },
  { emoji: "🍽️", label: "At a restaurant", value: "eating at a restaurant" },
  { emoji: "🏠", label: "Meeting a neighbor", value: "meeting a neighbor" },
  { emoji: "📅", label: "Weekend plans", value: "making plans for the weekend" },
];

const same = (a, b) => (a || "").trim().toLowerCase() === (b || "").trim().toLowerCase();

export function findA0Situation(subject) {
  return A0_SITUATIONS.find((s) => same(s.value, subject)) || null;
}

// situations: [{raw_suggestion, canonical_suggestion, lessons}] from the API.
export function lessonsIn(situationValue, situations) {
  return (situations || [])
    .filter((s) => same(s.raw_suggestion, situationValue))
    .reduce((n, s) => n + s.lessons, 0);
}
