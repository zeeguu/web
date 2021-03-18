import { useEffect, useState, useContext } from "react";
import UserStats from "./UserStats";

export default function UserDashboard(){
    const user_data = mock_data() 
    console.log(user_data)

    return <div>
        Hello user, here's some data
        <UserStats user_data={user_data}/>
    </div>
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



