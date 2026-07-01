export const toolbarButtonRoot = {
  position: "relative",
  display: "inline-block",
};

export const toolbarMenu = {
  position: "absolute",
  top: "100%",
  right: "0",
  backgroundColor: "var(--card-bg)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: "4px",
  boxShadow: "0 2px 8px var(--shadow-color)",
  zIndex: 1000,
  padding: "1rem",
  minWidth: "200px",
};

export const toolbarFormGroupSx = {
  "& .MuiFormControlLabel-label": { color: "var(--text-primary)" },
  "& .MuiFormHelperText-root": { color: "var(--text-secondary)" },
};

export const experimentalHelperText = {
  marginTop: "0.5rem",
};
