import React, { useState, useEffect } from "react";
import * as s from "./SubscribeSearchButton.sc";
import useSelectInterest from "../hooks/useSelectInterest";
import { toast } from "react-toastify";

export default function SubscribeToEmailNotifications({ api, searchTerm }) {
  const { subscribedSearches, subscribeToEmail, unsubscribeFromEmail } =
    useSelectInterest(api);
  const [textButton, setTextButton] = useState("");
  const [isSubscribedToEmail, setIsSubscribedToEmail] = useState();

  console.log("this ", subscribedSearches);
  useEffect(() => {
    if (subscribedSearches) {
      const subscribedSearch = subscribedSearches.find(
        (search) => search.search === searchTerm,
      );
      if (subscribedSearch) {
        setIsSubscribedToEmail(subscribedSearch.receive_email);
      }
    }
  }, [subscribedSearches, searchTerm]);

  useEffect(() => {
    setTextButton(
      isSubscribedToEmail
        ? " remove email notifications!"
        : " want email notifications?",
    );
  }, [isSubscribedToEmail]);

  const toggleEmailSubscription = (searchTerm) => {
    if (isSubscribedToEmail) {
      unsubscribeFromEmail(searchTerm);
      setIsSubscribedToEmail(false);
      toast("You will no longer receive update emails!");
    } else {
      subscribeToEmail(searchTerm);
      setIsSubscribedToEmail(true);
      toast("You will now receive emails whenever there are new articles!");
    }
  };

  return (
    <s.AddRemoveButton
      onClick={(e) => toggleEmailSubscription(searchTerm)}
      style={{ fontWeight: "normal" }}
    >
      {textButton}
    </s.AddRemoveButton>
  );
}
