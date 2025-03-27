import React, { useEffect, useState, Fragment, useContext } from "react";
import LoadingAnimation from "../../../components/LoadingAnimation";
import CohortList from "./CohortList";
import strings from "../../../i18n/definitions";
import { setTitle } from "../../../assorted/setTitle";
import * as s from "../../../components/ColumnWidth.sc";
import { PageTitle } from "../../../components/PageTitle";
import { APIContext } from "../../../contexts/APIContext";

function Home() {
  const api = useContext(APIContext);
  const [cohorts, setCohorts] = useState();
  const [forceUpdate, setForceUpdate] = useState(0);
  setTitle(strings.myClasses);
  useEffect(() => {
    api.getCohortsInfo(setCohorts);
    // eslint-disable-next-line
  }, [forceUpdate]);

  return (
    <>
      <PageTitle>{strings.myClasses}</PageTitle>
      <s.NarrowColumn>
        {cohorts ? (
          <div>
            <CohortList setForceUpdate={setForceUpdate} cohorts={cohorts} />
          </div>
        ) : (
          <LoadingAnimation />
        )}
      </s.NarrowColumn>
    </>
  );
}

export default Home;
