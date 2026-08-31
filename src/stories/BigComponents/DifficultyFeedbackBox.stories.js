import DifficultyFeedbackBox from "../../reader/DifficultyFeedbackBox";

export default { title: "BigComponents/DifficultyFeedbackBox", component: DifficultyFeedbackBox };

const noop = () => {};

export const TooEasy = {
  render: () => (
    <DifficultyFeedbackBox articleInfo={{ relative_difficulty: 1 }} updateArticleDifficultyFeedback={noop} />
  ),
};

export const JustRight = {
  render: () => (
    <DifficultyFeedbackBox articleInfo={{ relative_difficulty: 3 }} updateArticleDifficultyFeedback={noop} />
  ),
};

export const TooHard = {
  render: () => (
    <DifficultyFeedbackBox articleInfo={{ relative_difficulty: 5 }} updateArticleDifficultyFeedback={noop} />
  ),
};
