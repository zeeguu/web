import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useContext, useState } from "react";
import Chip from "@mui/material/Chip";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Alert from "@mui/material/Alert";
import { gray, darkBlue } from "../components/colors";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { APIContext } from "../contexts/APIContext";

export default function ReportBroken({ sourceID, UMR_SOURCE }) {
  const api = useContext(APIContext);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setIsFeedbackSent(false);
  };

  const handleClose = () => {
    setFeedback("");
    setOpen(false);
  };

  function reportBroken() {
    api.logReaderActivity(api.USER_FEEDBACK, sourceID, feedback, UMR_SOURCE);
    setIsFeedbackSent(true);
    setTimeout(() => handleClose(), 1000);
  }

  const handleChange = (e) => {
    setFeedback(e.target.value);
    setIsFeedbackSent(false);
  };

  return (
    <>
      <div style={{ marginLeft: "5px" }}>
        <Chip
          label="Report broken article"
          component="a"
          onClick={handleClickOpen}
          variant="outlined"
          clickable
          color="warning"
          size="small"
          icon={<ReportProblemRoundedIcon />}
        />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <b>Report broken article</b>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDisplay: "row",
            paddingTop: "0px",
            minWidth: "14em",
          }}
        >
          {isFeedbackSent ? (
            <Alert severity="success">Feedback sent</Alert>
          ) : (
            <>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseSharpIcon />
              </IconButton>
              <TextField
                id="outlined-multiline-flexible"
                label="Report article"
                multiline={true}
                minRows={2}
                maxRows={3}
                value={feedback}
                onChange={handleChange}
                margin="normal"
                size="small"
              />

              <DialogActions>
                <IconButton
                  type="submit"
                  onClick={reportBroken}
                  id="feedback-box"
                  aria-label="send"
                  disabled={!feedback.trim()}
                  sx={{
                    color: !feedback.trim() ? gray : darkBlue,
                    fontSize: "medium",
                  }}
                >
                  <SendIcon />
                </IconButton>
              </DialogActions>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
