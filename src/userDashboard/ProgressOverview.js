import {useState, useContext} from "react";
import NavIcon from "../components/MainNav/NavIcon";
import udstrings from "../i18n/userDashboard";
import CollapsablePanel from "../components/CollapsablePanel";
import * as s from "../components/progress_tracking/ProgressItems.sc";
import { getWeeklyProgressOverviewItems, getTotalProgressOverviewItems } from "../utils/progressTracking/progressData";
import ProgressModal from "../components/progress_tracking/ProgressModal";
import { ProgressContext} from "../contexts/ProgressContext";

export default function ProgressOverview(){
    const { weeksPracticed, weeklyTranslated, weeklyReadingMinutes, totalInLearning, totalLearned, totalTranslated, totalReadingMinutes } = useContext(ProgressContext);
    const {weeklyProgressOverview} = getWeeklyProgressOverviewItems({weeklyTranslated, weeklyReadingMinutes, weeksPracticed});    
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
                    <s.ProgressOverviewItem 
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
                                unit: item.modal.unit || "",
                            });
                        }}
                    >
                        <s.IconWithValueAndLabel>
                            <s.IconAndValue>
                                <s.Icon><NavIcon name={item.icon} size='1.3em'/></s.Icon>
                                <s.Value> {item.value} </s.Value>
                            </s.IconAndValue>
                            <s.Label>{item.iconText}</s.Label>
                        </s.IconWithValueAndLabel>
                        <s.ProgressDescription>{item.beforeText} {item.value} {item.afterText}</s.ProgressDescription>
                    </s.ProgressOverviewItem>
                ))}
                </s.ProgressOverviewSection>
            </CollapsablePanel>
            </s.ProgressOverviewContainer>

            <s.ProgressOverviewContainer>
            <CollapsablePanel topMessage={udstrings.totalProgressOverviewTitle}>
            <s.ProgressOverviewSection>
                {totalProgressOverview.map((item, index)=> (
                    <s.ProgressOverviewItem
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
                                unit: item.modal.unit || "",
                            });
                        }}
                    >
                        <s.IconWithValueAndLabel>
                            <s.IconAndValue>
                                <s.Icon><NavIcon name={item.icon} size='1.3em'/></s.Icon>
                                <s.Value> {item.value} </s.Value>
                            </s.IconAndValue>
                            <s.Label>{item.iconText}</s.Label>
                        </s.IconWithValueAndLabel>
                        <s.ProgressDescription>{item.beforeText} {item.value} {item.afterText}</s.ProgressDescription>
                    </s.ProgressOverviewItem>
                ))}
            </s.ProgressOverviewSection>
            </CollapsablePanel>
            </s.ProgressOverviewContainer>
         </>
    );
}