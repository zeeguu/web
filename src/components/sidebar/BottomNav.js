import { BottomNavigation } from "@mui/material";
import { BottomNavigationAction } from "@mui/material";
import InsertEmoticonRoundedIcon from "@mui/icons-material/InsertEmoticonRounded";

export default function BottomNav() {
  return (
    <>
      <div>
        <BottomNavigation showLabels={true}>
          <BottomNavigationAction
            label="test"
            icon={<InsertEmoticonRoundedIcon />}
          />
          <BottomNavigationAction
            label="test"
            icon={<InsertEmoticonRoundedIcon />}
          />
          <BottomNavigationAction
            label="test"
            icon={<InsertEmoticonRoundedIcon />}
          />
          <BottomNavigationAction
            label="test"
            icon={<InsertEmoticonRoundedIcon />}
          />
          <BottomNavigationAction
            label="test"
            icon={<InsertEmoticonRoundedIcon />}
          />
        </BottomNavigation>
      </div>
    </>
  );
}
