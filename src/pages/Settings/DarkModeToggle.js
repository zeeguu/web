import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import * as s from "./DarkModeToggle.sc";

const OPTIONS = [
  { value: "light", label: "Light" },
  { value: "auto", label: "Auto" },
  { value: "dark", label: "Dark" },
];

export default function DarkModeToggle() {
  const { preference, setPreference } = useContext(ThemeContext);

  return (
    <s.ToggleRow>
      <span>Theme</span>
      <s.SegmentedControl>
        {OPTIONS.map((opt) => (
          <s.SegmentButton
            key={opt.value}
            $active={preference === opt.value}
            onClick={() => setPreference(opt.value)}
          >
            {opt.label}
          </s.SegmentButton>
        ))}
      </s.SegmentedControl>
    </s.ToggleRow>
  );
}
