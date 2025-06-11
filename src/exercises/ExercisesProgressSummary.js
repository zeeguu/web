import {useState, useEffect} from "react";
import NavIcon from "../components/MainNav/NavIcon";
import { getExerciseProgressSummary } from "../utils/progressTracking/progressData";
import { selectTwoRandomItems } from "../utils/progressTracking/progressHelpers";
import * as s from "../components/progress_tracking/ProgressItems.sc";

export default function ExercisesProgressSummary({totalInLearning, totalLearned, weeksPracticed, weeklyPracticed}) {
    const {exerciseProgressSummary} = getExerciseProgressSummary({totalInLearning, totalLearned, weeksPracticed, weeklyPracticed});
    const [randomItems, setRandomItems] = useState([]);

    
    useEffect(() =>{
        const twoRandomItems = selectTwoRandomItems(exerciseProgressSummary);
        setRandomItems(twoRandomItems);
    }, []);
    
    return (
        <s.ProgressItemsContainer >
        {randomItems.map((item) => (
          <s.ProgressOverviewItem
            style={{ cursor: 'default', 
            pointerEvents: 'none' }}
          >
            <s.IconWithValueAndLabel>
              <s.IconAndValue>
                <s.Icon><NavIcon name={item.icon} size='1.3em'/></s.Icon>
                <s.Value> {item.value} </s.Value>
              </s.IconAndValue>
              <s.Label>{item.iconText}</s.Label>
            </s.IconWithValueAndLabel>
            <s.ProgressDescription>
              {item.beforeText} {item.value} {item.afterText}
            </s.ProgressDescription>
          </s.ProgressOverviewItem>
      ))}       
        </s.ProgressItemsContainer>
    );
}