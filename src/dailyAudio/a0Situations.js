// The situations an A0 learner can pick for their daily lessons, roughly in
// the order a newcomer meets them. Drawn from what the study's learners chose
// themselves (café, supermarket, numbers, the time, a restaurant, weekend
// plans; Nov 2026) and filled in with the usual first weeks. "Other…" in the
// dialog keeps the learner's own ideas possible.
//
// value is what the lesson is generated from (and what the API stores as
// raw_suggestion); label is the pill.
export const A0_SITUATIONS = [
  { label: "Hello and introductions", value: "saying hello and introducing yourself" },
  { label: "I don't understand", value: "saying you don't understand and asking for English" },
  { label: "At the café", value: "ordering at a café" },
  { label: "At the supermarket", value: "shopping at the supermarket" },
  { label: "Numbers and prices", value: "numbers and prices" },
  { label: "Asking the time", value: "asking the time" },
  { label: "At the bakery", value: "buying bread at the bakery" },
  { label: "Asking for directions", value: "asking for directions" },
  { label: "Bus or train ticket", value: "buying a bus or train ticket" },
  { label: "At a restaurant", value: "eating at a restaurant" },
  { label: "Meeting a neighbor", value: "meeting a neighbor" },
  { label: "Weekend plans", value: "making plans for the weekend" },
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
