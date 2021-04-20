import React, { Fragment } from "react";
import { TextField } from "@material-ui/core";
import * as s from "./CohortFormInputFields.sc";

export const LabeledTextfield = (props) => {
  return (
    <Fragment>
      <s.CohortFormInputFields>
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
      </s.CohortFormInputFields>
    </Fragment>
  );
};

export const LabeledMultilineTextfield = (props) => {
  return (
    <Fragment>
      <s.CohortFormInputFields>
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
            rows={6}
            fullWidth
            type="text"
            required
          />
        </div>
      </s.CohortFormInputFields>
    </Fragment>
  );
};
