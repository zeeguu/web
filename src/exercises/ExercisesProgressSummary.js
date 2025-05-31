import {useState, useEffect} from "react";
import NavIcon from "../components/MainNav/NavIcon";
import { getExerciseProgressSummary } from "../utils/progressTracking/ProgressOverviewItems";
import * as s from "../components/progress_tracking/ProgressItems.sc";

export default function ExercisesProgressSummary({onHandle, totalInLearning, totalLearned, weeksPracticed}) {
    const {exerciseProgressSummary} = getExerciseProgressSummary({totalInLearning, totalLearned, weeksPracticed});
    const [randomItems, setRandomItems] = useState([]);

    function selectTwoRandomItems(items){
      const nonZeroItems = items.filter(item => item.value > 0);

      if (nonZeroItems.length<=2){
        return nonZeroItems;
      };

      const firstIndex = Math.floor(Math.random()* nonZeroItems.length);
      let secondIndex;

      do{
        secondIndex = Math.floor(Math.random() * nonZeroItems.length);
      }
      while (secondIndex === firstIndex);

      return [nonZeroItems[firstIndex], nonZeroItems[secondIndex]];
    };

    useEffect(() =>{
        const twoRandomItems = selectTwoRandomItems(exerciseProgressSummary);
        setRandomItems(twoRandomItems);
    }, []);
    
    return (
        <s.ProgressItemsContainer >
        {randomItems.map((item, index) => (
          <s.ProgressOverviewItem
            style={{ cursor: 'default', 
            pointerEvents: 'none' }}
          >
            <s.IconWithValueAndLabel>
              <s.IconAndValue>
                <s.Icon><NavIcon name="words"/></s.Icon>
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