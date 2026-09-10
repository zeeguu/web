import TranslationDisplay from "../../reader/TranslationDisplay";
import "../../index.css";

const baseWord = {
  id: 1,
  isTranslationVisible: true,
  mergedTokens: [],
  mweExpression: false,
};

export default {
  title: "BigComponents/TranslationDisplay",
  component: TranslationDisplay,
};

export const Default = {
  render: () => <TranslationDisplay translation="casa" isTranslationVisible={true} word={baseWord} />,
};
