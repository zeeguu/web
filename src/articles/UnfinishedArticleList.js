import React, { useState, useEffect, useContext } from "react";

import ExtensionMessage from "./ExtensionMessage";
import LocalStorage from "../assorted/LocalStorage";
import { APIContext } from "../contexts/APIContext";
import useExtensionCommunication from "../hooks/useExtensionCommunication";
import * as s from "./UnfinishedArticleList.sc";
import UnfinishedArticlePreview from "./UnfinishedArticlePreview";

export default function UnfinishedArticlesList({}) {
  let api = useContext(APIContext);

  const doNotShowRedirectionModal_LocalStorage =
    LocalStorage.getDoNotShowRedirectionModal() === "true" ? true : false;
  const [unreadArticleList, setUnreadArticleList] = useState();
  const [isExtensionAvailable] = useExtensionCommunication();
  const [extensionMessageOpen, setExtensionMessageOpen] = useState(false);
  const [displayedExtensionPopup, setDisplayedExtensionPopup] = useState(false);
  const [
    doNotShowRedirectionModal_UserPreference,
    setDoNotShowRedirectionModal_UserPreference,
  ] = useState(doNotShowRedirectionModal_LocalStorage);

  useEffect(() => {
    LocalStorage.setDoNotShowRedirectionModal(
      doNotShowRedirectionModal_UserPreference,
    );
  }, [doNotShowRedirectionModal_UserPreference]);

  useEffect(() => {
    setDisplayedExtensionPopup(LocalStorage.displayedExtensionPopup());
    console.log(
      "Localstorage displayed extension: " +
        LocalStorage.displayedExtensionPopup(),
    );
    api.getUnfinishedUserReadingSessions((articles) => {
      setUnreadArticleList(articles);
    });
  }, []);
  useEffect(() => {
    if (!isExtensionAvailable) {
      setExtensionMessageOpen(true);
    }
  }, [isExtensionAvailable]);

  if (unreadArticleList === undefined || unreadArticleList.length == 0) {
    return <></>;
  }

  return (
    <>
      <ExtensionMessage
        open={extensionMessageOpen}
        hasExtension={isExtensionAvailable}
        displayedExtensionPopup={displayedExtensionPopup}
        setExtensionMessageOpen={setExtensionMessageOpen}
        setDisplayedExtensionPopup={setDisplayedExtensionPopup}
      ></ExtensionMessage>
      <s.UnfinishedArticlesBox>
        <s.UnfishedArticleBoxTitle>
          Continue where you left off
        </s.UnfishedArticleBoxTitle>
        {unreadArticleList.map((each, index) => (
          <UnfinishedArticlePreview
            key={each.id}
            article={each}
            hasExtension={isExtensionAvailable}
            api={api}
            doNotShowRedirectionModal_UserPreference={
              doNotShowRedirectionModal_UserPreference
            }
            setDoNotShowRedirectionModal_UserPreference={
              setDoNotShowRedirectionModal_UserPreference
            }
            onArticleClick={() => {
              api.logUserActivity(api.CLICKED_RESUME_ARTICLE, each.id, "", "");
            }}
          />
        ))}
      </s.UnfinishedArticlesBox>
    </>
  );
}
