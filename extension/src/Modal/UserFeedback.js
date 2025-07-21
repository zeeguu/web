import * as s from "../../../src/reader/ArticleReader.sc";
import { useState } from "react";
import sendFeedbackEmail from "./sendFeedbackEmail";
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Alert from '@mui/material/Alert';
import colors from "../colors";

const UserFeedback = ({ api, articleId, url }) => {
  const initialFeedbackState = "";
  const [feedback, setFeedback] = useState(initialFeedbackState);
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);

  const setModalIsOpenToTrue = () => {
    if (!feedback.trim()) {
      return;
    }
    setIsFeedbackSent(true);
    sendFeedback();
  };

  const handleChange = (e) => {
    setFeedback(e.target.value);
    setIsFeedbackSent(false);
  };

  const sendFeedback = async () => {
    await sendFeedbackEmail(api, feedback, url, articleId, "PROBLEM_");
    resetInput();
  };

  const resetInput = () => {
    setFeedback(initialFeedbackState);
  };

  return (
    <Accordion style={{ boxShadow: "none" }}>
      <AccordionSummary
        sx={{
          justifyContent: 'space-evenly',
          backgroundColor: colors.lighterBlue,
          color: colors.black,
          borderBottom: ".5px solid white",
          borderTopLeftRadius: '0.2rem',
          borderTopRightRadius: '0.2rem'
        }}
        expandIcon={<ExpandMoreIcon sx={{ color: colors.black, fontSize: '0.9rem' }} />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={{ fontWeight: '200', fontSize: '0.9rem' }}>Report problems</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {isFeedbackSent ? (
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12}>
              <Alert severity="success">Feedback sent</Alert>
            </Grid>
          </Grid>
        ) : (
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={9}>
              <TextField
                id="outlined-multiline-flexible"
                label="Feedback"
                multiline
                maxRows={3}
                value={feedback}
                onChange={handleChange}
                margin="normal"
                size="small"
                helperText={!feedback.trim() ? "Empty message" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <IconButton
                type="submit"
                onClick={setModalIsOpenToTrue}
                id="feedback-box"
                aria-label="send"
                disabled={!feedback.trim()}
                sx={{
                  color: !feedback.trim() ? colors.gray : colors.darkBlue,
                  fontSize: "medium",
                }}
              >
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default UserFeedback;