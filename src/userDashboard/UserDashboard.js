import { useEffect, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import UserLineGraph from "./userGraphs/UserLineGraph";
import UserBarGraph from "./userGraphs/UserBarGraph";
import { PERIOD_OPTIONS, ACTIVITY_TIME_FORMAT_OPTIONS, OPTIONS } from "./dataFormat/ConstantsUserDashboard";
import { getLineGraphData, calculateCountPerMonth_Words, getMapData} from "./dataFormat/LineGraphDataFormat";
import { getBarGraphData, calculateCountPerMonth_Activity } from "./dataFormat/BarGraphDataFormat";
import UserDashboard_Top from "./UserDashboard_Top";
import { NivoGraphContainer } from "./UserDashboard.sc";

export default function UserDashboard({ api }){

    const [activeTab, setActiveTab] = useState(1);
    const [activeTimeInterval, setActiveTimeInterval] = useState(OPTIONS.WEEK);
    const [activeCustomTimeInterval, setActiveCustomTimeInterval] = useState(PERIOD_OPTIONS.WEEK);
    const [activeTimeFormatOption, setActiveTimeFormatOption] = useState(ACTIVITY_TIME_FORMAT_OPTIONS.MINUTES);
    const [allWordsData, setAllWordsData] = useState(null);
    const [allWordsDataPerMonths, setAllWordsDataPerMonths] = useState({});
    const [referenceDate, setReferenceDate] = useState(new Date());
    const [userActivityData, setUserActivityData] = useState(null);
    const [userActivityDataPerMonths, setUserActivityDataPerMonths] = useState({});

    function handleActiveTabChange(tabId) {
      setActiveTab(tabId);
      }

    function handleActiveTimeIntervalChange(selected) {

      setActiveTimeInterval(selected);

      if (selected !== OPTIONS.CUSTOM){

        setReferenceDate(new Date()); 

        var period = (selected === OPTIONS.WEEK) ? PERIOD_OPTIONS.WEEK
                        : (selected === OPTIONS.MONTH) ?
                              PERIOD_OPTIONS.MONTH
                        : (selected === OPTIONS.YEAR) ?
                              PERIOD_OPTIONS.YEAR
                        : (selected === OPTIONS.YEARS) ?
                              PERIOD_OPTIONS.YEARS
                        : PERIOD_OPTIONS.WEEK;
              
        handleActiveCustomTimeInterval(period);

        handleActiveTimeFormatChange(ACTIVITY_TIME_FORMAT_OPTIONS.MINUTES);

      }

    }

    function handleActiveCustomTimeInterval(selected) {
      setActiveCustomTimeInterval(selected);
    }

    function handleActiveTimeFormatChange(selected){
      setActiveTimeFormatOption(selected);
    }

    useEffect(() => {

      api.getBookmarksCountsByDate((counts) => {

      var formatted = getMapData(counts);

      setAllWordsData(formatted);
      
      setAllWordsDataPerMonths(
        calculateCountPerMonth_Words(formatted)
        );

      });

      api.getUserActivityByDay((activity) => {

        setUserActivityData(activity);

        setUserActivityDataPerMonths(calculateCountPerMonth_Activity(activity));
  
      });

    }, [activeCustomTimeInterval]);

    if (!allWordsData || !userActivityData) {

      return <LoadingAnimation />

    };

    return (
            <>

              <UserDashboard_Top
                  activeTab={activeTab}
                  handleActiveTabChange={handleActiveTabChange}
                  activeTimeInterval={activeTimeInterval}
                  handleActiveTimeIntervalChange={handleActiveTimeIntervalChange}
                  activeCustomTimeInterval={activeCustomTimeInterval}
                  handleActiveCustomTimeInterval={handleActiveCustomTimeInterval}
                  handleActiveTimeFormatChange={handleActiveTimeFormatChange}
                  activeTimeFormatOption={activeTimeFormatOption}
                  referenceDate={referenceDate}
                  setReferenceDate={setReferenceDate}
              />

              <NivoGraphContainer>

              {
                (activeTab === 1) ? 

                        <UserBarGraph 
                          data={getBarGraphData(userActivityData, userActivityDataPerMonths, activeCustomTimeInterval, referenceDate, activeTimeFormatOption)}
                        />

                : (activeTab === 2) ? 

                        <UserLineGraph 
                          data={getLineGraphData(allWordsData, allWordsDataPerMonths, activeCustomTimeInterval, referenceDate)}
                        />

                : <></>
              }

              </NivoGraphContainer>

          </>
    );
    
}




