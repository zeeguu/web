import EmptyMessageState from "../components/EmptyMessageState";

export default function OutOfWordsMessage({ hasAnyWords = true }) {
  if (!hasAnyWords) {
    return (
      <EmptyMessageState message="Start by reading an article and translating some words. They'll appear here for practice!" />
    );
  }

  return (
    <EmptyMessageState message="Words are scheduled according to spaced-repetition principles. You've practiced all the words due for now 🎉" />
  );
}
