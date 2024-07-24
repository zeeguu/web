import React from "react";
import * as s from "./SearchKeyWords.cs";
import SingleSearchKeyword from "./SingleSearchKeyword";

export default function AssociatedKeywords({ associatedKeywords }) {
  let allKeywordsButLast = Object.entries(associatedKeywords).slice(0, -1);
  let lastKeyWord = Object.entries(associatedKeywords).pop();

  return (
    <s.ContainerKeywords>
      {allKeywordsButLast.map((associatedKeywords) => (
        <SingleSearchKeyword
          key={associatedKeywords[0]}
          text={associatedKeywords[1]}
          addSeparator={true}
        />
      ))}

      <SingleSearchKeyword text={lastKeyWord[1]} />
    </s.ContainerKeywords>
  );
}
