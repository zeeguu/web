import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { NavLink } from "react-router-dom";
import DeleteAccountButton from "../DeleteAccountButton";

import { PageTitle } from "../../components/PageTitle";

export default function DeleteAccount() {
  return (
    <div>
      <NavLink to="/account_settings/options">
        <ArrowBackRoundedIcon />
      </NavLink>
      <PageTitle>{"Delete Account"}</PageTitle>
      <DeleteAccountButton />
    </div>
  );
}
