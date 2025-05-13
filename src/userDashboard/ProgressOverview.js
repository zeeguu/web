import * as s from "./userDashboard_Styled/UserDashboard.sc";
import NavIcon from "../components/MainNav/NavIcon";
import strings from "../i18n/definitions";
import udstrings from "../i18n/userDashboard";
import CollapsablePanel from "../components/CollapsablePanel";
import * as style from "../components/ProgressItems.sc";

export default function ProgressOverview({totalInLearning, totalToLearn, totalLearned}){

  const totalTranslatedWords = totalInLearning + totalToLearn + totalLearned;
  const totalPracticedWords = totalInLearning;
  const totalLearnedWords = totalLearned;

  const weeklyProgressOverview = [
    {
        iconText: strings.iconTextWeeklyArticles,
        value: 3,
        beforeText: strings.articlesReadTextStart,
        afterText: strings.articlesReadWeeklyTextEnd,
    },
    {
        iconText: strings.iconTextWeeklyWordsTranslated,
        value: 4,
        beforeText: strings.wordsTranslatedTextStart,
        afterText: strings.wordsTextWeeklyEnd,
    },
    {
        iconText: strings.iconTextWeeklyWordsPracticed,
        value: 16,
        beforeText: strings.wordsPracticedTextStart,
        afterText: strings.wordsTextWeeklyEnd,
    },
    {
        iconText: strings.iconTextWeeklyStreak,
        value: 5,
        beforeText: "Words current in your learning pipeline.",
        afterText: "xxx",
    },
  ]

  const totalProgressOverview = [
    {
        iconText: strings.iconTextTotalArticles,
        value: 75,
        beforeText: strings.articlesReadTextStart,
        afterText: strings.articlesReadTotalTextEnd,
    },
    {
        iconText: strings.iconTextTotalWordsTranslated,
        value: totalTranslatedWords,
        beforeText: strings.wordsTranslatedTextStart,
        afterText: strings.wordsTextTotalEnd,
    },
    {
        iconText: strings.iconTextTotalWordsPracticed,
        value: totalPracticedWords,
        beforeText: strings.wordsPracticedTextStart,
        afterText: strings.wordsTextTotalEnd,
    },
    {
        iconText: strings.iconTextTotalWordsLearned,
        value: totalLearnedWords,
        beforeText: strings.wordsLearnedTextStart,
        afterText: strings.wordsTextTotalEnd,
    },
  ]

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