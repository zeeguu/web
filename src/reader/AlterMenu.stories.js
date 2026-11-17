import AlterMenu from "./AlterMenu";

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

export default { title: "BigComponents/AlterMenu", component: AlterMenu };

export const NoAlternatives = {
  render: () => <AlterMenu word={{ ...baseWord, alternatives: [], competing_translations: [] }} />,
};

export const WithAlternatives = {
  render: () => <AlterMenu word={baseWord} />,
};

export const LoadingAlternatives = {
  render: () => <AlterMenu word={{ ...baseWord, alternatives: [] }} loadingAlternatives={true} />,
};
