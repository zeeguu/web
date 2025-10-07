import { useContext, useEffect, useState } from "react";
import useUnwantedContentPreferences from "../../hooks/useUnwantedContentPreferences";
import useFormField from "../../hooks/useFormField";
import useQuery from "../../hooks/useQuery";

import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import Form from "../_pages_shared/Form.sc";
import Button from "../_pages_shared/Button.sc";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { FormControlLabel, Checkbox } from "@mui/material";

import InputField from "../../components/InputField";
import Tag from "../_pages_shared/Tag.sc";
import TagContainer from "../_pages_shared/TagContainer.sc";

import strings from "../../i18n/definitions";
import BackArrow from "./settings_pages_shared/BackArrow";
import { setTitle } from "../../assorted/setTitle";
import { APIContext } from "../../contexts/APIContext";

export default function ExcludedKeywords() {
  const api = useContext(APIContext);
  const { unwantedKeywords, addUnwantedKeyword, removeUnwantedKeyword } =
    useUnwantedContentPreferences(api);

  const [excludedWord, setExcludedWord, , , , resetExcludedWord] =
    useFormField("");

  const [filterDisturbingContent, setFilterDisturbingContent] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  const isFromArticles = useQuery().get("fromArticles") === "1";

  useEffect(() => {
    setTitle(strings.excludedKeywords);

    // Load user preferences
    api.getUserPreferences((preferences) => {
      setFilterDisturbingContent(preferences.filter_disturbing_content === "true");
      setPreferencesLoaded(true);
    });
  }, [api]);

  function handleAddNewSearchFilter(e) {
    e.preventDefault();
    if (excludedWord) {
      addUnwantedKeyword(excludedWord);
      resetExcludedWord();
    }
  }

  function handleToggleDisturbingContent(e) {
    const newValue = e.target.checked;
    setFilterDisturbingContent(newValue);

    // Save preference to backend
    api.saveUserPreferences(
      { filter_disturbing_content: newValue ? "true" : "false" },
      () => {
        console.log("Disturbing content filter updated:", newValue);
      },
      (error) => {
        console.error("Failed to update disturbing content filter:", error);
        // Revert on error
        setFilterDisturbingContent(!newValue);
      }
    );
  }
  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow redirectLink={isFromArticles && "/articles"} />
      <Header withoutLogo>
        <Heading>{strings.excludedKeywords}</Heading>
      </Header>
      <Main>
        <div style={{ marginBottom: "1.5em" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filterDisturbingContent}
                onChange={handleToggleDisturbingContent}
                disabled={!preferencesLoaded}
              />
            }
            label="Filter disturbing news (violence, death, disasters)"
          />
          <div style={{ fontSize: "0.9em", color: "#666", marginLeft: "32px", marginTop: "0.25em" }}>
            When enabled, articles about violence, war, accidents, and other disturbing topics will be hidden from your recommendations.
          </div>
        </div>
        <Form>
          <InputField
            value={excludedWord}
            onChange={(e) => {
              setExcludedWord(e.target.value);
            }}
            helperText={strings.addUnwantedWordHelperText}
            placeholder={strings.unwantedWordPlaceholder}
          >
            <Button
              className="small-square-btn"
              onClick={handleAddNewSearchFilter}
            >
              <AddRoundedIcon />
            </Button>
          </InputField>
        </Form>
        <TagContainer>
          {unwantedKeywords.map((keyword) => (
            <div key={keyword.id} id={keyword.id}>
              <Tag
                className={"outlined-blue small"}
                onClick={() => removeUnwantedKeyword(keyword)}
              >
                {keyword.search}
                <HighlightOffRoundedIcon fontSize="small" />
              </Tag>
            </div>
          ))}
        </TagContainer>
      </Main>
    </PreferencesPage>
  );
}
