import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { NavLink } from "react-router-dom";
import DeleteAccountButton from "../DeleteAccountButton";

export default function DeleteAccount() {
  return (
    <div>
      <NavLink to="/account_settings/options">
        <ArrowBackRoundedIcon />
      </NavLink>{" "}
      Delete Account
      <hr></hr>
      <DeleteAccountButton />
    </div>
  );
}
