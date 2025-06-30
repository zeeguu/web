import {useState, useEffect, useContext} from "react";
import NavIcon from "../components/MainNav/NavIcon";
import { getExerciseProgressSummary } from "../utils/progressTracking/progressData";
import * as s from "../components/progress_tracking/ProgressItems.sc";
import { ProgressContext } from "../contexts/ProgressContext";
import { calculateConsecutivePracticeWeeks, selectTwoRandomItems } from "../utils/progressTracking/progressHelpers";
import { APIContext } from "../contexts/APIContext";
import LoadingAnimation from "../components/LoadingAnimation";

export default function ExercisesProgressSummary() {
    const api = useContext(APIContext);
    const { weeksPracticed, setWeeksPracticed, totalLearned, setTotalLearned, totalInLearning, setTotalInLearning, weeklyPracticed, setWeeklyPracticed } = useContext(ProgressContext);
    const [randomItems, setRandomItems] = useState([]);

    useEffect(() => {
      const allValuesReady =
        weeksPracticed != null &&
        totalLearned != null &&
        totalInLearning != null;
        //weeklyPracticed != null;

        if (allValuesReady){
          const summary = getExerciseProgressSummary({
            totalInLearning,
            totalLearned,
            weeksPracticed,
            //weeklyPracticed
          }).exerciseProgressSummary;
          console.log("summary,", summary);
        const twoRandomItems = selectTwoRandomItems(summary);
        setRandomItems(twoRandomItems);
        }
    },[weeksPracticed, totalLearned, totalInLearning, weeklyPracticed]);
    
    useEffect(() =>{
    api.getAllScheduledBookmarks(false, (bookmarks) => {
      console.log("bookmarks JOHANNA", bookmarks);
      setTotalInLearning(bookmarks.length);
    });

    api.totalLearnedBookmarks((totalLearnedCount) =>{
      console.log("totalLearnedCount JOHANNA", totalLearnedCount);
      setTotalLearned(totalLearnedCount)
    });

    //api.getPracticedBookmarksCountThisWeek((count) => {
      //setWeeklyPracticed(count);
    //});

    api.getUserActivityByDay((activity) => {
        const weeksPracticed = calculateConsecutivePracticeWeeks(activity);
        setWeeksPracticed(weeksPracticed);
    });
    }, []);
    
      if (
    totalInLearning === undefined ||
    totalLearned === undefined ||
    //weeklyPracticed === undefined ||
    weeksPracticed === undefined
  ) {
    return <LoadingAnimation />
  }

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