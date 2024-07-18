import React from "react";
import * as s from "./SearchKeyWords.cs";
import SingleSearchKeyWord from "./SingleSearchKeyWord";

export default function SearchKeyWords({ associatedKeywords }) {
  let allKeywordsButLast = Object.entries(associatedKeywords).slice(0, -1);
  let lastKeyWord = Object.entries(associatedKeywords).pop();

  return (
    <s.ContainerKeywords>
      {allKeywordsButLast.map((associatedKeywords) => (
        <SingleSearchKeyWord
          key={associatedKeywords[0]}
          text={associatedKeywords[1]}
          addSeperator={true}
        />
      ))}

      <SingleSearchKeyWord text={lastKeyWord[1]} />
    </s.ContainerKeywords>
  );
}
