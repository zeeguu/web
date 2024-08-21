import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { NavLink } from "react-router-dom";
import DeleteAccountButton from "../DeleteAccountButton";
import InfoPage from "../info_page_shared/InfoPage";

import { PageTitle } from "../../components/PageTitle";
import strings from "../../i18n/definitions";

export default function DeleteAccount() {
  return (
    <InfoPage pageLocation={"settings"}>
      <NavLink to="/account_settings/options">
        <ArrowBackRoundedIcon />
      </NavLink>
      <PageTitle>{strings.deleteAccount}</PageTitle>
      <DeleteAccountButton />
    </InfoPage>
  );
}
