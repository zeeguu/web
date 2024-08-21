import { NavLink, useHistory } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

export default function BackArrow() {
  const history = useHistory();
  return (
    <NavLink to="/account_settings/options">
      <ArrowBackRoundedIcon />
    </NavLink>
  );
}
