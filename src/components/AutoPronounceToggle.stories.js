import { fn } from "storybook/test";
import AutoPronounceToggle from "./AutoPronounceToggle";

export default {
  title: "Exercises/AutoPronounceToggle",
  component: AutoPronounceToggle,
  args: { onToggle: fn() },
};

export const Off = { args: { enabled: false } };

export const On = { args: { enabled: true } };

// On a card whose prompt is the L2 word, which is spoken as it appears.
export const OnCardFront = { args: { enabled: true, label: "Auto-pronounce word" } };
