import { useEffect, useState, useContext } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import UserCalendar from "./userGraphs/UserCalendar";
import UserLineGraph from "./userGraphs/UserLineGraph";
import UserBarGraph from "./userGraphs/UserBarGraph";
import {PERIOD_OPTIONS} from "./dataFormat/ConstantsUserDashboard";
import { getLineGraphData, getFormattedWordCountData, calculateCountPerMonth} from "./dataFormat/LineGraphDataFormat";
import { getBarGraphData } from "./dataFormat/BarGraphDataFormat";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const tabs = [ {id: 1, title: "First tab"}, {id: 2, title: "Second tab"}, {id: 3, title: "Third tab"}, {id: 4, title: "Forth tab"} ]

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
    const [userActivityData, setuserActivityData] = useState({});


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

      var formatted = getFormattedWordCountData(counts);

      setAllWordsData(formatted);
      
      setAllWordsDataPerMonths(calculateCountPerMonth(formatted));

      });

      api.getUserActivityByDay((activity) => {

        console.log(activity);
        setuserActivityData(activity);
  
      });

    }, [activeTab]);

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
        !(allWordsData || dataForCalendar) ? <LoadingAnimation />
          : (activeTab === 4) ? <UserBarGraph data={getBarGraphData(userActivityData, {}, activeOption, dateForGraphs)}/>
          : (activeTab === 2) ? <UserLineGraph data={getLineGraphData(allWordsData, allWordsDataPerMonths, activeOption, dateForGraphs)}/>
          : (activeTab === 3) ? <UserCalendar data={dataForCalendar}/>
          : (activeTab === 1) ? <></>
          : <></>
        }
    </>
    );
    
}

function mock_data2(){
  return [
    {
      "country": "AD",
      "hot dog": 112,
      "hot dogColor": "hsl(205, 70%, 50%)",
      "burger": 88,
      "burgerColor": "hsl(218, 70%, 50%)",
      "sandwich": 49,
      "sandwichColor": "hsl(270, 70%, 50%)",
      "kebab": 28,
      "kebabColor": "hsl(96, 70%, 50%)",
      "fries": 34,
      "friesColor": "hsl(51, 70%, 50%)",
      "donut": 78,
      "donutColor": "hsl(266, 70%, 50%)"
    },
    {
      "country": "AE",
      "hot dog": 23,
      "hot dogColor": "hsl(14, 70%, 50%)",
      "burger": 90,
      "burgerColor": "hsl(228, 70%, 50%)",
      "sandwich": 86,
      "sandwichColor": "hsl(250, 70%, 50%)",
      "kebab": 89,
      "kebabColor": "hsl(326, 70%, 50%)",
      "fries": 198,
      "friesColor": "hsl(290, 70%, 50%)",
      "donut": 79,
      "donutColor": "hsl(106, 70%, 50%)"
    },
    {
      "country": "AF",
      "hot dog": 180,
      "hot dogColor": "hsl(166, 70%, 50%)",
      "burger": 40,
      "burgerColor": "hsl(176, 70%, 50%)",
      "sandwich": 172,
      "sandwichColor": "hsl(55, 70%, 50%)",
      "kebab": 107,
      "kebabColor": "hsl(86, 70%, 50%)",
      "fries": 175,
      "friesColor": "hsl(322, 70%, 50%)",
      "donut": 5,
      "donutColor": "hsl(163, 70%, 50%)"
    },
    {
      "country": "AG",
      "hot dog": 4,
      "hot dogColor": "hsl(231, 70%, 50%)",
      "burger": 172,
      "burgerColor": "hsl(86, 70%, 50%)",
      "sandwich": 33,
      "sandwichColor": "hsl(14, 70%, 50%)",
      "kebab": 112,
      "kebabColor": "hsl(206, 70%, 50%)",
      "fries": 123,
      "friesColor": "hsl(18, 70%, 50%)",
      "donut": 44,
      "donutColor": "hsl(85, 70%, 50%)"
    },
    {
      "country": "AI",
      "hot dog": 53,
      "hot dogColor": "hsl(238, 70%, 50%)",
      "burger": 184,
      "burgerColor": "hsl(297, 70%, 50%)",
      "sandwich": 68,
      "sandwichColor": "hsl(291, 70%, 50%)",
      "kebab": 122,
      "kebabColor": "hsl(123, 70%, 50%)",
      "fries": 101,
      "friesColor": "hsl(137, 70%, 50%)",
      "donut": 143,
      "donutColor": "hsl(239, 70%, 50%)"
    },
    {
      "country": "AL",
      "hot dog": 106,
      "hot dogColor": "hsl(91, 70%, 50%)",
      "burger": 135,
      "burgerColor": "hsl(187, 70%, 50%)",
      "sandwich": 176,
      "sandwichColor": "hsl(162, 70%, 50%)",
      "kebab": 88,
      "kebabColor": "hsl(14, 70%, 50%)",
      "fries": 147,
      "friesColor": "hsl(229, 70%, 50%)",
      "donut": 95,
      "donutColor": "hsl(159, 70%, 50%)"
    },
    {
      "country": "AM",
      "hot dog": 98,
      "hot dogColor": "hsl(335, 70%, 50%)",
      "burger": 164,
      "burgerColor": "hsl(217, 70%, 50%)",
      "sandwich": 133,
      "sandwichColor": "hsl(120, 70%, 50%)",
      "kebab": 82,
      "kebabColor": "hsl(319, 70%, 50%)",
      "fries": 145,
      "friesColor": "hsl(180, 70%, 50%)",
      "donut": 79,
      "donutColor": "hsl(163, 70%, 50%)"
    }
  ]
}



