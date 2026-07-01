import styled from "styled-components";

export const ToolbarButtonRoot = styled.div`
  position: relative;
  display: inline-block;
`;

export const ToolbarMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 2px 8px var(--shadow-color);
  z-index: 1000;
  padding: 1rem;
  min-width: 200px;
`;

export const toolbarFormGroupSx = {
  "& .MuiFormControlLabel-label": { color: "var(--text-primary)" },
  "& .MuiFormHelperText-root": { color: "var(--text-secondary)" },
};

export const experimentalHelperText = {
  marginTop: "0.5rem",
};
