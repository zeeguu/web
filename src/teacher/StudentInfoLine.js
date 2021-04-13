import React, { useState, Fragment } from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { Link } from "react-router-dom";
import { MdHighlightOff } from "react-icons/md/";
import { StyledButton} from "./TeacherButtons.sc";

export default function StudentInfoLine(props) {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <Fragment>
          <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", margin: "1em"}}>
          <Link
            to={`/teacher/classes/viewStudent/${props.studentID}/class/${props.cohortID}`}
          >
            The Student Name | progressbar | avg text length | avg text level |
            exercise correctness
          </Link>
          <StyledButton icon onClick={() => setIsOpen(true)}>
            <MdHighlightOff size={35}/>
          </StyledButton>
          </div>
          <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent>
          <div>
          <h1>This is the DeleteWarning for {props.studentID}!</h1>
          <p>Content is still missing...</p>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
