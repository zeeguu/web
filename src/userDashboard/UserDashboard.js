import { useEffect, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import UserLineGraph from "./userGraphs/UserLineGraph";
import UserBarGraph from "./userGraphs/UserBarGraph";
import {PERIOD_OPTIONS, ACTIVITY_TIME_FORMAT_OPTIONS} from "./dataFormat/ConstantsUserDashboard";
import { getLineGraphData, calculateCountPerMonth_Words, getMapData} from "./dataFormat/LineGraphDataFormat";
import { getBarGraphData, calculateCountPerMonth_Activity } from "./dataFormat/BarGraphDataFormat";

import UserDashboard_Top from "./UserDashboard_Top";

export default function UserDashboard({ api }){

    const [activeTab, setActiveTab] = useState(1);
    const [activeOption, setActiveOption] = useState(PERIOD_OPTIONS.WEEK);
    const [activeTimeFormatOption, setActiveTimeFormatOption] = useState(ACTIVITY_TIME_FORMAT_OPTIONS.MINUTES);
    const [allWordsData, setAllWordsData] = useState(null);
    const [allWordsDataPerMonths, setAllWordsDataPerMonths] = useState({});
    const [dateForGraphs, setDateForGraphs] = useState(new Date());
    const [userActivityData, setUserActivityData] = useState(null);
    const [userActivityDataPerMonths, setUserActivityDataPerMonths] = useState({});

    function handleActiveTabChange(tabId) {
      setActiveTab(tabId);  
    }

    function handleActiveOptionChange(selected) {
      setActiveOption(selected);
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

    }, [activeOption]);

    if (!allWordsData || !userActivityData) {

      return <LoadingAnimation />

    };

    return (
            <>

              <UserDashboard_Top
                  activeTab={activeTab}
                  handleActiveTabChange={handleActiveTabChange}
                  activeOption={activeOption}
                  handleActiveOptionChange={handleActiveOptionChange}
                  handleActiveTimeFormatChange={handleActiveTimeFormatChange}
                  activeTimeFormatOption={activeTimeFormatOption}
                  dateForGraphs={dateForGraphs}
                  setDateForGraphs={setDateForGraphs}
              />
              
              {/*
              parent container has to have height specified in order for the nivo graphs to be shown
              this is why the div has height 500; the number can be changed
              */}

              <div style={{height: 500}}>

              {
                (activeTab === 1) ? 

                        <UserBarGraph 
                          data={getBarGraphData(userActivityData, userActivityDataPerMonths, activeOption, dateForGraphs, activeTimeFormatOption)}
                        />

                : (activeTab === 2) ? 

                        <UserLineGraph 
                          data={getLineGraphData(allWordsData, allWordsDataPerMonths, activeOption, dateForGraphs)}
                        />

                : <></>
              }

              </div>

          </>
    );
    
}




