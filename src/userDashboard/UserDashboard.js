import { useEffect, useState, useContext } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import UserLineGraph from "./userGraphs/UserLineGraph";
import UserBarGraph from "./userGraphs/UserBarGraph";
import {PERIOD_OPTIONS} from "./dataFormat/ConstantsUserDashboard";
import { getLineGraphData, calculateCountPerMonth_Words, getMapData} from "./dataFormat/LineGraphDataFormat";
import { getBarGraphData, calculateCountPerMonth_Activity } from "./dataFormat/BarGraphDataFormat";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const tabs = [ {id: 1, title: "First tab"}, {id: 2, title: "Second tab"}, {id: 3, title: "Third tab"} ]

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

const options = [ {id: 1, title: PERIOD_OPTIONS.WEEK}, {id: 2, title: PERIOD_OPTIONS.MONTH}, {id: 3, title: PERIOD_OPTIONS.YEAR}, {id: 4, title: PERIOD_OPTIONS.YEARS}]

const OptionList = ({ children, handleActiveOptionChange }) => {
  return (
    <select className="user-dashboard-option-list" onChange={(e) => handleActiveOptionChange(e.target.value)}>
     {children}
    </select>
   )
 }

const Option = ({key, id, title}) => {
  return (
      <option className="user-dashboard-option" value={title}>{title}</option>
  )
}

export default function UserDashboard({ api }){

    const [activeTab, setActiveTab] = useState(1);
    const [activeOption, setActiveOption] = useState(PERIOD_OPTIONS.WEEK);
    const [dataForCalendar, setDataForCalendar] = useState([]);
    const [allWordsData, setAllWordsData] = useState({});
    const [allWordsDataPerMonths, setAllWordsDataPerMonths] = useState({});
    const [dateForGraphs, setDateForGraphs] = useState(new Date());
    const [userActivityData, setUserActivityData] = useState({});
    const [userActivityDataPerMonths, setUserActivityDataPerMonths] = useState({});

    function handleActiveTabChange(tabId) {
      setActiveTab(tabId);  
    }

    function handleActiveOptionChange(selected) {
      setActiveOption(selected);
    }

    useEffect(() => {

      api.getBookmarksCountsByDate((counts) => {

      const formattedCountsCalendar = counts.map(function(row) {     
          return { day : row.date, value : row.count }
       });

      setDataForCalendar(formattedCountsCalendar);

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
          <OptionList handleActiveOptionChange={handleActiveOptionChange}>
          {
              options.map(
                  option => <Option key={option.id} id={option.id} title={option.title}/>
              )
              
          }
          </OptionList>
          <h4>{activeOption}</h4>
        </div>
        <div>
          <DatePicker 
            selected={dateForGraphs}
            onChange={date => setDateForGraphs(date)}
          />
        </div>
        
        {
        !(allWordsData || dataForCalendar || userActivityData) ? <LoadingAnimation />
          : (activeTab === 2) ? <UserBarGraph data={getBarGraphData(userActivityData, userActivityDataPerMonths, activeOption, dateForGraphs)}/>
          : (activeTab === 3) ? <UserLineGraph data={getLineGraphData(allWordsData, allWordsDataPerMonths, activeOption, dateForGraphs)}/>
          : (activeTab === 1) ? <h2>Press on a tab</h2>
          : <></>
        }
    </>
    );
    
}




