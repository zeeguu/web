import React, { Fragment } from "react";
import strings from "../../i18n/definitions";
import { LanguageSelector } from "../sharedComponents/LanguageSelector";
import { TitleInput } from "../sharedComponents/TitleInput";
import { RichTextEditor } from "../sharedComponents/RichTextEditor";

export default function EditTextInputFields({
  language_code,
  article_title,
  article_content,
  handleLanguageChange,
  handleChange,
}) {
  return (
    <Fragment>
      <TitleInput
        value={article_title}
        onChange={handleChange}
        name="article_title"
        placeholder={strings.pasteTitleHere}
      >
        {strings.clickToChangeTitle}
      </TitleInput>
      <LanguageSelector value={language_code} onChange={handleLanguageChange}>
        {strings.defineLanguage}
      </LanguageSelector>
      <RichTextEditor
        value={article_content}
        onChange={handleChange}
        name="article_content"
        placeholder={strings.pasteBodyHere}
      >
        {strings.clickToChangeBody}
      </RichTextEditor>
    </Fragment>
  );
}
