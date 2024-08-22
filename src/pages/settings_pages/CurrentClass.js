import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import Button from "../info_page_shared/Button";
import ButtonContainer from "../info_page_shared/ButtonContainer";
import InputField from "../info_page_shared/InputField";
import Form from "../info_page_shared/Form";
import FormSection from "../info_page_shared/FormSection";
import InfoPage from "../info_page_shared/InfoPage";
import FullWidthErrorMsg from "../info_page_shared/FullWidthErrorMsg";

import BackArrow from "../settings_pages_shared/BackArrow";

import strings from "../../i18n/definitions";
import { PageTitle } from "../../components/PageTitle";

export default function CurrentClass({ api }) {
  const history = useHistory();

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
        status === "OK" ? history.goBack() : setShowJoinCohortError(true);
      },
      (error) => {
        console.log(error);
      },
    );
  }
  return (
    <InfoPage pageLocation={"settings"}>
      <BackArrow />
      <PageTitle>{strings.myCurrentClass}</PageTitle>

      <p className="">
        <b>
          {studentIsInCohort
            ? strings.yourCurrentClassIs + currentCohort
            : strings.youHaveNotJoinedAClass}
        </b>
      </p>
      <Form>
        <FormSection>
          <InputField
            type={"text"}
            label={studentIsInCohort ? strings.changeClass : strings.joinClass}
            id={"cohort"}
            name={"cohort"}
            placeholder={
              studentIsInCohort
                ? strings.insertNewInviteCode
                : strings.insertInviteCode
            }
            value={inviteCode}
            onChange={(event) => handleInviteCodeChange(event)}
          />
          {showJoinCohortError && (
            <FullWidthErrorMsg>
              {strings.checkIfInviteCodeIsValid}
            </FullWidthErrorMsg>
          )}
        </FormSection>
        <ButtonContainer>
          <Button onClick={saveStudentToClass}>
            {studentIsInCohort ? strings.changeClass : strings.joinClass}
          </Button>
        </ButtonContainer>
      </Form>
    </InfoPage>
  );
}
