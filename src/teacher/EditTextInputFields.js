import React, { Fragment } from "react";
//import strings from "../i18n/definitions";
import { LanguageSelector } from "./LanguageSelector";
import {
  LabeledTextField,
  LabeledMultiLineTextField,
} from "./LabeledInputFields";

export default function EditTextInputFields({
  api,
  language_code,
  article_title,
  article_content,
  handleLanguageChange,
  handleChange,
}) {
  return (
    <Fragment>
      <LanguageSelector
        api={api}
        value={language_code}
        onChange={handleLanguageChange}
      >
        Please, define the language of the text STRINGS
      </LanguageSelector>
      <LabeledTextField
        value={article_title}
        onChange={handleChange}
        name="article_title"
        placeholder="STRINGSPaste or type your title here..."
      >
        STRINGSClick in the box below to edit the title
      </LabeledTextField>
      <LabeledMultiLineTextField
        value={article_content}
        onChange={handleChange}
        name="article_content"
        placeholder="STRINGSPaste or type the body of your text here..."
      >
        STRINGSClick in the box below to edit the text body
      </LabeledMultiLineTextField>
    </Fragment>
  );
}
