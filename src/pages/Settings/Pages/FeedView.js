import { useEffect, useState } from "react";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import { setTitle } from "../../../assorted/setTitle";
import LocalStorage from "../../../assorted/LocalStorage";
import RadioGroup from "../../../components/RadioGroup/RadioGroup";

// The three feed browsing modes, in recommended order. Stored per-device via
// LocalStorage.getBrowsingMode / setBrowsingMode (default: "preview"). Read by
// ArticleListBrowser, which maps the value to ArticlePreview's props.
//
// Feed-only on purpose: how text behaves once you are reading it (translation,
// pronunciation, highlighting, size) is a separate, app-wide preference set —
// see Pages/ReadingSettings.js.
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
        <RadioGroup
          variant="card"
          name="feed-view"
          ariaLabel="Feed view"
          options={VIEW_OPTIONS}
          selectedValue={mode}
          onChange={handleChange}
          optionId={(option) => `feed-view-${option.value}`}
          optionValue={(option) => option.value}
          optionLabel={(option) => option.label}
          optionDescription={(option) => option.description}
        />
      </Main>
    </CardPage>
  );
}
