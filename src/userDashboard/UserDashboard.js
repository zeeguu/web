import { useEffect, useState, useContext } from "react";
import UserStats from "./UserStats";
import UserStatsTest1 from "./UserStatsTest1";

const tabs = [ {id: 1, title: "First tab"}, {id: 2, title: "Second tab"}, {id: 3, title: "Third tab"} ]

const TabList = ({children}) => {
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

export default function UserDashboard(){

    const user_data = mock_data() 
    const [activeTab, setActiveTab] = useState(1);

    function handleActiveTabChange(tab_id) {
      setActiveTab(tab_id)
    }

    return (
    <div>
        Hello user, here's some data
        <TabList>
        {
            tabs.map(
                tab => <Tab key={tab.id} id={tab.id} title={tab.title} handleActiveTabChange={handleActiveTabChange}/>
            )
        }
        </TabList>
        {activeTab === 1  && <UserStats user_data={user_data}/>}
        {activeTab === 2  && <UserStatsTest1 user_data={mock_data2()}/>}
        {activeTab === 3 && "this is third tab"}
    </div>
    );
    
}

function mock_data() {
    const data = [
        {
          "id": "japan",
          "color": "hsl(99, 70%, 50%)",
          "data": [
            {
              "x": "plane",
              "y": 58
            },
            {
              "x": "helicopter",
              "y": 200
            },
            {
              "x": "boat",
              "y": 101
            },
            {
              "x": "train",
              "y": 247
            },
            {
              "x": "subway",
              "y": 16
            },
            {
              "x": "bus",
              "y": 108
            },
            {
              "x": "car",
              "y": 25
            },
            {
              "x": "moto",
              "y": 107
            },
            {
              "x": "bicycle",
              "y": 94
            },
            {
              "x": "horse",
              "y": 3
            },
            {
              "x": "skateboard",
              "y": 207
            },
            {
              "x": "others",
              "y": 98
            }
          ]
        },
        {
          "id": "france",
          "color": "hsl(325, 70%, 50%)",
          "data": [
            {
              "x": "plane",
              "y": 19
            },
            {
              "x": "helicopter",
              "y": 0
            },
            {
              "x": "boat",
              "y": 130
            },
            {
              "x": "train",
              "y": 261
            },
            {
              "x": "subway",
              "y": 269
            },
            {
              "x": "bus",
              "y": 279
            },
            {
              "x": "car",
              "y": 125
            },
            {
              "x": "moto",
              "y": 27
            },
            {
              "x": "bicycle",
              "y": 206
            },
            {
              "x": "horse",
              "y": 203
            },
            {
              "x": "skateboard",
              "y": 1
            },
            {
              "x": "others",
              "y": 241
            }
          ]
        },
        {
          "id": "us",
          "color": "hsl(295, 70%, 50%)",
          "data": [
            {
              "x": "plane",
              "y": 297
            },
            {
              "x": "helicopter",
              "y": 45
            },
            {
              "x": "boat",
              "y": 93
            },
            {
              "x": "train",
              "y": 31
            },
            {
              "x": "subway",
              "y": 204
            },
            {
              "x": "bus",
              "y": 180
            },
            {
              "x": "car",
              "y": 134
            },
            {
              "x": "moto",
              "y": 191
            },
            {
              "x": "bicycle",
              "y": 117
            },
            {
              "x": "horse",
              "y": 188
            },
            {
              "x": "skateboard",
              "y": 300
            },
            {
              "x": "others",
              "y": 280
            }
          ]
        },
        {
          "id": "germany",
          "color": "hsl(272, 70%, 50%)",
          "data": [
            {
              "x": "plane",
              "y": 56
            },
            {
              "x": "helicopter",
              "y": 103
            },
            {
              "x": "boat",
              "y": 205
            },
            {
              "x": "train",
              "y": 224
            },
            {
              "x": "subway",
              "y": 195
            },
            {
              "x": "bus",
              "y": 41
            },
            {
              "x": "car",
              "y": 177
            },
            {
              "x": "moto",
              "y": 175
            },
            {
              "x": "bicycle",
              "y": 228
            },
            {
              "x": "horse",
              "y": 17
            },
            {
              "x": "skateboard",
              "y": 198
            },
            {
              "x": "others",
              "y": 1
            }
          ]
        },
        {
          "id": "norway",
          "color": "hsl(263, 70%, 50%)",
          "data": [
            {
              "x": "plane",
              "y": 63
            },
            {
              "x": "helicopter",
              "y": 104
            },
            {
              "x": "boat",
              "y": 61
            },
            {
              "x": "train",
              "y": 139
            },
            {
              "x": "subway",
              "y": 132
            },
            {
              "x": "bus",
              "y": 168
            },
            {
              "x": "car",
              "y": 243
            },
            {
              "x": "moto",
              "y": 208
            },
            {
              "x": "bicycle",
              "y": 36
            },
            {
              "x": "horse",
              "y": 77
            },
            {
              "x": "skateboard",
              "y": 157
            },
            {
              "x": "others",
              "y": 256
            }
          ]
        }
      ]
      
    return data;
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



