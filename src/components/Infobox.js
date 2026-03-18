import * as s from "./Infobox.sc";
import infoIcon from "/static/icons/info-info-icon.png";

export default function Infobox({ children }) {
  return (
    <s.Infobox>
      <img src={infoIcon} alt="" />
      {children}
    </s.Infobox>
  );
}
