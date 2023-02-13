import React from "react";
import * as s from "./LevelLabel.sc";

export const levels = {
  easy: "easy",
  challenging: "challenging",
  fair: "fair",
};

export const LevelLabel = ({ level }) => {
  return <s.LevelLabel level={level}>{levels[level]}</s.LevelLabel>;
};
