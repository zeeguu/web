import React, { useContext } from "react";
import strings from "../../i18n/definitions";
import * as s from "../../components/ColumnWidth.sc";
import * as sc from "../styledComponents/NoStudent.sc";
import { StyledButton } from "../styledComponents/TeacherButtons.sc";
import { UserContext } from "../../contexts/UserContext";

// Shown across the teacher site when the logged-in account is not a teacher
// account (e.g. someone landing on /teacher via a saved bookmark while signed
// in with a student/personal account). Without it the teacher pages either spin
// forever (cohorts_info 401) or render a blank panel (bare /teacher).
const NotATeacherNotice = () => {
  const { logoutMethod } = useContext(UserContext);
  return (
    <s.CenteredContent>
      <sc.NoStudents>
        <p>
          <b>{strings.notATeacherAccountTitle}</b>
          <br />
          {strings.notATeacherAccountBody}
          <br />
          <br />
          <StyledButton $primary onClick={() => logoutMethod()}>
            {strings.logout}
          </StyledButton>
        </p>
      </sc.NoStudents>
    </s.CenteredContent>
  );
};

export default NotATeacherNotice;
