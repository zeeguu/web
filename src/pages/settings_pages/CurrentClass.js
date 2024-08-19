import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { NavLink, useHistory } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Error } from "../../teacher/sharedComponents/Error";

import strings from "../../i18n/definitions";
import * as s from "../../components/FormPage.sc";
import * as scs from "../Settings.sc";

export default function CurrentClass({ api }) {
  // const history = useHistory();

  const user = useContext(UserContext);

  const [inviteCode, setInviteCode] = useState("");
  const [currentCohort, setCurrentCohort] = useState("");
  const [showJoinCohortError, setShowJoinCohortError] = useState(false);

  useEffect(() => {
    api.getStudent((student) => {
      if (student.cohort_id !== null) {
        api.getCohortName(student.cohort_id, (cohort) =>
          setCurrentCohort(cohort.name),
        );
      }
    });
  }, [user.session, api]);

  const studentIsInCohort = currentCohort !== "";

  function handleInviteCodeChange(event) {
    setShowJoinCohortError(false);
    setInviteCode(event.target.value);
  }

  function saveStudentToClass() {
    api.joinCohort(
      inviteCode,
      (status) => {
        status === "OK"
          ? // ? history.push("/articles/classroom")
            console.log("Successfully joined to classroom")
          : setShowJoinCohortError(true);
      },
      (error) => {
        console.log(error);
      },
    );
  }
  return (
    <div>
      <NavLink to="/account_settings/options">
        <ArrowBackRoundedIcon />
      </NavLink>{" "}
      Current Class
      <s.FormContainer>
        <scs.StyledSettings>
          <form className="formSettings">
            <>
              <b>Class Management</b>
              <hr></hr>
              <p className="current-class-of-student">
                <b>
                  {studentIsInCohort
                    ? strings.yourCurrentClassIs + currentCohort
                    : strings.youHaveNotJoinedAClass}
                </b>
              </p>
              <label className="change-class-string">
                {studentIsInCohort ? strings.changeClass : strings.joinClass}
              </label>
              <input
                type="text"
                placeholder={
                  studentIsInCohort
                    ? strings.insertNewInviteCode
                    : strings.insertInviteCode
                }
                value={inviteCode}
                onChange={(event) => handleInviteCodeChange(event)}
              />

              {showJoinCohortError && (
                <Error message={strings.checkIfInviteCodeIsValid} />
              )}

              <s.FormButton onClick={saveStudentToClass}>
                <span>
                  {studentIsInCohort ? strings.changeClass : strings.joinClass}
                </span>
              </s.FormButton>
            </>
          </form>
        </scs.StyledSettings>
      </s.FormContainer>
    </div>
  );
}
