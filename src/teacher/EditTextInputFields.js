import React, { Fragment } from "react";
import strings from "../i18n/definitions";
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
        {strings.defineLanguage}
      </LanguageSelector>
      <LabeledTextField
        value={article_title}
        onChange={handleChange}
        name="article_title"
        placeholder={strings.pasteTitleHere}
      >
        {strings.clickToChangeTitle}
      </LabeledTextField>
      <LabeledMultiLineTextField
        value={article_content}
        onChange={handleChange}
        name="article_content"
        placeholder={strings.pasteBodyHere}
      >
        {strings.clickToChangeBody}
      </LabeledMultiLineTextField>
    </Fragment>
  );
}
