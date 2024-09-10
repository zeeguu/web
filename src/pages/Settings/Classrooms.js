import React from "react";
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
import { FullWidthListContainer } from "../../components/FullWidthListContainer.sc";
import FullWidthErrorMsg from "../../components/FullWidthErrorMsg";
import BackArrow from "./settings_pages_shared/BackArrow";
import strings from "../../i18n/definitions";
import LoadingAnimation from "../../components/LoadingAnimation";
import FullWidthListItem from "../../components/FullWidthListItem";
import LeaveClassroomModal from "./LeaveClassroomModal";

export default function Classrooms({ api }) {
  const user = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState("");
  const [showJoinCohortError, setShowJoinCohortError] = useState(false);
  const [studentCohorts, setStudentCohorts] = useState();
  const [isLeaveClassroomModalOpen, setIsLeaveClassroomModalOpen] =
    useState(false);
  const [currentClassroom, setCurrentClassroom] = useState("");

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

  function handleOpenLeaveClassroomModal(classroom) {
    setCurrentClassroom(classroom);
    setIsLeaveClassroomModalOpen(true);
  }

  function handleCloseLeaveClassroomModal() {
    setIsLeaveClassroomModalOpen(false);
  }

  function handleInviteCodeChange(event) {
    setInviteCode(event.target.value);
  }

  function leaveClassroom(e, cohort) {
    e.preventDefault();
    api.leaveCohort(
      cohort.id,
      (status) => {
        if (status == "OK") {
          updateValues();
          setShowJoinCohortError(false); //clear error message after successful exit from classroom
        } else {
          setShowJoinCohortError(true);
        }
      },
      (error) => {
        setShowJoinCohortError(true);
        updateValues();
        console.log(error);
      },
    );
  }

  function saveStudentToClassroom(e) {
    e.preventDefault(e);
    api.joinCohort(
      inviteCode.trim(),
      (status) => {
        if (status == "OK") {
          updateValues();
          setInviteCode("");
          setShowJoinCohortError(false); //clear error message after successful next attempt
        } else {
          setShowJoinCohortError(true);
        }
      },
      (error) => {
        setShowJoinCohortError(true);
        updateValues();
        console.log(error);
      },
    );
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
        <FullWidthListContainer>
          {studentIsInCohort ? (
            studentCohorts.map((classroom, idx) => (
              <FullWidthListItem
                key={classroom.id}
                hasButton={true}
                onButtonClick={() => handleOpenLeaveClassroomModal(classroom)}
              >{`${idx + 1}. ${classroom.name}`}</FullWidthListItem>
            ))
          ) : (
            <FullWidthListItem>
              {"Currently, you are not enrolled in any class"}
            </FullWidthListItem>
          )}
          {isLeaveClassroomModalOpen && (
            <LeaveClassroomModal
              leaveClass={leaveClassroom}
              currentClassroom={currentClassroom}
              isLeaveClassroomModalOpen={isLeaveClassroomModalOpen}
              handleCloseLeaveClassroomModal={handleCloseLeaveClassroomModal}
            />
          )}
        </FullWidthListContainer>
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
            <Button type="submit" onClick={(e) => saveStudentToClassroom(e)}>
              {studentIsInCohort ? strings.addClass : strings.joinClass}
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
    </PreferencesPage>
  );
}
