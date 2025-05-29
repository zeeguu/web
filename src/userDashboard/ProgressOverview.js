import {useState} from "react";
import * as s from "./userDashboard_Styled/UserDashboard.sc";
import NavIcon from "../components/MainNav/NavIcon";
import udstrings from "../i18n/userDashboard";
import CollapsablePanel from "../components/CollapsablePanel";
import * as style from "../components/progress_tracking/ProgressItems.sc";
import { getWeeklyProgressOverviewItems, getTotalProgressOverviewItems } from "../utils/progressTracking/ProgressOverviewItems";
import ProgressModal from "../components/progress_tracking/ProgressModal";

export default function ProgressOverview({totalInLearning, totalLearned, weeklyTranslated, totalTranslated, totalReadingMinutes, weeklyReadingMinutes, weeksPracticed}){
    const {weeklyProgressOverview} = getWeeklyProgressOverviewItems({weeklyTranslated, weeklyReadingMinutes,weeksPracticed});
    console.log("weeklyProgressOverview", weeklyProgressOverview);
    
    const {totalProgressOverview} = getTotalProgressOverviewItems({totalInLearning, totalLearned, totalTranslated, totalReadingMinutes});
    const [showModalData, setShowModalData] = useState(null);
    return (
        <>
            {showModalData && (
                <ProgressModal {...showModalData}/>
            )}
            <s.ProgressOverviewContainer>
            <CollapsablePanel topMessage={udstrings.weeklyProgressOverviewTitle}>
            <s.ProgressOverviewSection>
                {weeklyProgressOverview.map((item, index)=> (
                    <style.ProgressOverviewItem 
                        key={index}
                        onClick= {() => {
                            const modalDefaults = item.modal || {};
                            setShowModalData({
                                ...modalDefaults,
                                open: true,
                                setOpen: () => setShowModalData(null),
                                value: item.value,
                                title: item.iconText,   
                                descriptionStart: item.beforeText, 
                                descriptionEnd: item.afterText,
                                iconName: item.icon,
                                unit: item.unit || "",
                            });
                        }}
                    >
                        <style.IconWithValueAndLabel>
                            <style.IconAndValue>
                                <style.Icon><NavIcon name={item.icon}/></style.Icon>
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
                    <style.ProgressOverviewItem
                        key={index}
                        onClick= {() => {
                            const modalDefaults = item.modal || {};
                            setShowModalData({
                                ...modalDefaults,
                                open: true,
                                setOpen: () => setShowModalData(null),
                                value: item.value,
                                title: item.iconText,    
                                descriptionStart: item.beforeText,
                                descriptionEnd: item.afterText,
                                iconName: item.icon,
                                unit: item.unit || "",
                            });
                        }}
                    >
                        <style.IconWithValueAndLabel>
                            <style.IconAndValue>
                                <style.Icon><NavIcon name={item.icon}/></style.Icon>
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