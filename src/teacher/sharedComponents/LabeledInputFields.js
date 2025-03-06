import React, { Fragment } from "react";
import { TextField } from "@mui/material";
import * as s from "../styledComponents/LabeledInputFields.sc";

export const LabeledTextField = (props) => {
  return (
    <Fragment>
      <s.LabeledInputFields>
        <div className="input-container">
          <label htmlFor={props.name}>{props.children}</label>
          <TextField
            InputProps={{ disableUnderline: true }}
            className="input-field"
            aria-label={props.name}
            value={props.value}
            onChange={props.onChange}
            name={props.name}
            id={props.name}
            placeholder={props.placeholder}
            fullWidth
            type="text"
            required
          />
        </div>
      </s.LabeledInputFields>
    </Fragment>
  );
};

export const LabeledMultiLineTextField = (props) => {
  return (
    <Fragment>
      <s.LabeledInputFields>
        <div className="input-container">
          <label htmlFor={props.name}>{props.children}</label>
          <TextField
            InputProps={{ disableUnderline: true }}
            className="input-field"
            aria-label={props.name}
            value={props.value}
            onChange={props.onChange}
            name={props.name}
            id={props.name}
            placeholder={props.placeholder}
            multiline={true}
            rows={15}
            fullWidth
            type="text"
            required
          />
        </div>
      </s.LabeledInputFields>
    </Fragment>
  );
};
