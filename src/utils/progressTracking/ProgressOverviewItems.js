import strings from "../../i18n/definitions";

export function getCurrentWeekRange(){
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

    return {startOfWeek, endOfWeek}
}

export function calculateWeeklyReadingMinutes(readingActivity){
    const { startOfWeek, endOfWeek } = getCurrentWeekRange();
    const weeklyReadingSeconds = readingActivity.reduce((sum, entry) => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0); // normalize to midnight

        if (entryDate >= startOfWeek && entryDate <= endOfWeek) {
            return sum + entry.seconds;
        }
        return sum;
    }, 0);

    return Math.floor(weeklyReadingSeconds / 60);
}

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
    const {startOfWeek, endOfWeek} = getCurrentWeekRange();
   
    return dataArray.filter(({date}) => {
      const dayDate = new Date(date);
      return dayDate >= startOfWeek && dayDate <= endOfWeek; 
    });
  }

  export function getWeeklyTranslatedWordsTopBar(counts) {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); 
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); 
  
    return counts
      .filter((item) => {
        const itemDate = new Date(item.date);
        return (
          itemDate >= startOfWeek &&
          itemDate <= endOfWeek &&
          item.count !== undefined &&
          !isNaN(item.count)
        );
      })
      .map((item) => ({
        ...item,
        count: item.count || 0, 
      }));
  };


export function getTotalProgressOverviewItems({totalInLearning, totalLearned, totalTranslated, totalReadingMinutes}){
    const totalTranslatedWords = totalTranslated;
    const totalPracticedWords = totalInLearning;
    const totalLearnedWords = totalLearned;
    const totalMinutesRead = totalReadingMinutes;

    const totalArticlesRead = {
        icon: "headerArticles",
        iconText: strings.iconTextTotalArticles,
        value: totalMinutesRead,
        beforeText: strings.articlesReadTextStart,
        afterText: strings.articlesReadTotalTextEnd,
        modal: {
            linkText: "More details on your activty",
            linkTo: "user_dashboard",
            size: 90,
        }
    };
    
    const totalWordsTranslated = {
        icon: "words",
        iconText: strings.iconTextTotalWordsTranslated,
        value: totalTranslatedWords,
        beforeText: strings.wordsTranslatedTextStart,
        afterText: strings.wordsTextTotalEnd,
        modal: {
            linkText: "More details on translation history",
            linkTo: "history",
            size: 90,
        }
    };
    
    const totalWordsPracticed = {
        icon: "words",
        iconText: strings.iconTextTotalWordsPracticed,
        value: totalPracticedWords,
        beforeText: strings.wordsPracticedTextStart,
        afterText: strings.wordsTextTotalEnd,
        modal: {
            linkText: "More details on word progress",
            linkTo: "words",
            size: 90,
        }
    };
    
    const totalWordsLearned = {
        icon: "words",
        iconText: strings.iconTextTotalWordsLearned,
        value: totalLearnedWords,
        beforeText: strings.wordsLearnedTextStart,
        afterText: strings.wordsTextTotalEnd,
        modal: {
            linkText: "More details about words learned",
            linkTo: "words/learned",
            size: 90,
        }
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

export function getTopBarData({weeklyTranslated, weeklyReadingMinutes, weeksPracticed}){
    const weeklyTranslatedWords = weeklyTranslated;
    const weeklyMinutesRead = weeklyReadingMinutes;
    const totalWeeksPracticed = weeksPracticed;

    const weeklyArticlesRead = {
        icon: "headerArticles",
        iconText: strings.iconTextWeeklyArticles,
        value: weeklyMinutesRead,
        beforeText: strings.articlesReadTextStart,
        afterText: strings.articlesReadWeeklyTextEnd,
        modal: {
            linkText: "More details on your activity",
            linkTo: "user_dashboard",
            size: 90,
        }
    };

    const weeklyWordsTranslated = {
        icon: "words",
        iconText: strings.iconTextWeeklyWordsTranslated,
        value: weeklyTranslatedWords,
        beforeText: strings.wordsTranslatedTextStart,
        afterText: strings.wordsTextWeeklyEnd,
        modal: {
            linkText: "More details on translation history",
            linkTo: "history",
            size: 90,
        }
    };

    const weeklyStreak = {
        icon: "headerStreak",
        iconText: strings.iconTextWeeklyStreak,
        value: totalWeeksPracticed,
        beforeText: strings.streakTextStart,
        afterText: strings.streakTextEnd,
        modal: {
            linkText: "More details on your activity",
            linkTo: "user_dashboard",
            size: 90,
        }
    };

    const weeklyProgressOverview = [
        weeklyArticlesRead,
        weeklyWordsTranslated,
        weeklyStreak,
    ];

    return{
        weeklyProgressOverview
    };

}


export function getWeeklyProgressOverviewItems({weeklyTranslated, weeklyReadingMinutes}){
    const weeklyTranslatedWords = weeklyTranslated;
    const weeklyMinutesRead = weeklyReadingMinutes;


    const weeklyArticlesRead = {
        icon: "headerArticles",
        iconText: strings.iconTextWeeklyArticles,
        value: weeklyMinutesRead,
        beforeText: strings.articlesReadTextStart,
        afterText: strings.articlesReadWeeklyTextEnd,
        modal: {
            linkText: "More details on your activty",
            linkTo: "user_dashboard",
            size: 90,
        }
    };

    const weeklyWordsTranslated = {
        icon: "words",
        iconText: strings.iconTextWeeklyWordsTranslated,
        value: weeklyTranslatedWords,
        beforeText: strings.wordsTranslatedTextStart,
        afterText: strings.wordsTextWeeklyEnd,
        modal: {
            linkText: "More details on translation history",
            linkTo: "history",
            size: 90,
        }
    };

    const weeklyWordsPracticed = {
        icon: "words",
        iconText: strings.iconTextWeeklyWordsPracticed,
        value: 16,
        beforeText: strings.wordsPracticedTextStart,
        afterText: strings.wordsTextWeeklyEnd,
        modal: {
            linkText: "More details on words progress",
            linkTo: "words",
            size: 90,
        }
    };

    const weeklyStreak = {
        icon: "headerStreak",
        iconText: strings.iconTextWeeklyStreak,
        value: 5,
        beforeText: strings.streakTextStart,
        afterText: strings.streakTextEnd,
        modal: {
            linkText: "More  details on your acticity",
            linkTo: "user_dashboard",
            size: 90,
        }
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
        icon: "words",
        iconText: strings.iconTextTotalWordsPracticed,
        value: totalPracticedWords,
        beforeText: strings.wordsPracticedTextStart,
        afterText: strings.wordsTextTotalEnd,
    };
    
    const totalWordsLearned = {
        icon: "words",
        iconText: strings.iconTextTotalWordsLearned,
        value: totalLearnedWords,
        beforeText: strings.wordsLearnedTextStart,
        afterText: strings.wordsTextTotalEnd,
    };

    const weeklyStreak = {
        icon: "headerStreak",
        iconText: strings.iconTextWeeklyStreak,
        value: 5,
        beforeText: strings.streakTextStart,
        afterText: strings.streakTextEnd,
    };

    const weeklyWordsPracticed = {
        icon: "words",
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