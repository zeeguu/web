import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { MdPeople } from "react-icons/md/";
import { StyledButton } from "./TeacherButtons.sc";
import * as s from "./CohortItemCard.sc";
import strings from "../i18n/definitions";
import { Dialog } from "@reach/dialog";
import CohortForm from "./CohortForm";

export const CohortItemCard = ({ api, cohort, setForceUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Fragment>
      <s.StyledCohortItemCard>
        <div className="cohort-card">
          <Link to={`/teacher/classes/viewClass/${cohort.id}`}>
            <div>
              <div className="top-line-box">
                <p className="font-light">{cohort.language_name}</p>
                <p className="student-count">
                  {cohort.cur_students}
                  <MdPeople className="cohort-card-icon-people" size="22px" />
                </p>
              </div>
            </div>
            <h2 className="cohort-card-headline">
              {cohort.name} {/*This cannot be strings-yfied*/}
            </h2>
          </Link>
          <div className="buttom-box">
            <p className="font-light">
              {strings.inviteCode}: {cohort.inv_code}
            </p>
            <div className="buttons-container">
              <Link to={`/teacher/classes/viewClass/${cohort.id}`}>
                <StyledButton secondary>See students (STRINGS)</StyledButton>
              </Link>
              <StyledButton secondary onClick={() => setIsOpen(true)}>
                Edit class (STRINGS)
              </StyledButton>
            </div>
          </div>
        </div>
        {isOpen && (
          <Dialog aria-label="Create or edit class"onDismiss={() => setIsOpen(false)}>
            <CohortForm
              api={api}
              cohort={cohort}
              setIsOpen={setIsOpen}
              setForceUpdate={setForceUpdate}
            />
          </Dialog>
        )}
      </s.StyledCohortItemCard>
    </Fragment>
  );
};
export default CohortItemCard;
