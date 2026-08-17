import ExerciseSessionProgressBar from "../../exercises/ExerciseSessionProgressBar";

export default {
  title: "BigComponents/ExerciseSessionProgressBar",
  component: ExerciseSessionProgressBar,
};

export const Default = {
  render: () => <ExerciseSessionProgressBar index={3} total={6} />,
};
