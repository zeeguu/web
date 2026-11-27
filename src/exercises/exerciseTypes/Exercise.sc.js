import styled, { keyframes } from "styled-components";

import { zeeguuTransparentLightOrange, zeeguuOrange, zeeguuWarmYellow } from "../../components/colors";

const Exercise = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  transition: all 0.5s;
  padding-bottom: 1rem;
  flex: 1;
  // VISUAL_DEBUGGING
  //background-color: antiquewhite;

  .type-feedback p {
    margin: 0.5em;
  }

  .headline {
    color: gray;
    margin-top: 1em;
    font-weight: 500;
  }

  .headlineWithMoreSpace {
    font-size: small;
    font-weight: 600;
    color: gray;
    margin-top: 0.5em;
    margin-bottom: 2em;
    /* font-weight: 600; */
  }

  .bottomInput {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-end;
    margin-top: 3em;
    flex-wrap: wrap;
  }

  .bottomInput button {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  .bottomInput input {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    text-align: center;
  }

  .highlightedWord {
    color: orange;
    font-weight: 800;
  }

  .wordInContextHeadline {
    margin-bottom: 0.25em;
    margin-top: 0.5em;
    font-size: 1.5em;
    font-weight: 600;
  }

  .contextExample {
    margin-top: 1em;
    margin-left: 2em;
    margin-right: 2em;
    font-weight: 500;
    line-height: 1.4em;
    min-height: 4.5em; /* Prevent layout jump when example length changes */
  }

  /* Click-word exercises require larger tap targets — bumping line-height
     gives more vertical breathing room around mid-sentence words so they
     are easier to hit with a finger. Class names come from EXERCISE_TYPES
     (clickWordInContext, findWordInContext). */
  &.Click_L1W_in_L2T .contextExample,
  &.Recognize_L1W_in_L2T .contextExample {
    line-height: 2.2em;
  }

  .learningCycleIndicator {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 2em;
  }

  .learningCycleIcon {
    margin-right: 1em;
  }

  .cooling-bars {
    display: flex;
  }

  .cooling-bar {
    height: 0.5em;
    margin-right: 0.5em;
    border-radius: 10px;
  }

  .cooling-bar.green {
    background-color: green;
  }

  .cooling-bar.greenCorrect {
    background-color: green;
    animation: glowGreen 1s ease-in-out 1;
  }

  @keyframes glowGreen {
    0% {
      box-shadow: 0 0 3px 0 rgba(0, 255, 0, 0.5);
    }
    50% {
      box-shadow: 0 0 10px 5px rgba(0, 255, 0, 0.5);
    }
    100% {
      box-shadow: 0 0 3px 0 rgba(0, 255, 0, 0.5);
    }
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  .cooling-bar.grey {
    background-color: lightGrey;
  }

  /* Mobile version */
  @media screen and (max-width: 768px) {
    .contextExample {
      margin-top: 0.5em;
      margin-left: 0.5em;
      margin-right: 0.5em;
      font-size: 1.2em;
    }

    .bottomInput {
      margin-top: 0.5em;
    }

    .bottomInput input {
      width: 6em;
    }

    h1 {
      margin-top: 0px;
      margin-bottom: 0px;
    }

    .wordInContextHeadline {
      margin-bottom: 0.1em;
      margin-top: 0.25em;
      font-size: 1.25em;
    }
  }
`;

const StyledButton = styled.button`
  cursor: pointer;
  padding: 0.5em;
  font-weight: 500;
  border-radius: 0.625em;
  border-style: none;
  user-select: none;
`;

let MatchInputHolder = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

let MatchButtonHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-evenly;
`;

let MatchButtonHolderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
`;

let MatchSpeakButtonHolder = styled.div`
  width: fit-content;
  margin-left: -1.5em;
  border-radius: 0.75em;
`;

let MatchButton = styled(StyledButton)`
  width: fit-content;
  margin-top: 1.5em;
  margin-bottom: 1em;
  background: #ffd04799;
  color: black;
  border: 0.125em solid ${zeeguuTransparentLightOrange};

  &:focus {
    outline: 0;
  }

  &:hover {
    background-color: ${zeeguuTransparentLightOrange};
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

let MatchingWords = styled.p`
  margin-top: 1.6em;
  margin-bottom: 1.1em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 0.5em;
  font-size: 1.125em;
  margin-right: 1em;
  animation: ${fadeIn} 0.4s ease;
`;

let OrangeButton = styled(StyledButton)`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  color: var(--orange-btn-text);
  background-color: ${zeeguuOrange};
  margin: 1em;
`;

let OrangeButtonMessage = styled(StyledButton)`
  display: flex;
  flex-direction: column;
  width: fit-content;
  justify-content: center;
  align-items: center;

  color: black;
  background-color: ${zeeguuOrange};
  margin: 1em;
`;

let FeedbackButton = styled(OrangeButton)`
  height: fit-content;
  width: fit-content;

  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--exercise-btn-focus, rgba(0, 0, 0, 0.3));
  }

  &:disabled {
    cursor: default;
    text-decoration: line-through;
  }

  &.next-btn {
    border: 0.125em solid var(--exercise-btn-border, rgba(0, 0, 0, 0.15));
  }
`;

let LeftFeedbackButton = styled(FeedbackButton)`
  margin: 1em;

  @media (max-width: 430px) {
    order: 1;
  }
`;

let RightFeedbackButton = styled(FeedbackButton)`
  margin: 1em;

  @media (max-width: 430px) {
    order: 2;
  }
  @media (max-width: 250px) {
    order: 3;
  }
`;

// The typed answer: [optional speaker] [input] [Check] on one line, so
// with the phone keyboard up the whole exercise stays above it. The row
// spaces its children with gap, so their own margins are dropped, and
// they all take the input's height.
let AnswerRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.5em;
  width: 100%;
  max-width: 26em;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 0 0.5em;

  /* && outranks the children's own margin, height and (Input's) order. */
  && > * {
    margin: 0;
    height: auto;
    order: 0;
  }

  && > button {
    min-width: 2.6em;
  }
`;

let CheckButton = styled(FeedbackButton)`
  padding: 0 1em;
`;

// Check button for exercises where an answer must be picked first: an
// outlined, unfilled look while disabled so it doesn't read as one more
// answer before one has been picked.
let PickFirstCheckButton = styled(FeedbackButton)`
  transition: background-color 0.15s ease-out;

  &:disabled {
    text-decoration: none;
    background-color: transparent;
    color: var(--text-muted);
    box-shadow: inset 0 0 0 2px ${zeeguuOrange};
  }
`;

const shake = keyframes`
10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`;

let AnimatedOrangeButton = styled(OrangeButton)`
  animation: ${shake} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
  margin: 1em;
`;

// Wraps a button that isn't an OrangeButton (the audio options are
// SpeakButtons) to shake it like AnimatedOrangeButton after a wrong pick.
let ShakeOnce = styled.span`
  display: inline-block;
  animation: ${shake} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
`;

let AnimatedMatchButton = styled(MatchButton)`
  animation: ${shake} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
`;

let Input = styled.input`
  height: 1.5em;
  text-align: center;
  transition: all 0.3s;
  border-radius: 0.5em;

  &.wrong-border {
    border-style: solid;
    border-color: red !important;
  }

  &.almost-border {
    border-style: solid;
    border-color: ${zeeguuOrange} !important;
  }

  &:focus {
    outline: none !important;
    height: 1.7em;
    width: 80%;
  }

  &::placeholder {
    font-size: medium;
    font-weight: 500;
    color: lightgrey;
  }

  @media (max-width: 430px) {
    order: 3;
  }
  @media (max-width: 250px) {
    order: 2;
  }
`;

let AnimatedInput = styled(Input)`
  animation: ${shake} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;

  @media (max-width: 430px) {
    order: 3;
  }
  @media (max-width: 250px) {
    order: 2;
  }
`;

let BottomRow = styled.div`
  display: flex;
  padding: 0.5em;
  align-items: center;
  justify-content: space-around;
  margin-top: 3em;
  margin-bottom: 1em;
  flex-wrap: wrap;

  @media (max-width: 430px) {
    flex-flow: row wrap;
  }
`;

let BottomRowCompact = styled.div`
  display: flex;
  padding: 0.5em;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 3em;
  margin-top: auto;

  @media (max-width: 430px) {
    flex-flow: row wrap;
  }
`;

let BottomRowSmallTopMargin = styled.div`
  display: flex;
  padding: 0.5em;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 0.5em;

  @media (max-width: 768px) {
    margin-bottom: 2.5em;
  }

  @media (max-width: 430px) {
    flex-flow: row wrap;
  }
`;

let StyledGreyButton = styled.button`
  background: none !important;
  border: none !important;
  padding: 0 !important;
  margin-top: 1em;
  color: gray;
  text-decoration: underline;
  font-size: small !important;
  font-weight: 500;
  cursor: pointer;
  font-family: "Montserrat";
  @media (hover: hover) {
    :hover {
      filter: brightness(110%);
    }
  }
  &:disabled {
    cursor: default;
    text-decoration: line-through;
  }
`;

let BlueButton = styled.button`
  background-color: #f8f9fa !important;
  border: 1px solid #dee2e6 !important;
  color: #1976d2 !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 0.25rem !important;
  text-decoration: none !important;
  font-size: 0.75rem !important;
  font-weight: 400 !important;
  cursor: pointer !important;
  transition: all 0.15s ease-in-out !important;
  margin: 0 !important;
  font-family: inherit !important;

  &:hover {
    background-color: #e9ecef !important;
    border-color: #adb5bd !important;
  }

  &:active {
    background-color: #dee2e6 !important;
    border-color: #adb5bd !important;
  }
`;

let StyledDiv = styled.div`
  margin-top: 1em;
  color: gray;
`;

let ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

let CenteredRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  &.margin-top-auto {
    margin-top: auto;
  }
  @media (max-width: 800px) {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`;

let CenteredWordRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  &.margin-top-auto {
    margin-top: auto;
  }
  @media (max-width: 800px) {
    flex-wrap: wrap;
  }
`;

// Show solution, No audio now and Report on one line. The grey links
// bring a top margin Report lacks; the row drops it to center them.
let ExerciseLinksRow = styled(CenteredWordRow)`
  gap: 0.5rem 1.25rem;

  && > * {
    margin-top: 0;
  }
`;

let CenteredRowTall = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 1.5em;
`;

let EditSpeakButtonHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

let MultipleChoiceContext = styled.div`
  margin: 0.5em;
  padding: 1em;
  cursor: pointer;
  transition: font-size 320ms cubic-bezier(0.22, 1, 0.36, 1);

  &.wrong {
    animation: ${shake} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  /* No "correct" border — the bookmark word inside the chosen context
     is already highlighted with bright-orange + dotted underline + the
     L1 chip above, which carries the "you got it" signal. A 0.25em
     orange border around the whole card on top of that is visual
     redundancy. */

  /* Post-reveal: the chosen context is the only thing on the card, so
     bump it up to the normal reading font size (same scale as
     .contextExample uses elsewhere). During the exercise the smaller
     size is intentional — it lets all four options fit comfortably. */
  &.revealed {
    font-size: 1.2em;
    cursor: default;
  }
`;

// Wrapper for the BookmarkProgressBar in the reveal state. The pre-reveal
// space is intentionally not reserved here — most exercises render the
// progress bar only when isExerciseOver is true, with a small gap above
// the sentence. The $tight variant is used by MultipleChoiceContext
// where the wrapper sits directly below the chosen option (already-airy
// layout) and doesn't need the bigger top margin.
// The one main action at the bottom of the card: the flashcard's
// Show answer, and Next once an exercise is answered. Same look and the same
// spot, so the thumb goes to one place all session.
let PrimaryExerciseButton = styled.button`
  min-width: 11.5rem;
  min-height: 3.5rem;
  padding: 0.8rem 1.75rem;
  border-radius: 0.75rem;
  border: 1px solid transparent;
  background-color: ${zeeguuWarmYellow};
  color: var(--orange-btn-text);
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  transition: filter 0.15s ease;

  &:active {
    filter: brightness(0.95);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--exercise-btn-focus, rgba(0, 0, 0, 0.3));
  }
`;

// After answering: Explain / Remove / Share as small pills, right under the
// exercise, since they act on the word; far from Next, so a thumb going for
// Next does not hit them.
let WordActions = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.25rem;

  svg {
    font-size: 1.1em;
  }
`;

// After answering: Next, then the Auto-pronounce setting, pinned to the
// bottom of the card. Its bottom padding is set so Next lines up with the
// flashcard's Show answer.
let AfterAnswerFooter = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1rem 3.5rem;
`;

// A fixed-height slot below the cloze (SpellWhatYouHear's speak button), so
// the sentence above doesn't shift.
let CenteredRevealedSlot = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: ${(props) => props.$marginTop || "1em"};
  min-height: ${(props) => props.$minHeight || "auto"};
`;

// The word's progress bar at the top of the exercise card: below the
// corner icons, with its height kept before the answer so nothing jumps.
let TopProgressSlot = styled.div`
  visibility: ${(props) => (props.$visible ? "visible" : "hidden")};
  height: 2.5rem;
  margin-top: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// "You've learned a new word!" under the top progress bar: one slim line,
// not a box between the sentence and Next.
let WordLearnedLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: fit-content;
  margin: 0.25rem auto 0;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--success-border);
  background-color: var(--success-bg);
  color: var(--text-primary);
  font-size: 0.85rem;
  font-weight: 600;
`;

// Report and Share: small gray icons in the card's top-right corner, out of
// the way of the exercise and of Next.
let CornerIcons = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 1;
  display: flex;
  gap: 0.25rem;
`;

let CornerIconButton = styled.button`
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--text-faint);
  display: flex;
  align-items: center;

  &:disabled {
    cursor: default;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      color: var(--text-muted);
    }
  }
`;

export {
  Exercise,
  FeedbackButton,
  OrangeButton,
  AnimatedOrangeButton,
  ShakeOnce,
  Input,
  AnimatedInput,
  BottomRow,
  BottomRowCompact,
  BottomRowSmallTopMargin,
  StyledGreyButton,
  BlueButton,
  StyledDiv,
  MatchButton,
  MatchingWords,
  AnimatedMatchButton,
  MatchButtonHolder,
  MatchButtonHolderRight,
  MatchInputHolder,
  MatchSpeakButtonHolder,
  ButtonRow,
  CenteredRow,
  CenteredRowTall,
  CenteredWordRow,
  LeftFeedbackButton,
  RightFeedbackButton,
  PickFirstCheckButton,
  AnswerRow,
  CheckButton,
  ExerciseLinksRow,
  EditSpeakButtonHolder,
  OrangeButtonMessage,
  MultipleChoiceContext,
  CornerIcons,
  CornerIconButton,
  AfterAnswerFooter,
  WordActions,
  PrimaryExerciseButton,
  CenteredRevealedSlot,
  TopProgressSlot,
  WordLearnedLine,
};

export default StyledButton;
