import strings from "../../i18n/definitions";

export function getTotalProgressOverviewItems({totalInLearning, totalToLearn, totalLearned}){
    const totalTranslatedWords = totalInLearning + totalToLearn + totalLearned;
    const totalPracticedWords = totalInLearning;
    const totalLearnedWords = totalLearned;

    const totalArticlesRead = {
        iconText: strings.iconTextTotalArticles,
        value: 75,
        beforeText: strings.articlesReadTextStart,
        afterText: strings.articlesReadTotalTextEnd,
    };
    
    const totalWordsTranslated = {
        iconText: strings.iconTextTotalWordsTranslated,
        value: totalTranslatedWords,
        beforeText: strings.wordsTranslatedTextStart,
        afterText: strings.wordsTextTotalEnd,
    };
    
    const totalWordsPracticed = {
        iconText: strings.iconTextTotalWordsPracticed,
        value: totalPracticedWords,
        beforeText: strings.wordsPracticedTextStart,
        afterText: strings.wordsTextTotalEnd,
    };
    
    const totalWordsLearned = {
        iconText: strings.iconTextTotalWordsLearned,
        value: totalLearnedWords,
        beforeText: strings.wordsLearnedTextStart,
        afterText: strings.wordsTextTotalEnd,
    };

    const totalProgressOverview = [
        totalArticlesRead,
        totalWordsTranslated,
        totalWordsPracticed,
        totalWordsLearned,
    ];

    return{
        totalProgressOverview
    };
}

export function getWeeklyProgressOverviewItems(){
    const weeklyArticlesRead = {
        iconText: strings.iconTextWeeklyArticles,
        value: 3,
        beforeText: strings.articlesReadTextStart,
        afterText: strings.articlesReadWeeklyTextEnd,
    };

    const weeklyWordsTranslated = {
        iconText: strings.iconTextWeeklyWordsTranslated,
        value: 4,
        beforeText: strings.wordsTranslatedTextStart,
        afterText: strings.wordsTextWeeklyEnd,
    };

    const weeklyWordsPracticed = {
        iconText: strings.iconTextWeeklyWordsPracticed,
        value: 16,
        beforeText: strings.wordsPracticedTextStart,
        afterText: strings.wordsTextWeeklyEnd,
    };

    const weeklyStreak = {
        iconText: strings.iconTextWeeklyStreak,
        value: 5,
        beforeText: "Words current in your learning pipeline.",
        afterText: "xxx",
    };

    const weeklyProgressOverview = [
        weeklyArticlesRead,
        weeklyWordsTranslated,
        weeklyWordsPracticed,
        weeklyStreak,
    ];

    return{
        weeklyProgressOverview
    };

}


export function getExerciseProgressSummary({totalInLearning, totalLearned}){
    const totalPracticedWords = totalInLearning;
    const totalLearnedWords = totalLearned;
    
    const totalWordsPracticed = {
        iconText: strings.iconTextTotalWordsPracticed,
        value: totalPracticedWords,
        beforeText: strings.wordsPracticedTextStart,
        afterText: strings.wordsTextTotalEnd,
    };
    
    const totalWordsLearned = {
        iconText: strings.iconTextTotalWordsLearned,
        value: totalLearnedWords,
        beforeText: strings.wordsLearnedTextStart,
        afterText: strings.wordsTextTotalEnd,
    };

    const weeklyStreak = {
        iconText: strings.iconTextWeeklyStreak,
        value: 5,
        beforeText: "Words current in your learning pipeline.",
        afterText: "xxx",
    };

    const weeklyWordsPracticed = {
        iconText: strings.iconTextWeeklyWordsPracticed,
        value: 16,
        beforeText: strings.wordsPracticedTextStart,
        afterText: strings.wordsTextWeeklyEnd,
    };

    const exerciseProgressSummary = [
        totalWordsPracticed,
        totalWordsLearned,
        weeklyStreak,
        weeklyWordsPracticed,
    ];

    return{
        exerciseProgressSummary
    };
}