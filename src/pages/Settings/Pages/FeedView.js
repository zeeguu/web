import { useEffect, useState } from "react";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import { setTitle } from "../../../assorted/setTitle";
import LocalStorage from "../../../assorted/LocalStorage";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

// The three feed browsing modes, in recommended order. Stored per-device via
// LocalStorage.getBrowsingMode / setBrowsingMode (default: "preview"). Read by
// ArticleListBrowser, which maps the value to ArticlePreview's props.
const VIEW_OPTIONS = [
  {
    value: "titles",
    label: "Headlines",
    description: "Title and image only. Tap a card to open an interactive preview.",
  },
  {
    value: "preview",
    label: "Preview",
    description: "Title, image and a short summary. Tap to open the interactive preview.",
  },
  {
    value: "interactive",
    label: "Interactive",
    description: "Full cards with tappable words — translate and listen right in the feed.",
  },
];

export default function FeedView() {
  const [mode, setMode] = useState(LocalStorage.getBrowsingMode());

  useEffect(() => {
    setTitle("View");
  }, []);

  function handleChange(e) {
    const value = e.target.value;
    LocalStorage.setBrowsingMode(value);
    setMode(value);
  }

  return (
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <SettingsPageHeader title="View" />
      <Main>
        <RadioGroup value={mode} onChange={handleChange}>
          {VIEW_OPTIONS.map((opt) => (
            <div key={opt.value} style={{ marginBottom: "0.9em" }}>
              <FormControlLabel
                value={opt.value}
                control={<Radio />}
                label={opt.label}
                sx={{ "& .MuiTypography-root": { fontFamily: "inherit", fontWeight: 500 } }}
              />
              <div
                style={{
                  fontSize: "0.9em",
                  color: "var(--text-secondary)",
                  marginLeft: "32px",
                  marginTop: "-0.15em",
                }}
              >
                {opt.description}
              </div>
            </div>
          ))}
        </RadioGroup>
      </Main>
    </CardPage>
  );
}
