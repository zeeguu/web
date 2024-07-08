import React from "react";
import * as s from "./SearchKeyWords.cs";

function SearchKeyWords({ associatedKeywords }) {
  let allKeywordsButLast = Object.entries(associatedKeywords).slice(0, -1);
  let lastKeyWord = Object.entries(associatedKeywords).pop();

  return (
    <s.ContainerKeywords>
      {allKeywordsButLast.map((associatedKeywords) => (
        <Keywords
          key={associatedKeywords[0]}
          text={associatedKeywords[1]}
          addSeperator={true}
        />
      ))}

      <Keywords text={lastKeyWord[1]} />
    </s.ContainerKeywords>
  );
}

function Keywords({ text, addSeperator }) {
  return (
    <s.ContainerKeywords>
      <s.KeyWordText>{text}</s.KeyWordText>
      {addSeperator && <hr style={{ color: "black" }}></hr>}
    </s.ContainerKeywords>
  );
}

export { SearchKeyWords, Keywords };
