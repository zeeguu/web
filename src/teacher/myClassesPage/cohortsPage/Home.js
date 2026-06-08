import React, { useEffect, useState, useContext } from "react";
import LoadingAnimation from "../../../components/LoadingAnimation";
import CohortList from "./CohortList";
import NotATeacherNotice from "../../sharedComponents/NotATeacherNotice";
import strings from "../../../i18n/definitions";
import { setTitle } from "../../../assorted/setTitle";
import * as s from "../../../components/ColumnWidth.sc";
import { PageTitle } from "../../../components/PageTitle";
import { APIContext } from "../../../contexts/APIContext";

function Home() {
  const api = useContext(APIContext);
  const [cohorts, setCohorts] = useState();
  const [notATeacher, setNotATeacher] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  setTitle(strings.myClasses);
  useEffect(() => {
    api.getCohortsInfo(setCohorts, (e) => {
      // A 401 here means the logged-in account isn't a teacher account, so we
      // explain that instead of spinning forever. Other errors (network) fall
      // through to the loading state, matching the previous behaviour.
      if (/HTTP 401/.test(e?.message)) setNotATeacher(true);
    });
    // eslint-disable-next-line
  }, [forceUpdate]);

  let content;
  if (notATeacher) {
    content = <NotATeacherNotice />;
  } else if (cohorts) {
    content = (
      <div>
        <CohortList setForceUpdate={setForceUpdate} cohorts={cohorts} />
      </div>
    );
  } else {
    content = <LoadingAnimation />;
  }

  return (
    <>
      <PageTitle>{strings.myClasses}</PageTitle>
      <s.NarrowColumn>{content}</s.NarrowColumn>
    </>
  );
}

export default Home;
