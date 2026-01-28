import {useState, useEffect, useContext} from "react";
import NavIcon from "../components/MainNav/NavIcon";
import { getExerciseProgressSummary } from "../utils/progressTracking/progressData";
import * as s from "../components/progress_tracking/ProgressItems.sc";
import { ProgressContext } from "../contexts/ProgressContext";
import { selectTwoRandomItems } from "../utils/progressTracking/progressHelpers";
import { APIContext } from "../contexts/APIContext";
import LoadingAnimation from "../components/LoadingAnimation";

export default function ExercisesProgressSummary() {
    const api = useContext(APIContext);
    const { daysPracticed, totalLearned, setTotalLearned, totalInLearning, setTotalInLearning, weeklyExercises, setWeeklyExercises } = useContext(ProgressContext);
    const [randomItems, setRandomItems] = useState([]);

    useEffect(() => {
      const allValuesReady =
        daysPracticed != null &&
        totalLearned != null &&
        totalInLearning != null &&
        weeklyExercises != null;

        if (allValuesReady){
          const summary = getExerciseProgressSummary({
            totalInLearning,
            totalLearned,
            daysPracticed,
            weeklyExercises,
          }).exerciseProgressSummary;
        const twoRandomItems = selectTwoRandomItems(summary);
        setRandomItems(twoRandomItems);
        }
    },[daysPracticed, totalLearned, totalInLearning, weeklyExercises]);
    
    useEffect(() =>{
    api.getAllScheduledBookmarks(false, (bookmarks) => {
      setTotalInLearning(bookmarks.length);
    });

    api.totalLearnedBookmarks((totalLearnedCount) =>{
      setTotalLearned(totalLearnedCount)
    });

    api.getExercisesCompletedThisWeek((count) => {
      setWeeklyExercises(count);
    });
    }, []);
    
      if (
    totalInLearning === undefined ||
    totalLearned === undefined ||
    weeklyExercises === undefined ||
    daysPracticed === undefined
  ) {
    return <LoadingAnimation />
  }

    return (
        <s.ProgressItemsContainer >
        {randomItems.map((item, index) => (
          <s.ProgressOverviewItem
            key={index}
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