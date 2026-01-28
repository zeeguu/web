import strings from "../../i18n/definitions";

export const DEFAULT_TOPBAR_PREFS = [
  "exercisesTopBar",
  "articleMinutesTopBar",
  "streakTopBar",
];

  
export function getTotalMinutesRead(totalReadingMinutes){
    const totalMinutesRead = totalReadingMinutes;
    const totalMinutes = {
        icon: "headerArticles",
        iconText: strings.iconTextTotalArticles,
        value: totalMinutesRead,
        beforeText: strings.articlesReadTextStart,
        afterText: (totalMinutesRead === 1 ? strings.articlesReadTotalTextEndSingle : strings.articlesReadTotalTextEnd) + (totalMinutesRead>0 ? " " + strings.positiveFeedbackMsg1 : ""),
        modal: {
            linkText: "See reading and practice stats",
            linkTo: "user_dashboard?tab=time",
            size: 90,
            unit: "minutes"
        }
    }
    return totalMinutes;
  }

  export function getTotalWordsTranslated(totalTranslated){
    const totalTranslatedWords = totalTranslated;
    const totalWordsTranslated = {
        icon: "words",
        iconText: strings.iconTextTotalWordsTranslated,
        value: totalTranslatedWords,
        beforeText: strings.wordsTranslatedTextStart,
        afterText: (totalTranslatedWords === 1 ? strings.wordsTextWeeklyEndSingle : strings.wordsTextTotalEnd) + (totalTranslatedWords>0 ? " " + strings.positiveFeedbackMsg2 : ""),
        modal: {
            linkText: "See all translated words",
            linkTo: "history",
            size: 90,
            unit: "",
        }
    }
    return totalWordsTranslated;
  }

export function getTotalWordsPracticed(totalInLearning, totalLearned){
    const totalPracticedWords = totalInLearning + totalLearned;
    const totalWordsPracticed = {
        icon: "exercises",
        iconText: strings.iconTextTotalWordsPracticed,
        value: totalPracticedWords,
        beforeText: strings.wordsPracticedTextStart,
        afterText: (totalPracticedWords === 1 ? strings.wordsTextTotalEndSingle : strings.wordsTextTotalEnd) + (totalPracticedWords>0 ? " " + strings.positiveFeedbackMsg3 : ""),
        modal: {
            linkText: "See your word learning progress",
            linkTo: "words",
            size: 90,
            unit: "",
        }
    }
    return totalWordsPracticed;
  }

