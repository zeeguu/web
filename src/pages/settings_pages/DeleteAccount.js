import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { NavLink } from "react-router-dom";
import DeleteAccountButton from "../DeleteAccountButton";

import { PageTitle } from "../../components/PageTitle";
import strings from "../../i18n/definitions";

export default function DeleteAccount() {
  return (
    <div>
      <NavLink to="/account_settings/options">
        <ArrowBackRoundedIcon />
      </NavLink>
      <PageTitle>{strings.deleteAccount}</PageTitle>
      <DeleteAccountButton />
    </div>
  );
}
