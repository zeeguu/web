import { useContext, useEffect, useState } from "react";
import useQuery from "../../hooks/useQuery";
import Tag from "../_pages_shared/Tag.sc";
import TagContainer from "../_pages_shared/TagContainer.sc";
import useSelectInterest from "../../hooks/useSelectInterest";
import CardPage from "../_pages_shared/CardPage";
import Main from "../_pages_shared/Main.sc";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import BackArrow from "./settings_pages_shared/BackArrow";
import { setTitle } from "../../assorted/setTitle";
import { APIContext } from "../../contexts/APIContext";

import { SectionHeading, SectionDescription, SectionContainer } from "./FeedPreferences.sc";

import useUnwantedContentPreferences from "../../hooks/useUnwantedContentPreferences";
import useFormField from "../../hooks/useFormField";

import Form from "../_pages_shared/Form.sc";
import Button from "../_pages_shared/Button.sc";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { FormControlLabel, Checkbox } from "@mui/material";

import InputField from "../../components/InputField";

import strings from "../../i18n/definitions";

export default function FeedPreferences() {
  const api = useContext(APIContext);
  const { allTopics, toggleTopicSubscription, isSubscribed } = useSelectInterest(api);
  const isFromArticles = useQuery().get("fromArticles") === "1";

  const { unwantedKeywords, addUnwantedKeyword, removeUnwantedKeyword } = useUnwantedContentPreferences(api);

  const [excludedWord, setExcludedWord, resetExcludedWord] = useFormField("");

  const [filterDisturbingContent, setFilterDisturbingContent] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  useEffect(() => {
    setTitle("Feed Preferences");
  }, []);

  useEffect(() => {
    // Load user preferences
    api.getUserPreferences().then((preferences) => {
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
      },
    );
  }

  return (
    <CardPage layoutVariant={"minimalistic-top-aligned"} isTransparent reducedPadding>
      <BackArrow redirectLink={isFromArticles && "/articles"} />
      <Header withoutLogo>
        <Heading>Feed Preferences</Heading>
      </Header>
      <Main>
        <SectionContainer>
          <SectionHeading>Topics of Interest</SectionHeading>
          {/*<SectionDescription>Show me articles about the following topics:</SectionDescription>*/}
          <TagContainer>
            {allTopics.map((topic) => (
              <Tag
                key={topic.id}
                className={isSubscribed(topic) && "selected"}
                onClick={() => toggleTopicSubscription(topic)}
              >
                {topic.title}
              </Tag>
            ))}
          </TagContainer>
        </SectionContainer>
        <SectionContainer>
          <SectionHeading>Keywords to Avoid</SectionHeading>
          <Form>
            <InputField
              value={excludedWord}
              onChange={(e) => {
                setExcludedWord(e.target.value);
              }}
              helperText={strings.addUnwantedWordHelperText}
              placeholder={strings.unwantedWordPlaceholder}
            >
              <Button className="small-square-btn" onClick={handleAddNewSearchFilter}>
                <AddRoundedIcon />
              </Button>
            </InputField>
          </Form>
          <TagContainer>
            {unwantedKeywords.map((keyword) => (
              <div key={keyword.id} id={keyword.id}>
                <Tag className={"outlined-blue small"} onClick={() => removeUnwantedKeyword(keyword)}>
                  {keyword.search}
                  <HighlightOffRoundedIcon fontSize="small" />
                </Tag>
              </div>
            ))}
          </TagContainer>
          <br />
          <div style={{ marginTop: "0", marginBottom: "0" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterDisturbingContent}
                  onChange={handleToggleDisturbingContent}
                  disabled={!preferencesLoaded}
                />
              }
              label="Avoid disturbing news (violence, death, disasters)"
              sx={{ "& .MuiTypography-root": { fontFamily: "inherit" } }}
            />
            <div style={{ fontSize: "0.9em", color: "var(--text-secondary)", marginLeft: "32px", marginTop: "0.25em" }}>
              When enabled, articles about violence, war, accidents, and other disturbing topics will be hidden from
              your recommendations.
            </div>
          </div>
        </SectionContainer>
      </Main>
    </CardPage>
  );
}
