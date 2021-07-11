import React, { useEffect, useState, Fragment } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import CohortList from "./CohortList";
import strings from "../i18n/definitions";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";

function Home({ api }) {
  const [cohorts, setCohorts] = useState();
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    api.getCohortsInfo(setCohorts);
    // eslint-disable-next-line
  }, [forceUpdate]);

  return (
    <Fragment>
      <s.NarrowColumn>
        <sc.TopTabs>
          <h1>{strings.myClasses}</h1>
        </sc.TopTabs>
        {cohorts ? (
          <CohortList
            api={api}
            setForceUpdate={setForceUpdate}
            cohorts={cohorts}
          />
        ) : (
          <LoadingAnimation />
        )}
      </s.NarrowColumn>
    </Fragment>
  );
}

export default Home;
