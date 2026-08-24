import * as sOW from "../../exercises/exerciseTypes/orderWords/ExerciseTypeOW.sc.js";
import OrderWordsInput from "../../exercises/exerciseTypes/orderWords/OrderWordsInput";

const wordPool = [
  { id: 1, word: "The", status: "normal", inUse: false, feedback: "" },
  { id: 2, word: "cat", status: "normal", inUse: false, feedback: "" },
  { id: 3, word: "is", status: "normal", inUse: false, feedback: "" },
  { id: 4, word: "sleeping", status: "normal", inUse: false, feedback: "" },
];

const sentencePreview = [
  { id: 1, word: "The", status: "correct", inUse: true, feedback: "" },
  { id: 2, word: "cat", status: "incorrect", inUse: true, feedback: "A noun comes here." },
  { id: 3, word: "is", status: "normal", inUse: false, feedback: "" },
  { id: 4, word: "sleeping", status: "normal", inUse: false, feedback: "" },
];

export default {
  title: "Exercises/OrderWordsInput",
  component: OrderWordsInput,
  args: {
    buttonOptions: wordPool,
    isWordSoup: false,
    isCorrect: false,
  },
};

export const Default = {
  render: (args) => (
    <sOW.ExerciseOW>
      <OrderWordsInput {...args} />
    </sOW.ExerciseOW>
  ),
};

export const WordSoup = {
  render: (args) => (
    <sOW.ExerciseOW>
      <OrderWordsInput {...args} />
    </sOW.ExerciseOW>
  ),
  args: {
    buttonOptions: wordPool,
    isWordSoup: true,
  },
};

export const Constructed = {
  render: (args) => (
    <sOW.ExerciseOW>
      <OrderWordsInput {...args} />
    </sOW.ExerciseOW>
  ),
  args: {
    buttonOptions: sentencePreview,
    isWordSoup: false,
  },
};
