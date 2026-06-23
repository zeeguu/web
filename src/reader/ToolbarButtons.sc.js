export const toolbarButtonRoot = {
  position: "relative",
  display: "inline-block",
};

export const toolbarButtonTrigger = {
  padding: "0.5rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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

export const fontSizeButtonStyle = {
  background: "var(--bg-secondary)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: "4px",
  padding: "0.2rem 0.5rem",
  cursor: "pointer",
  fontSize: "0.9em",
};

export const fontSizeRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "0.6rem",
};

export const fontSizeControls = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

export const toolbarIcon = {
  fontSize: "1.4em",
  color: "#999",
};

export const fontSizeValue = {
  fontSize: "0.85em",
  color: "var(--text-secondary)",
  minWidth: "2.2em",
  textAlign: "center",
};

export const toolbarFormGroupSx = {
  "& .MuiFormControlLabel-label": { color: "var(--text-primary)" },
  "& .MuiFormHelperText-root": { color: "var(--text-secondary)" },
};

export const experimentalHelperText = {
  marginTop: "0.5rem",
};
