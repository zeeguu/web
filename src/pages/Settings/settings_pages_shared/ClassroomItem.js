import * as s from "./ClassroomItem.sc";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function ClassroomItem({ children, hasButton, onIconClick }) {
  return (
    <s.ClassroomItem>
      {children}
      {hasButton && (
        <s.ClassroomButton type="button" onClick={onIconClick}>
          <CloseRoundedIcon />
        </s.ClassroomButton>
      )}
    </s.ClassroomItem>
  );
}
