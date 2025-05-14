import {useState, useContext, useEffect} from "react";
import {UserContext} from "../contexts/UserContext";
import { StyledButton } from "../components/allButtons.sc";
import NavIcon from "../components/MainNav/NavIcon";
import { getExerciseProgressSummary } from "../utils/progressTracking/ProgressOverviewItems";
import * as s from "../components/progress_tracking/ProgressItems.sc";



export default function ExercisesProgressSummary({onHandle, totalInLearning, totalLearned}){
    const [username, setUsername] = useState();
    const {userDetails} = useContext(UserContext);
    const {exerciseProgressSummary} = getExerciseProgressSummary({totalInLearning, totalLearned});
    const [randomItems, setRandomItems] = useState([]);

    function selectTwoRandomItems(items){
      const nonZeroItems = items.filter(item => item.value !== 0);

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
        setUsername(userDetails.name);

        const twoRandomItems = selectTwoRandomItems(exerciseProgressSummary);
        setRandomItems(twoRandomItems);
    }, []);
    
    return (
        <>
        <CenteredColumn className="centeredColumn">
          <h1>
            Exercise complete!
          </h1>
        </CenteredColumn>
        <CenteredColumn>
        <p>You have made progress. Here's a glimpse showing what you improved after completing this exercise. Awesome, {username}!</p>
        </CenteredColumn>
        {randomItems.map((item, index) => (
        <CenteredColumn key={index}>
          <s.ProgressOverviewItem>
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
        </CenteredColumn>
      ))}
        <CenteredColumn>
        <StyledButton primary onClick={onHandle}> 
                Continue
            </StyledButton>
        </CenteredColumn>           
        </>
    );
}