import ReportDialog from "../../components/ReportDialog";
import "../../index.css";

export default {
  title: "Dialogs/ReportDialog",
  component: ReportDialog,
};

export const Default = {
  args: {
    open: true,
    title: "Report broken article",
    onClose: () => {},
    onFeedbackChange: () => {},
    onSubmit: () => {},
    feedback: "",
    isSubmitting: false,
    isFeedbackSent: false,
    reportInfo: null,
    error: null,
  },
};
