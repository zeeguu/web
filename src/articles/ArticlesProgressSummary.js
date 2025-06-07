import {useState, useEffect} from "react";
import NavIcon from "../components/MainNav/NavIcon";
import { getArticlesProgressSummary } from "../utils/progressTracking/progressData";
import { selectTwoRandomItems } from "../utils/progressTracking/progressHelpers";

import * as s from "../components/progress_tracking/ProgressItems.sc";

export default function ArticlesProgressSummary({weeklyTranslated, weeklyMinutesRead, weeksPracticed, totalTranslated, totalReadingMinutes }) {
    const {articlesProgressSummary} = getArticlesProgressSummary({weeklyTranslated, weeklyMinutesRead, weeksPracticed, totalTranslated, totalReadingMinutes});
    const [randomItems, setRandomItems] = useState([]);

    useEffect(() =>{
        const twoRandomItems = selectTwoRandomItems(articlesProgressSummary);
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