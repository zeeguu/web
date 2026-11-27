import LearnedWordCard from "./LearnedWordCard";

export default {
  title: "Exercises/LearnedWordCard",
  component: LearnedWordCard,
  decorators: [(Story) => <div style={{ width: 390, height: 320, display: "flex", flexDirection: "column" }}>{Story()}</div>],
};

export const Default = {
  args: { bookmark: { id: 1, from: "slå op", to: "to look up" } },
};

export const LongPhrase = {
  args: { bookmark: { id: 2, from: "lade være med at", to: "refrain from" } },
};
