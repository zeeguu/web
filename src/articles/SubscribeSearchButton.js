import React, { useState, useEffect } from "react";
import * as s from "./SubscribeSearchButton.sc";
import useSelectInterest from "../hooks/useSelectInterest";
import { toast } from "react-toastify";

export default function SubscribeSearchButton({ api, query }) {
  const { subscribedSearches, removeSearch, subscribeToSearch } =
    useSelectInterest(api);

  const [textButton, setTextButton] = useState("");
  const [isSubscribedToSearch, setIsSubscribedToSearch] = useState();

  useEffect(() => {
    if (subscribedSearches) {
      const isSubscribed = subscribedSearches.some(
        (search) => search.search === query,
      );
      setIsSubscribedToSearch(isSubscribed);
      setTextButton(isSubscribed ? "- remove search" : "+ add search");
    }
  }, [subscribedSearches, query]);

  const toggleSearchSubscription = (query) => {
    if (isSubscribedToSearch) {
      const searchToRemove = subscribedSearches.find(
        (search) => search.search === query,
      );
      if (searchToRemove) {
        removeSearch(searchToRemove);
        setIsSubscribedToSearch(false);
        toast("Search removed from My Searches!");
      }
    } else {
      subscribeToSearch(query);
      setIsSubscribedToSearch(true);
      toast("Search added to My Searches!");
    }
  };

  return (
    <s.AddRemoveButton onClick={(e) => toggleSearchSubscription(query)}>
      {textButton}
    </s.AddRemoveButton>
  );
}
