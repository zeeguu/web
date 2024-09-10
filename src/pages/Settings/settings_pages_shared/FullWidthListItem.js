import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import * as s from "./FullWidthListItem.sc";

export default function FullWidthListItem({
  children,
  hasButton,
  onButtonClick,
}) {
  return (
    <s.FullWidthListItem>
      <s.TextContent>{children}</s.TextContent>
      {hasButton && (
        <s.ListButton type="button" onClick={onButtonClick}>
          <CloseRoundedIcon fontSize="small" sx={{ color: "#808080" }} />
        </s.ListButton>
      )}
    </s.FullWidthListItem>
  );
}
