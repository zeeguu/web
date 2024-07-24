import React from "react";
import * as s from "./SearchKeyWords.cs";

export default function SingleSearchKeyword({ text, addSeparator }) {
  return (
    <s.ContainerKeywords>
      <s.KeyWordText>{text}</s.KeyWordText>
      {addSeparator && <hr style={{ color: "black" }}></hr>}
    </s.ContainerKeywords>
  );
}
