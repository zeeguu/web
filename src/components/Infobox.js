import * as s from "./Infobox.sc";
import { APP_URL } from "../appConstants";

export default function Infobox({ children }) {
  return (
    <s.Infobox>
      <img src={APP_URL + "/static/icons/" + "info-icon.png"} alt="" />
      {children}
    </s.Infobox>
  );
}
