import { styled } from "@mui/material/styles";
import scStyled from "styled-components";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { OrangeButton } from "../exercises/exerciseTypes/Exercise.sc";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ExpandMoreIcon sx={{ fontSize: "1.75rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(180deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const style = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  border: "0 !important",
  borderRadius: "0.65em",
  boxShadow: 24,
  p: 4,
};

let Headline = scStyled.h3`
  display: flex;
  justify-content: center;
  margin-bottom: 1em;
  `;

let Small = scStyled.small`
  display: flex;
  justify-content: center;
  color: gray;
  font-style: italic;
  margin-top: 1em;
`;

let Paragraph = scStyled.p`
  margin-left: 0.3em;
  margin-bottom: 1.5em;
  font-style: italic;
`;

let DoneButtonHolder = scStyled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;`;

let DoneButton = scStyled.button`
  cursor: pointer;

  display: flex;
  justify-content: flex-end;
  margin-top: 1.75em;
  width: max-content;

  color: #000000;
  background-color: #ffbb5440;
  border: 0.1em solid #ffbb54;
  border-radius: 0.65em;
  padding: 0.5em;
  user-select: none;
  outline: none;
`;

let EditButton = scStyled(OrangeButton)`
  width: 2em;
  height: 2em;

  img {
    height: 26px;
    width: 26px;
  }
`;

export {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  style,
  Headline,
  DoneButton,
  DoneButtonHolder,
  Small,
  Paragraph,
  EditButton,
};
