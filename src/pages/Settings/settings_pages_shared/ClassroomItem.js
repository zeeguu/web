import * as s from "./ClassroomItem.sc";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function ClassroomItem({ children, hasButton, onIconClick }) {
  return (
    <s.ClassroomItem>
      <s.ClassName>{children}</s.ClassName>
      {hasButton && (
        <s.ClassroomButton type="button" onClick={onIconClick}>
          <CloseRoundedIcon fontSize="small" sx={{ color: "#808080" }} />
        </s.ClassroomButton>
      )}
    </s.ClassroomItem>
  );
}
