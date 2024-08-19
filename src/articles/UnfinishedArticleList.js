import React, { useState, useEffect, useContext } from "react";
import ArticlePreview from "./ArticlePreview";

import ExtensionMessage from "./ExtensionMessage";
import LocalStorage from "../assorted/LocalStorage";
import { APIContext } from "../contexts/APIContext";
import useExtensionCommunication from "../hooks/useExtensionCommunication";
import * as s from "./UnfinishedArticleList.sc";

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
    api.getUserUnfinishedReadingSessions((articles) =>
      setUnreadArticleList(articles),
    );
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
        <h1>Unfinished Articles</h1>
        {unreadArticleList.map((each, index) => (
          <ArticlePreview
            key={each.id}
            article={each}
            api={api}
            hasExtension={isExtensionAvailable}
            doNotShowRedirectionModal_UserPreference={
              doNotShowRedirectionModal_UserPreference
            }
            setDoNotShowRedirectionModal_UserPreference={
              setDoNotShowRedirectionModal_UserPreference
            }
            onArticleClick={() => {}}
            isUnfinishedArticle={true}
          />
        ))}
      </s.UnfinishedArticlesBox>
    </>
  );
}
