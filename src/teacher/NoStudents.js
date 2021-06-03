import React from "react";
import strings from "../i18n/definitions";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "./NoStudent.sc";

const NoStudents = ({ inviteCode }) => {
  return (
    <s.CenteredContent>
      <sc.NoStudents>
        <p>
          {strings.noStudentsInClass}
          <br />
          {strings.shareTheInviteCode} <b>{inviteCode}</b>{" "}
          {strings.shareInviteCodeContinued}
          <br />
          {strings.soTheStudentCanJoinClass}
        </p>
      </sc.NoStudents>
    </s.CenteredContent>
  );
};
export default NoStudents;
