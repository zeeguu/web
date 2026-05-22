import { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { APIContext } from "../contexts/APIContext";
import * as s from "./CustomizeGear.sc";

const MAX_TITLES_SHOWN = 3;

function chipLabel(topics) {
  if (!topics || topics.length === 0) return "Personalize your feed";
  const titles = topics.map((t) => t.title);
  if (titles.length <= MAX_TITLES_SHOWN) return `Topics: ${titles.join(", ")}`;
  const shown = titles.slice(0, MAX_TITLES_SHOWN).join(", ");
  return `Topics: ${shown} +${titles.length - MAX_TITLES_SHOWN}`;
}

export default function CustomizeGear() {
  const api = useContext(APIContext);
  const history = useHistory();
  const [subscribedTopics, setSubscribedTopics] = useState(null);

  useEffect(() => {
    api.getSubscribedTopics((data) => setSubscribedTopics(data || []));
  }, [api]);

  const handleClick = () => {
    history.push("/account_settings/interests");
  };

  return (
    <s.GearWrapper>
      <s.GearButton onClick={handleClick} title="Customize feed">
        <span>{chipLabel(subscribedTopics)}</span>
        <SettingsRoundedIcon style={{ fontSize: "0.95rem" }} />
      </s.GearButton>
    </s.GearWrapper>
  );
}
