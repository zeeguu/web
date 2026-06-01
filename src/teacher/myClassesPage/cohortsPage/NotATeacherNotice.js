import React, { useContext } from "react";
import strings from "../../../i18n/definitions";
import * as s from "../../../components/ColumnWidth.sc";
import * as sc from "../../styledComponents/NoStudent.sc";
import { StyledButton } from "../../styledComponents/TeacherButtons.sc";
import { UserContext } from "../../../contexts/UserContext";

// Shown when /cohorts_info returns 401 — i.e. the logged-in account is not a
// teacher account. Without this, Home would spin on <LoadingAnimation /> forever
// (the success callback never fires), which reads to the user as "page broken".
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
