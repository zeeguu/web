import ErrorDialog from "../../components/ErrorDialog";
import "../../index.css";

export default {
  title: "Dialogs/ErrorDialog",
  component: ErrorDialog,
};

export const Default = {
  args: {
    title: "Could not open video",
  },
};
