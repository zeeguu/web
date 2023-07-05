import { useContext, useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { UserContext } from "../../UserContext";
import * as scs from "./Settings.sc";
import strings from "../../i18n/definitions";
import { Class } from "./class/Class";
import { Content } from "./content/Content";
import { PersonalData } from "./personalData/PersonalData";
import { zeeguuSecondOrange } from "../../components/colors";

const settingsRoute = "/account_settings";

const activeLinkStyle = {
  color: zeeguuSecondOrange,
  padding: "4px 0",
  borderBottom: `1px ${zeeguuSecondOrange} solid`,
};

const settingsVariants = {
  personalData: {
    title: strings.personalData,
    name: "personalData",
    route: "/personalData",
  },
  class: {
    title: strings.class,
    name: "class",
    route: "/class",
  },
  content: {
    title: strings.content,
    name: "content",
    route: "/content",
  },
};

export default function Settings({ api, setUser }) {
  const history = useHistory();
  const location = useLocation();
  const user = useContext(UserContext);

  const [currentSettings, setCurrentSettings] = useState(
    location.pathname.split("/")[2]
  );

  useEffect(() => {
    if (!currentSettings)
      history.push(settingsRoute + settingsVariants.personalData.route);

    setCurrentSettings(location.pathname.split("/")[2]);
  }, [location]);

  return (
    <scs.SettingContainer>
      <scs.StyledSettings>
        <scs.H1>{strings.settings}</scs.H1>

        <scs.NavList>
          {Object.values(settingsVariants).map((settingVariant) => (
            <li key={settingVariant.name}>
              <Link
                to={settingsRoute + settingVariant.route}
                style={
                  currentSettings === settingVariant.name ? activeLinkStyle : {}
                }
              >
                {settingVariant.title}
              </Link>
            </li>
          ))}
        </scs.NavList>

        {currentSettings === settingsVariants.personalData.name && (
          <PersonalData api={api} setUser={setUser} user={user} />
        )}

        {currentSettings === settingsVariants.class.name && <Class />}

        {currentSettings === settingsVariants.content.name && <Content />}
      </scs.StyledSettings>
    </scs.SettingContainer>
  );
}

// function language_for_id(id, language_list) {
//   for (let i = 0; i < language_list.length; i++) {
//     if (language_list[i].code === id) {
//       return language_list[i].name;
//     }
//   }
// }
