import EmptyMessageState from "../../components/EmptyMessageState";

export default {
  title: "Messages/EmptyMessageState",
  component: EmptyMessageState,
  args: {
    message: "some message",
    fillHeight: true,
  },
};

export const Default = {
  args: {
    message: "The exercise is empty!",
  },
};
