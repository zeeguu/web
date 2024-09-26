import { LogOutButtonStyle } from "./LogOutButton.sc";
import LogoutIcon from "@mui/icons-material/Logout";
import { zeeguuOrange } from "../../components/colors";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export default function LogOutButton({}) {
  const user = useContext(UserContext);
  return (
    <LogOutButtonStyle
      onClick={() => {
        user.logoutMethod();
      }}
    >
      Log Out{" "}
      <LogoutIcon className="navigationIcon" sx={{ color: zeeguuOrange }} />
    </LogOutButtonStyle>
  );
}
