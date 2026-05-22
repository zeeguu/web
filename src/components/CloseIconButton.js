import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import styled from "styled-components";

const StyledButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--text-primary);
  }
`;

export default function CloseIconButton({ onClick, ariaLabel = "Close" }) {
  return (
    <StyledButton onClick={onClick} aria-label={ariaLabel}>
      <CloseRoundedIcon />
    </StyledButton>
  );
}
