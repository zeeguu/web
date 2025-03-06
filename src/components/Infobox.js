import * as s from "./Infobox.sc";
import { APP_DOMAIN } from "../appConstants";

export default function Infobox({ children }) {
  return (
    <s.Infobox>
      <img src={APP_DOMAIN + "/static/icons/info-icon.png"} alt="" />
      {children}
    </s.Infobox>
  );
}
