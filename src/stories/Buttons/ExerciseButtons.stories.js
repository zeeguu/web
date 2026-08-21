import * as s from "../../exercises/exerciseTypes/Exercise.sc";

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

export const ReportButton = {
  render: () => (
    <div>
      <s.ReportButton>Report</s.ReportButton>
    </div>
  ),
};

export const ReportedBadge = {
  render: () => (
    <div>
      <s.ReportedBadge>Reported</s.ReportedBadge>
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
