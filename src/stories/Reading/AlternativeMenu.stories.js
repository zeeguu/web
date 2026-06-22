import AlterMenu from "../../reader/AlterMenu";
import "../../index.css";

const baseWord = {
  translation: "house",
  alternatives: [
    { translation: "home", source: "Google - v1" },
    { translation: "dwelling", source: "Microsoft - v2" },
  ],
  competing_translations: null,
  disagreement: false,
  mergedTokens: [],
  _llmAsked: null,
};

export default { title: "Reader/AlterMenu", component: AlterMenu };

export const NoAlternatives = {
  render: () => <AlterMenu word={{ ...baseWord, alternatives: [], competing_translations: [] }} />,
};

export const WithAlternatives = {
  render: () => <AlterMenu word={baseWord} />,
};

export const AskingLLM = {
  render: () => <AlterMenu word={{ ...baseWord, _llmAsked: false }} askLlmTranslation={true} />,
};
