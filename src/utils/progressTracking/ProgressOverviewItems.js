import strings from "../../i18n/definitions";

export function calculateTotalReadingMinutes(readingActivity){
    const totalReadingSeconds = readingActivity.reduce(
        (sum, entry) => sum + entry.seconds,
        0
    );
    return Math.floor(totalReadingSeconds / 60);
};

export function getWeeklyTranslatedWordsCount(data){
    //converts the Map to an array of objects     
    const dataArray = Array.from(data, ([date, count]) => ({ date, count }));

    //show current date eg Wed May 14 2025 20:00:39 GMT+0200 (centraleuropeisk sommartid)
    const now = new Date();

    //day of week wednesday = 3
    const dayOfWeek = now.getDay();

    //danish way. Now wed = 2
    const shiftNumOfDay = (dayOfWeek + 6) % 7;

    //sets startOfWeek to
    //wed = 3
    const startOfWeek = new Date(now);
    //3-2 = 1 e.g monday -> start of week = monday
    startOfWeek.setDate(now.getDate()- shiftNumOfDay)
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate()+6);
    endOfWeek.setHours(23, 59, 59, 999);

    return dataArray.filter(({date}) => {
      const dayDate = new Date(date);
      return dayDate >= startOfWeek && dayDate <= endOfWeek; 
    });
  }

export function getTotalProgressOverviewItems({totalInLearning, totalLearned, totalTranslated, totalReadingMinutes}){
    const totalTranslatedWords = totalTranslated;
    const totalPracticedWords = totalInLearning;
    const totalLearnedWords = totalLearned;
    const totalMinutesRead = totalReadingMinutes;

    const totalArticlesRead = {
        iconText: strings.iconTextTotalArticles,
        value: totalMinutesRead,
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

export function getWeeklyProgressOverviewItems({weeklyTranslated}){
    const weeklyTranslatedWords = weeklyTranslated;


    const weeklyArticlesRead = {
        iconText: strings.iconTextWeeklyArticles,
        value: 3,
        beforeText: strings.articlesReadTextStart,
        afterText: strings.articlesReadWeeklyTextEnd,
    };

    const weeklyWordsTranslated = {
        iconText: strings.iconTextWeeklyWordsTranslated,
        value: weeklyTranslatedWords,
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