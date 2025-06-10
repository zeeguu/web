import {useState, useEffect, useContext} from "react";
import NavIcon from "../components/MainNav/NavIcon";
import { getArticlesProgressSummary } from "../utils/progressTracking/progressData";
import { selectTwoRandomItems } from "../utils/progressTracking/progressHelpers";
import { APIContext } from "../contexts/APIContext";
import { ProgressContext } from "../contexts/ProgressContext";
import { calculateTotalReadingMinutes, getWeeklyTranslatedWordsCount} from "../utils/progressTracking/progressHelpers";
import * as s from "../components/progress_tracking/ProgressItems.sc";

export default function ArticlesProgressSummary() {
    const api = useContext(APIContext);
    const { weeklyReadingMinutes, weeklyTranslated, setWeeklyTranslated, weeksPracticed, totalTranslated, setTotalTranslated, totalReadingMinutes, setTotalReadingMinutes} = useContext(ProgressContext);
    const {articlesProgressSummary} = getArticlesProgressSummary({weeklyTranslated, weeklyReadingMinutes, weeksPracticed, totalTranslated, totalReadingMinutes});
    const [randomItems, setRandomItems] = useState([]);

    useEffect(() =>{
        const twoRandomItems = selectTwoRandomItems(articlesProgressSummary);
        setRandomItems(twoRandomItems);

        api.getBookmarksCountsByDate((counts) => {
          const totalTranslatedWords = counts.reduce((sum, day) => sum + day.count, 0);
          setTotalTranslated(totalTranslatedWords);
          const thisWeek = getWeeklyTranslatedWordsCount(counts);
          const weeklyTotal = thisWeek.reduce((sum, day) => sum + day.count, 0);
          setWeeklyTranslated(weeklyTotal);
        })

        api.getUserActivityByDay((activity) => {
          setTotalReadingMinutes(calculateTotalReadingMinutes(activity.reading));
    });
    }, []);
    console.log("randomItems", randomItems);

    return (
        <s.ProgressItemsContainer >
        {randomItems.map((item) => (
          <s.ProgressOverviewItem
            style={{ cursor: 'default', 
            pointerEvents: 'none' }}
          >
            <s.IconWithValueAndLabel>
              <s.IconAndValue>
                <s.Icon><NavIcon name={item.icon}/></s.Icon>
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