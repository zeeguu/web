import { createContext } from "react";

// Show solution and No audio now, handed from the session to the typed-answer
// row (BottomInput), which shows them next to Hint, right under the input.
// While it does, it sets linksUnderInput so the card's bottom row leaves them
// out. Exercises without that row keep them at the bottom.
const ExerciseLinksContext = createContext(null);

export default ExerciseLinksContext;
