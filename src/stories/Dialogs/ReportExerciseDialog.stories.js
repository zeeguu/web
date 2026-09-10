import ReportExerciseDialog from "../../exercises/exerciseTypes/ReportExerciseDialog";

export default {
  title: "Dialogs/ReportExerciseDialog",
  component: ReportExerciseDialog,
};

export const BeforeExercise = {
  render: () => <ReportExerciseDialog open={true} onClose={() => {}} isExerciseOver={false} />,
};

export const AfterExercise = {
  render: () => <ReportExerciseDialog open={true} onClose={() => {}} isExerciseOver={true} />,
};
