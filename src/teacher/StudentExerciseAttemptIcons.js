import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import PriorityHighRoundedIcon from "@material-ui/icons/PriorityHighRounded";


export const CorrectAttempt = () => {
  return <CheckRoundedIcon style={{ color: "green", margin:"16px -3px 0 -2px", fontSize:18}} />;
};

export const WrongAttempt = () => {
  return <ClearRoundedIcon style={{ color: "red", margin:"16px -3px 0 -2px", fontSize:18 }} />;
};

export const SolutionShown = () => {
  return <PriorityHighRoundedIcon style={{margin:"17px -5px 0 -4px", fontSize:"15.3px"}} />;
};

export const HintUsed = () => {
  return <p style={{ color: "orange", fontWeight:600, margin:"16px 0px 0 1.5px"}}>?</p>;
};
