import React from 'react'
import { Input } from '../../../components/input/Input'
import strings from '../../../i18n/definitions'
import { Dropdown } from '../../../components/dropdown/Dropdown'
import { CEFR_LEVELS } from '../../../assorted/cefrLevels'
import * as scs from '../Settings.sc'

const countriesData = [
  {
    label: 'Chinese',
    icon: <img src='/static/images/countries/china.png' width='25px' alt='china' />,
  },
  {
    label: 'Danish',
    icon: <img src='/static/images/countries/denmark.png' width='25px' alt='denmark' />,
  },
  {
    label: 'French',
    icon: <img src='/static/images/countries/france.png' width='25px' alt='france' />,
  },
  {
    label: 'German',
    icon: <img src='/static/images/countries/germany.png' width='25px' alt='germany' />,
  },
  {
    label: 'English',
    icon: <img src='/static/images/countries/great_britain.png' width='25px' alt='great_britain' />,
  },
  {
    label: 'Italian',
    icon: <img src='/static/images/countries/italy.png' width='25px' alt='italy' />,
  },
  {
    label: 'Dutch',
    icon: <img src='/static/images/countries/netherlands.png' width='25px' alt='netherlands' />,
  },
  {
    label: 'Spanish',
    icon: <img src='/static/images/countries/spain.png' width='25px' alt='spain' />,
  },
]


export const Class = ({userDetails, setUserDetails}) => {

  return (
    <form>
      <Input
        isPlainText
        title={strings.className}
        placeholder={strings.chooseClass}
        // value={userDetails.name}
        // onChange={(e) =>
        //   setUserDetails({ ...userDetails, name: e.target.value })
        // }
      />

      <Input
        isPlainText
        title={strings.inviteCode}
        placeholder={strings.createInvite}
        // value={userDetails.name}
        // onChange={(e) =>
        //   setUserDetails({ ...userDetails, name: e.target.value })
        // }
      />

      <Dropdown
        title={strings.classroomLanguage}
        placeholder={strings.chooseClassroomLanguage}
        value='value'
        items={countriesData}
      />

      <scs.SettingButton onClick={() => {}}>
        {strings.save}
      </scs.SettingButton>
    </form>
  )
}

