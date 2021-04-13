import { useEffect, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import UserLineGraph from "./userGraphs/UserLineGraph";
import UserBarGraph from "./userGraphs/UserBarGraph";
import {PERIOD_OPTIONS, ACTIVITY_TIME_FORMAT_OPTIONS} from "./dataFormat/ConstantsUserDashboard";
import { getLineGraphData, calculateCountPerMonth_Words, getMapData} from "./dataFormat/LineGraphDataFormat";
import { getBarGraphData, calculateCountPerMonth_Activity } from "./dataFormat/BarGraphDataFormat";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const tabs = [ {id: 1, title: "Bar chart"}, {id: 2, title: "Line chart"} ]

const TabList = ({ children }) => {
    return (
      <ul className="user-dashboard-tab-list">
       {children}
      </ul>
     )
   }

const Tab = ({key, id, title, handleActiveTabChange}) => {
    return (
        <button className="user-dashboard-tab" onClick={() => handleActiveTabChange(id)}>{title}</button>
    )
}

const periodOptions = [ {id: 1, title: PERIOD_OPTIONS.WEEK}, {id: 2, title: PERIOD_OPTIONS.MONTH}, {id: 3, title: PERIOD_OPTIONS.YEAR}, {id: 4, title: PERIOD_OPTIONS.YEARS}]

const PeriodOptionList = ({ children, handleActiveOptionChange }) => {
  return (
    <select className="user-dashboard-option-list" onChange={(e) => handleActiveOptionChange(e.target.value)}>
     {children}
    </select>
   )
 }

const PeriodOption = ({key, id, title}) => {
  return (
      <option className="user-dashboard-option" value={title}>{title}</option>
  )
}

const timeFormatOptions = [ {id: 1, title: ACTIVITY_TIME_FORMAT_OPTIONS.SECONDS}, {id: 2, title: ACTIVITY_TIME_FORMAT_OPTIONS.MINUTES}, {id: 3, title: ACTIVITY_TIME_FORMAT_OPTIONS.HOURS}]

const TimeFormatOptionList = ({ children, handleActiveTimeFormatChange, stateValue }) => {
  return (
    <select className="user-dashboard-option-list" value={stateValue} onChange={(e) => handleActiveTimeFormatChange(e.target.value)}>
     {children}
    </select>
   )
 }

const TimeFormatOption = ({key, id, title}) => {
  return (
      <option className="user-dashboard-option" value={title}>{title}</option>
  )
}

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
      console.log(selected);
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
        <div>
          <TabList>
          {
              tabs.map(
                  tab => <Tab key={tab.id} id={tab.id} title={tab.title} handleActiveTabChange={handleActiveTabChange}/>
              )
              
          }
          </TabList>
          <PeriodOptionList handleActiveOptionChange={handleActiveOptionChange}>
          {
              periodOptions.map(
                  option => <PeriodOption key={option.id} id={option.id} title={option.title}/>
              )
              
          }
          </PeriodOptionList>

          {

            (activeTab === 1)

            &&
            
            <TimeFormatOptionList handleActiveTimeFormatChange={handleActiveTimeFormatChange} stateValue={activeTimeFormatOption}>
            {
                timeFormatOptions.map(
                    option => <TimeFormatOption key={option.id} id={option.id} title={option.title}/>
                )
                
            }
            </TimeFormatOptionList>
          
          }

        </div>
        <div>
          <DatePicker 
            dateFormat="dd/MM/yyyy"
            selected={dateForGraphs}
            onChange={date => setDateForGraphs(date)}
          />
        </div>
        
        {
          (activeTab === 1) ? 
                  <UserBarGraph data={getBarGraphData(userActivityData, userActivityDataPerMonths, activeOption, dateForGraphs, activeTimeFormatOption)}/>
          : (activeTab === 2) ? 
                  <UserLineGraph data={getLineGraphData(allWordsData, allWordsDataPerMonths, activeOption, dateForGraphs)}/>
          : <></>
        }
    </>
    );
    
}




