import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import Button from "../_pages_shared/Button";
import ButtonContainer from "../_pages_shared/ButtonContainer";
import InputField from "../../components/InputField";
import Form from "../_pages_shared/Form";
import FormSection from "../_pages_shared/FormSection";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading";
import Main from "../_pages_shared/Main";
import { ClassContainer } from "./Settings.sc";
import FullWidthErrorMsg from "../_pages_shared/FullWidthErrorMsg";
import BackArrow from "./settings_pages_shared/BackArrow";
import strings from "../../i18n/definitions";
import LoadingAnimation from "../../components/LoadingAnimation";
import ClassroomItem from "./settings_pages_shared/ClassroomItem";

export default function CurrentClass({ api }) {
  const history = useHistory();

  const user = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [shouldReload, setShouldReload] = useState(true);
  const [inviteCode, setInviteCode] = useState("");
  const [showJoinCohortError, setShowJoinCohortError] = useState(false);
  const [studentCohorts, setStudentCohorts] = useState();

  function updateValues() {
    setIsLoading(true);
    api.getStudent((student) => {
      setStudentCohorts(student.cohorts);
      setIsLoading(false);
    });
  }
  useEffect(() => {
    updateValues();
  }, [user.session, api]);

  function handleInviteCodeChange(event) {
    setInviteCode(event.target.value);
  }

  function leaveClass(e, cohort) {
    e.preventDefault();
    api.leaveCohort(
      cohort.id,
      (response) => {
        updateValues();
      },
      (error) => {
        setShowJoinCohortError(true);
        updateValues();
        console.log(error);
      },
    );
  }

  function saveStudentToClass(e) {
    e.preventDefault(e);
    api.joinCohort(
      inviteCode,
      (status) => {
        if (status !== "OK") {
          setShowJoinCohortError(true);
        }
        updateValues();
      },
      (error) => {
        setShowJoinCohortError(true);
        updateValues();
        console.log(error);
      },
    );
    setInviteCode("");
  }
  if (isLoading) return <LoadingAnimation></LoadingAnimation>;
  const studentIsInCohort = studentCohorts && studentCohorts.length > 0;
  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow />
      <Header withoutLogo>
        <Heading>{strings.myClassrooms}</Heading>
      </Header>
      <Main>
        <ClassContainer>
          {studentIsInCohort ? (
            studentCohorts.map((classroom, idx) => (
              <ClassroomItem
                hasButton={true}
                key={classroom.id}
                onIconClick={(e) => {
                  leaveClass(e, classroom);
                }}
              >{`${idx + 1}. ${classroom.name}`}</ClassroomItem>
            ))
          ) : (
            <ClassroomItem>
              {"Currently, you are not enrolled in any class"}
            </ClassroomItem>
          )}
        </ClassContainer>
        <Form>
          <FormSection>
            <InputField
              type={"text"}
              label={
                studentIsInCohort
                  ? strings.insertNewInviteCode
                  : strings.insertInviteCode
              }
              id={"cohort"}
              name={"cohort"}
              value={inviteCode}
              onChange={(event) => handleInviteCodeChange(event)}
            />

            {showJoinCohortError && (
              <FullWidthErrorMsg>
                <p>{strings.checkIfInviteCodeIsValid}</p>
              </FullWidthErrorMsg>
            )}
          </FormSection>
          <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <Button type="submit" onClick={(e) => saveStudentToClass(e)}>
              {studentIsInCohort ? strings.addClass : strings.joinClass}
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
    </PreferencesPage>
  );
}
