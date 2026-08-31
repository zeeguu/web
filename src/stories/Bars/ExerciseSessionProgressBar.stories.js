import ExerciseSessionProgressBar from "../../exercises/ExerciseSessionProgressBar";

export default {
  title: "Bars/ExerciseSessionProgressBar",
  component: ExerciseSessionProgressBar,
};

export const Default = {
  render: () => <ExerciseSessionProgressBar index={3} total={6} />,
};
