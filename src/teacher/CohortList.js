import React, { useState } from "react";
import { Dialog, DialogContent } from "@material-ui/core";
//import { toast } from "react-toastify";
//import strings from "../i18n/definitions";

import { CohortItemCard } from "./CohortItemCard";
import { StyledButton, TopButton } from "./TeacherButtons.sc";

export default function CohortList({ api, cohorts, setForceUpdate }) {
  const [isOpen, setIsOpen] = useState(false);

 //TODO We need the commented-out stuff to implement the functionality of the "Add class"-btn.
  // const [isError, setIsError] = useState(false);

/*   const addCohort = (form) => {
    setIsError(false);
    api
      .createCohort(form)
      .then((result) => {
        setIsOpen(false);
        toast("👩‍🎓 The class was created successfully! (STRINGS)", {
          type: toast.TYPE.SUCCESS,
        });
        setForceUpdate((prev) => prev + 1); // reloads the classes to update the UI
      })
      .catch((err) => {
        toast("🤨 The class could not be created (STRINGS)", {
          type: toast.TYPE.ERROR,
        });
        setIsError(true);
      });
  }; */

  return (
    <React.Fragment>
      <TopButton>
        <StyledButton primary onClick={() => setIsOpen(true)}>
          Add class (STRINGS)
        </StyledButton>
      </TopButton>
      {cohorts.map((cohort) => (
        <CohortItemCard key={cohort.id} cohort={cohort} />
      ))}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent>
{/*           <CohortForm
            primaryButtonText="Create Class"
            onSubmit={addCohort}
            isError={isError}
          /> */}
          <div>
          <h1>This is the Create Class popup!</h1>
          <p>The CohortForm etc. still needs to be migrated...</p>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
