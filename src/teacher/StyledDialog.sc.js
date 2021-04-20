import styled from "styled-components";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

export const StyledDialog = styled(Dialog)`
  max-width: ${(props) => props.maxWidth};
  border-radius: 15px;
`;
