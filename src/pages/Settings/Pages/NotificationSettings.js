import { useContext, useEffect, useState } from "react";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import { setTitle } from "../../../assorted/setTitle";
import { APIContext } from "../../../contexts/APIContext";
import { SectionContainer, SectionHeading } from "./FeedPreferences.sc";
import { FormControlLabel, Checkbox } from "@mui/material";

export default function NotificationSettings() {
  const api = useContext(APIContext);
  const [emailOnArticleShared, setEmailOnArticleShared] = useState(true);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  useEffect(() => {
    setTitle("Email Notifications");
  }, []);

  useEffect(() => {
    api.getUserPreferences().then((preferences) => {
      // Default ON (opt-out): only an explicit "false" turns it off.
      setEmailOnArticleShared(preferences.email_on_article_shared !== "false");
      setPreferencesLoaded(true);
    });
  }, [api]);

  function handleToggleEmailOnArticleShared(e) {
    const newValue = e.target.checked;
    setEmailOnArticleShared(newValue);
    api.saveUserPreferences(
      { email_on_article_shared: newValue ? "true" : "false" },
      () => {},
      () => setEmailOnArticleShared(!newValue), // revert on error
    );
  }

  return (
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <SettingsPageHeader title="Email Notifications" />
      <Main>
        <SectionContainer>
          <SectionHeading>Email notifications</SectionHeading>
          <div style={{ marginTop: "0", marginBottom: "0" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={emailOnArticleShared}
                  onChange={handleToggleEmailOnArticleShared}
                  disabled={!preferencesLoaded}
                />
              }
              label="Email me when a friend shares an article with me"
              sx={{ "& .MuiTypography-root": { fontFamily: "inherit" } }}
            />
            <div style={{ fontSize: "0.9em", color: "var(--text-secondary)", marginLeft: "32px", marginTop: "0.25em" }}>
              You'll get at most one email while you have unread shares — further shares wait in your inbox until you
              open it.
            </div>
          </div>
        </SectionContainer>
      </Main>
    </CardPage>
  );
}
