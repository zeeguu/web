import * as s from "./userDashboard_Styled/UserDashboard.sc";
import NavIcon from "../components/MainNav/NavIcon";
import udstrings from "../i18n/userDashboard";
import CollapsablePanel from "../components/CollapsablePanel";
import * as style from "../components/ProgressItems.sc";
import { getWeeklyProgressOverviewItems, getTotalProgressOverviewItems } from "../utils/progressTracking/ProgressOverviewItems";

export default function ProgressOverview({totalInLearning, totalLearned, weeklyTranslated, totalTranslated}){
    const {weeklyProgressOverview} = getWeeklyProgressOverviewItems({weeklyTranslated});
    const {totalProgressOverview} = getTotalProgressOverviewItems({totalInLearning, totalLearned, totalTranslated});
    return (
        <>
            <s.ProgressOverviewContainer>
            <CollapsablePanel topMessage={udstrings.weeklyProgressOverviewTitle}>
            <s.ProgressOverviewSection>
                {weeklyProgressOverview.map((item, index)=> (
                    <style.ProgressOverviewItem key={index}>
                        <style.IconWithValueAndLabel>
                            <style.IconAndValue>
                                <style.Icon><NavIcon name="words"/></style.Icon>
                                <style.Value> {item.value} </style.Value>
                            </style.IconAndValue>
                            <style.Label>{item.iconText}</style.Label>
                        </style.IconWithValueAndLabel>
                        <style.ProgressDescription>{item.beforeText} {item.value} {item.afterText}</style.ProgressDescription>
                    </style.ProgressOverviewItem>
                ))}
                </s.ProgressOverviewSection>
            </CollapsablePanel>
            </s.ProgressOverviewContainer>

            <s.ProgressOverviewContainer>
            <CollapsablePanel topMessage={udstrings.totalProgressOverviewTitle}>
            <s.ProgressOverviewSection>
                {totalProgressOverview.map((item, index)=> (
                    <style.ProgressOverviewItem key={index}>
                        <style.IconWithValueAndLabel>
                            <style.IconAndValue>
                                <style.Icon><NavIcon name="words"/></style.Icon>
                                <style.Value> {item.value} </style.Value>
                            </style.IconAndValue>
                            <style.Label>{item.iconText}</style.Label>
                        </style.IconWithValueAndLabel>
                        <style.ProgressDescription>{item.beforeText} {item.value} {item.afterText}</style.ProgressDescription>
                    </style.ProgressOverviewItem>
                ))}
            </s.ProgressOverviewSection>
            </CollapsablePanel>
            </s.ProgressOverviewContainer>
         </>
    );
}