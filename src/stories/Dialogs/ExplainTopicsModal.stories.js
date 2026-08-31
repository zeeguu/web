import ExplainTopicsModal from "../../pages/ExplainTopicsModal";

export default {
  title: "Dialogs/ExplainTopicsModal",
  component: ExplainTopicsModal,
};

export const Default = {
  render: () => <ExplainTopicsModal showInfoTopics={true} infoTopicClick="Science" />,
};
