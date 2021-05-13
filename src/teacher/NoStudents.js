import React from "react";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "./NoStudent.sc";

const NoStudents = ({ inviteCode }) => {
  return (
    <s.CenteredContent>
      <sc.NoStudents>
          <p>
            There are no students in this class yet. STRINGS
            <br />
            Share the invite code <b>{inviteCode}</b> with them, STRINGS
            <br />
            so they can sign up and join the classroom. STRINGS
          </p>
      </sc.NoStudents>
    </s.CenteredContent>
  );
};
export default NoStudents;
