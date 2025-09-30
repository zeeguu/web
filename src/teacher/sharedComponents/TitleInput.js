import React, { Fragment } from "react";
import { TextField } from "@mui/material";
import * as s from "../styledComponents/TitleInput.sc";

export const TitleInput = (props) => {
  return (
    <Fragment>
      <s.LabeledInputFields>
        <div className="input-container">
          <label htmlFor={props.name}>{props.children}</label>
          <TextField
            InputProps={{
              disableUnderline: true,
              style: { fontWeight: 700, fontSize: '1.3rem' }
            }}
            className="input-field"
            aria-label={props.name}
            value={props.value}
            onChange={props.onChange}
            name={props.name}
            id={props.name}
            placeholder={props.placeholder}
            fullWidth
            multiline
            maxRows={4}
            type="text"
            required
          />
        </div>
      </s.LabeledInputFields>
    </Fragment>
  );
};