export function getTotalWordsLearned(totalLearned){
    const totalLearnedWords = totalLearned;
    const totalWordsLearned= {
        icon: "school",
        iconText: strings.iconTextTotalWordsLearned,
        value: totalLearnedWords,
        beforeText: strings.wordsLearnedTextStart,
        afterText: (totalLearnedWords === 1 ? strings.wordsTextTotalEndSingle : strings.wordsTextTotalEnd) + (totalLearnedWords>0 ? " " + strings.positiveFeedbackMsg4 : ""),
        modal: {
            linkText: "See your learned words",
            linkTo: "words/learned",
            size: 90,
            unit: "",
        }
    }
    return totalWordsLearned;
  }

    export function getWeeklyMinutesRead(weeklyReadingMinutes){
    const weeklyMinutesRead = weeklyReadingMinutes;
    const weeklyArticlesRead = {
        icon: "headerArticles",
        iconText: strings.iconTextWeeklyArticles,
        value: weeklyMinutesRead,
        beforeText: strings.articlesReadTextStart,
        afterText: (weeklyMinutesRead === 1 ? strings.articlesReadWeeklyTextEndSingle : strings.articlesReadWeeklyTextEnd) + (weeklyMinutesRead>0 ? " " + strings.positiveFeedbackMsg1 : ""),
        modal: {
            linkText: "See reading and practice stats",
            linkTo: "user_dashboard?tab=time",
            size: 90,
            unit: "minutes",
        }
    }
    return weeklyArticlesRead
  }

    export function getWeeklyWordsTranslated(weeklyTranslated){
    const weeklyWordsTranslated = weeklyTranslated;
    const weeklyTranslatedWords = {
        icon: "words",
        iconText: strings.iconTextWeeklyWordsTranslated,
        value: weeklyWordsTranslated,
        beforeText: strings.wordsTranslatedTextStart,
        afterText: (weeklyWordsTranslated === 1 ? strings.wordsTextWeeklyEndSingle : strings.wordsTextWeeklyEnd) + (weeklyWordsTranslated>0 ? " " + strings.positiveFeedbackMsg2 : ""),
        modal: {
            linkText: "See all translated words",
            linkTo: "history",
            size: 90,
            unit: "",
        }
    }
    return weeklyTranslatedWords;
  }

    export function getDailyStreak(daysPracticed){
    const dailyStreak = daysPracticed ?? 0;
    const streakDaily = {
        icon: "headerStreak",
        iconText: strings.iconTextDailyStreak,
        value: dailyStreak,
        asteriks: strings.streakAsteriks,
        beforeText: (dailyStreak === 1 ? strings.streakTextStartSingle : strings.streakTextStart),
        afterText: (dailyStreak === 1 ? strings.streakTextEndSingle : strings.streakTextEnd) + (dailyStreak>0 ? " " + strings.positiveFeedbackMsg3 : ""),
        modal: {
            linkText: "See reading and practice stats",
            linkTo: "user_dashboard?tab=time",
            size: 90,
            unit: "days",
        }
    }
    return streakDaily;
  }

  export function getWeeklyExercises(weeklyExercises){
    const exerciseCount = weeklyExercises ?? 0;
    const weeklyExercisesData = {
        icon: "exercises",
        iconText: strings.iconTextWeeklyExercises,
        value: exerciseCount,
        beforeText: strings.exercisesTextStart,
        afterText: (exerciseCount === 1 ? strings.exercisesTextEndSingle : strings.exercisesTextEnd) + (exerciseCount > 0 ? " " + strings.positiveFeedbackMsg4 : ""),
        modal: {
            linkText: "See your word learning progress",
            linkTo: "words",
            size: 90,
            unit: "",
        }
    }
    return weeklyExercisesData;
  }

  export function getTopBarData({weeklyReadingMinutes, daysPracticed, weeklyExercises}){
    const weeklyArticlesRead = getWeeklyMinutesRead(weeklyReadingMinutes);
    const weeklyExercisesData = getWeeklyExercises(weeklyExercises);
    const dailyStreak = getDailyStreak(daysPracticed);

    const weeklyProgressOverview = [
        weeklyArticlesRead,
        weeklyExercisesData,
        dailyStreak,
    ];

    return{
        weeklyProgressOverview
    };

}

  export function getTotalProgressOverviewItems({totalInLearning, totalLearned, totalTranslated, totalReadingMinutes}){
    const totalWordsLearned = getTotalWordsLearned(totalLearned);
    const totalArticlesRead = getTotalMinutesRead(totalReadingMinutes);
    const totalWordsTranslated = getTotalWordsTranslated(totalTranslated);
    const totalWordsPracticed = getTotalWordsPracticed(totalInLearning, totalLearned);

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

export function getWeeklyProgressOverviewItems({weeklyTranslated, weeklyReadingMinutes, daysPracticed, weeklyExercises}){
    const weeklyArticlesRead = getWeeklyMinutesRead(weeklyReadingMinutes);
    const weeklyWordsTranslated = getWeeklyWordsTranslated(weeklyTranslated);
    const weeklyExercisesData = getWeeklyExercises(weeklyExercises);
    const dailyStreak = getDailyStreak(daysPracticed)

    const weeklyProgressOverview = [
        weeklyArticlesRead,
        weeklyWordsTranslated,
        weeklyExercisesData,
        dailyStreak,
    ];

    return{
        weeklyProgressOverview
    };

}

export function getExerciseProgressSummary({totalInLearning, totalLearned, daysPracticed, weeklyExercises}){
    const totalWordsPracticed = getTotalWordsPracticed(totalInLearning, totalLearned);
    const totalWordsLearned = getTotalWordsLearned(totalLearned)
    const dailyStreak = getDailyStreak(daysPracticed);
    const weeklyExercisesData = getWeeklyExercises(weeklyExercises);


    const exerciseProgressSummary = [
        totalWordsPracticed,
        totalWordsLearned,
        dailyStreak,
        weeklyExercisesData,
    ];

    return{
        exerciseProgressSummary
    };
}

export function getArticlesProgressSummary({weeklyTranslated, weeklyReadingMinutes, daysPracticed, totalTranslated, totalReadingMinutes }){
    const dailyStreak = getDailyStreak(daysPracticed);
    const totalWordsTranslated = getTotalWordsTranslated(totalTranslated);
    const totalMinutesRead = getTotalMinutesRead(totalReadingMinutes);
    const weeklyMinutesRead = getWeeklyMinutesRead(weeklyReadingMinutes);
    const weeklyTranslatedWords = getWeeklyWordsTranslated(weeklyTranslated);


    const articlesProgressSummary = [
        totalWordsTranslated,
        totalMinutesRead,
        dailyStreak,
        weeklyMinutesRead,
        weeklyTranslatedWords
    ];

    return{
        articlesProgressSummary
    };
}