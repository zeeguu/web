import * as s from "./Exercise.sc";
import IosShareIcon from "@mui/icons-material/IosShare";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";

export default {
  title: "Buttons/ExerciseButtons",
};

export const OrangeButton = {
  render: () => (
    <div>
      <s.OrangeButton>Orange button</s.OrangeButton>
    </div>
  ),
};

export const FeedbackButton = {
  render: () => (
    <div>
      <s.FeedbackButton>Next</s.FeedbackButton>
    </div>
  ),
};

export const StyledGreyButton = {
  render: () => (
    <div>
      <s.StyledGreyButton>Show solution</s.StyledGreyButton>
    </div>
  ),
};

export const BlueButton = {
  render: () => (
    <div>
      <s.BlueButton>Change example</s.BlueButton>
    </div>
  ),
};

export const MatchButton = {
  render: () => (
    <div>
      <s.MatchButton>Match option</s.MatchButton>
    </div>
  ),
};

export const LeftFeedbackButton = {
  render: () => (
    <div>
      <s.LeftFeedbackButton>Hint</s.LeftFeedbackButton>
    </div>
  ),
};
export const RightFeedbackButton = {
  render: () => (
    <div>
      <s.RightFeedbackButton>Check</s.RightFeedbackButton>
    </div>
  ),
};

// Share and Report, as gray icons in the exercise card's top-right corner.
export const CornerIconButton = {
  render: () => (
    <div style={{ display: "flex", gap: "0.25rem" }}>
      <s.CornerIconButton aria-label="Share exercise">
        <IosShareIcon fontSize="small" />
      </s.CornerIconButton>
      <s.CornerIconButton aria-label="Report a problem with this exercise">
        <FlagOutlinedIcon fontSize="small" />
      </s.CornerIconButton>
    </div>
  ),
};

// The one main action at the bottom of the card: Show answer, Next.
export const PrimaryExerciseButton = {
  render: () => (
    <div>
      <s.PrimaryExerciseButton>Next</s.PrimaryExerciseButton>
    </div>
  ),
};

export const AnimatedOrangeButton = {
  render: () => (
    <div>
      <s.AnimatedOrangeButton>Wrong answer</s.AnimatedOrangeButton>
    </div>
  ),
};
export const AnimatedMatchButton = {
  render: () => (
    <div>
      <s.AnimatedMatchButton>Wrong match</s.AnimatedMatchButton>
    </div>
  ),
};

export const AnimatedInput = {
  render: () => (
    <div>
      <s.AnimatedInput placeholder="Type your answer" />
    </div>
  ),
};
