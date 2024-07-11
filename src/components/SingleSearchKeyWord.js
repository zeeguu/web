import React from "react";
import * as s from "./SearchKeyWords.cs";

export default function Keywords({ text, addSeperator }) {
  return (
    <s.ContainerKeywords>
      <s.KeyWordText>{text}</s.KeyWordText>
      {addSeperator && <hr style={{ color: "black" }}></hr>}
    </s.ContainerKeywords>
  );
}
