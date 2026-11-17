import EmptyState from "./EmptyState";

export default {
  title: "Feedback/EmptyState",
  component: EmptyState,
  args: {
    message: "Start by reading an article and translating some words. They'll appear here for practice!",
    fillHeight: false,
  },
};

export const MessageOnly = {};

export const WithTitle = {
  args: {
    title: "No articles at A0 yet",
  },
};

export const WithAction = {
  args: {
    title: "No texts in this class",
    message: "Your teacher hasn't added texts in this language yet.",
    children: <button style={{ marginTop: "1rem" }}>Switch language</button>,
  },
};
