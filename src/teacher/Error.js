import React from "react";
import * as s from "./Error.sc";

export const Error = ({ message }) => {
  return (
    <s.StyledError>
      <p className="error-message-name">{message}</p>
    </s.StyledError>
  );
};
