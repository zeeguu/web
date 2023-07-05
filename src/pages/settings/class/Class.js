import React, { useState } from "react";
import { Input } from "../../../components/input/Input";
import strings from "../../../i18n/definitions";
import { Dropdown } from "../../../components/dropdown/Dropdown";
import * as scs from "../Settings.sc";

const countriesData = [
  {
    name: "Chinese",
    icon: (
      <img src="/static/images/countries/china.png" width="25px" alt="china" />
    ),
  },
  {
    name: "Danish",
    icon: (
      <img
        src="/static/images/countries/denmark.png"
        width="25px"
        alt="denmark"
      />
    ),
  },
  {
    name: "French",
    icon: (
      <img
        src="/static/images/countries/france.png"
        width="25px"
        alt="france"
      />
    ),
  },
  {
    name: "German",
    icon: (
      <img
        src="/static/images/countries/germany.png"
        width="25px"
        alt="germany"
      />
    ),
  },
  {
    name: "English",
    icon: (
      <img
        src="/static/images/countries/great_britain.png"
        width="25px"
        alt="great_britain"
      />
    ),
  },
  {
    name: "Italian",
    icon: (
      <img src="/static/images/countries/italy.png" width="25px" alt="italy" />
    ),
  },
  {
    name: "Dutch",
    icon: (
      <img
        src="/static/images/countries/netherlands.png"
        width="25px"
        alt="netherlands"
      />
    ),
  },
  {
    name: "Spanish",
    icon: (
      <img src="/static/images/countries/spain.png" width="25px" alt="spain" />
    ),
  },
];

export const Class = () => {
  const [currentLang, setCurrentLang] = useState(null);
  const [className, setClassName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  return (
    <form>
      <Input
        isDisabled
        isPlainText
        title={strings.className}
        placeholder={strings.chooseClass}
        value={className}
        onChange={(value) => setClassName(value)}
      />

      <Input
        isPlainText
        title={strings.inviteCode}
        placeholder={strings.createInvite}
        value={inviteCode}
        onChange={(value) => setInviteCode(value)}
      />

      <Dropdown
        isDisabled
        title={strings.classroomLanguage}
        placeholder={strings.chooseClassroomLanguage}
        value={currentLang?.name}
        items={countriesData}
        onChange={setCurrentLang}
      />

      <scs.SettingButton onClick={() => {}}>{strings.save}</scs.SettingButton>
    </form>
  );
};
