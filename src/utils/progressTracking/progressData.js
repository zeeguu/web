import strings from "../../i18n/definitions";
  
export function getTotalMinutesRead(totalReadingMinutes){
    const totalMinutesRead = totalReadingMinutes;
    const totalMinutes = {
        icon: "headerArticles",
        iconText: strings.iconTextTotalArticles,
        value: totalMinutesRead,
        beforeText: strings.articlesReadTextStart,
        afterText: (totalMinutesRead === 1 ? strings.articlesReadTotalTextEndSingle : strings.articlesReadTotalTextEnd) + (totalMinutesRead>0 ? " " + strings.positiveFeedbackMsg1 : ""),
        modal: {
            linkText: "More details on your activty",
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
            linkText: "More details on translation history",
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
        icon: "words",
        iconText: strings.iconTextTotalWordsPracticed,
        value: totalPracticedWords,
        beforeText: strings.wordsPracticedTextStart,
        afterText: (totalPracticedWords === 1 ? strings.wordsTextTotalEndSingle : strings.wordsTextTotalEnd) + (totalPracticedWords>0 ? " " + strings.positiveFeedbackMsg3 : ""),
        modal: {
            linkText: "More details on progress for practiced words",
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
        icon: "words",
        iconText: strings.iconTextTotalWordsLearned,
        value: totalLearnedWords,
        beforeText: strings.wordsLearnedTextStart,
        afterText: (totalLearnedWords === 1 ? strings.wordsTextTotalEndSingle : strings.wordsTextTotalEnd) + (totalLearnedWords>0 ? " " + strings.positiveFeedbackMsg4 : ""),
        modal: {
            linkText: "More details on translation history",
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
            linkText: "More details on your activity",
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
            linkText: "More details on translation history",
            linkTo: "history",
            size: 90,
            unit: "",
        }
    }
    return weeklyTranslatedWords;
  }

    export function getWeeklyStreak(weeksPracticed){
    const weeklyStreak = weeksPracticed;
    const streakWeekly = {
        icon: "headerStreak",
        iconText: strings.iconTextWeeklyStreak,
        value: weeklyStreak,
        beforeText: (weeklyStreak === 1 ? strings.streakTextStartSingle : strings.streakTextStart),
        afterText: (weeklyStreak === 1 ? strings.streakTextEndSingle : strings.streakTextEnd) + (weeklyStreak>0 ? " " + strings.positiveFeedbackMsg3 : ""),
        modal: {
            linkText: "More details on your activity",
            linkTo: "user_dashboard",
            size: 90,
            unit: "weeks",
        }
    }
    return streakWeekly;
  }

  export function getWeeklyWordsPracticed(){
    const value = 1;
    const weeklyWordsPracticed = {
        icon: "words",
        iconText: strings.iconTextWeeklyWordsPracticed,
        value: value,
        beforeText: strings.wordsPracticedTextStart,
        afterText: (value === 1 ? strings.wordsTextWeeklyEndSingle : strings.wordsTextWeeklyEnd) + (value>0 ? " " + strings.positiveFeedbackMsg4 : ""),
        modal: {
            linkText: "More details on translation history",
            linkTo: "history",
            size: 90,
            unit: "",
        }
    }
    return weeklyWordsPracticed;
  }

  export function getTopBarData({weeklyTranslated, weeklyReadingMinutes, weeksPracticed}){
    const weeklyArticlesRead = getWeeklyMinutesRead(weeklyReadingMinutes);
    const weeklyWordsTranslated = getWeeklyWordsTranslated(weeklyTranslated)
    const weeklyStreak = getWeeklyStreak(weeksPracticed);

    const weeklyProgressOverview = [
        weeklyArticlesRead,
        weeklyWordsTranslated,
        weeklyStreak,
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

export function getWeeklyProgressOverviewItems({weeklyTranslated, weeklyReadingMinutes, weeksPracticed}){
    const weeklyArticlesRead = getWeeklyMinutesRead(weeklyReadingMinutes);
    const weeklyWordsTranslated = getWeeklyWordsTranslated(weeklyTranslated);
    const weeklyWordsPracticed = getWeeklyWordsPracticed();
    const weeklyStreak = getWeeklyStreak(weeksPracticed)

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

export function getExerciseProgressSummary({totalInLearning, totalTranslated, totalLearned, totalReadingMinutes, weeksPracticed, weeklyMinutesRead, weeklyTranslated}){
    const totalWordsPracticed = getTotalWordsPracticed(totalInLearning);
    const totalWordsLearned = getTotalWordsLearned(totalLearned)
    const weeklyStreak = getWeeklyStreak(weeksPracticed);
    const weeklyWordsPracticed = getWeeklyWordsPracticed();
    const totalWordsTranslated = getTotalWordsTranslated(totalTranslated);
    const totalMinutesRead = getTotalMinutesRead(totalReadingMinutes);
    const weeklyReadingMinutes = getWeeklyMinutesRead(weeklyMinutesRead);
    const weeklyTranslatedWords = getWeeklyWordsTranslated(weeklyTranslated);


    const exerciseProgressSummary = [
        totalWordsPracticed,
        totalWordsLearned,
        totalWordsTranslated,
        totalMinutesRead,
        weeklyStreak,
        weeklyWordsPracticed,
        weeklyReadingMinutes,
        weeklyTranslatedWords
    ];

    return{
        exerciseProgressSummary
    };
}