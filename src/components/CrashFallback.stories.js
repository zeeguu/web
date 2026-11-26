import { fn } from "storybook/test";
import CrashFallback from "./CrashFallback";

export default {
  title: "Feedback/CrashFallback",
  component: CrashFallback,
  args: {
    onBackToHome: fn(),
  },
};

export const Default = {};
