import OutOfWordsMessage from "../../exercises/OutOfWordsMessage";

export default {
  title: "Pages/OutOfWordsMessage",
  component: OutOfWordsMessage,
};

export const Default = {
  render: () => <OutOfWordsMessage hasAnyWords={true} />,
};

export const NoWords = {
  render: () => <OutOfWordsMessage hasAnyWords={false} />,
};
