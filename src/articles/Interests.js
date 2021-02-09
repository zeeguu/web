import TagsOfInterests from "./TagsOfInterests";
import TagsOfFilters from "./TagsOfFilters";
import { useState } from "react";

import * as s from "./Interests.sc";
import * as b from "./Buttons.sc";

export default function InterestsAndSearch({ zapi, articlesListShouldChange }) {
  const [showingInterests, setShowingInterests] = useState(false);
  const [showingFilters, setShowingFilters] = useState(false);

  function toggleInterests() {
    if (showingFilters) {
      return;
    }
    setShowingInterests(!showingInterests);
  }

  function toggleFilters() {
    if (showingInterests) {
      return;
    }
    setShowingFilters(!showingFilters);
  }

  function closeTagsOfInterestAndNotifyArticleListOfChange() {
    articlesListShouldChange();
    toggleInterests();
  }

  return (
    <s.Interests>
      <b.OrangeRoundButton onClick={(e) => toggleInterests()}>
        Interests
      </b.OrangeRoundButton>

      <b.OrangeRoundButton onClick={(e) => toggleFilters()}>
        Non-interests
      </b.OrangeRoundButton>

      <TagsOfInterests
        visible={showingInterests}
        zapi={zapi}
        articlesListShouldChange={
          closeTagsOfInterestAndNotifyArticleListOfChange
        }
      />
      <TagsOfFilters
        visible={showingFilters}
        zapi={zapi}
        articlesListShouldChange={
          closeTagsOfInterestAndNotifyArticleListOfChange
        }
      />
    </s.Interests>
  );
}
