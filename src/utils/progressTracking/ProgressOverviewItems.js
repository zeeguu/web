import strings from "../../i18n/definitions";

export function countConsecutivePracticeWeeks(activity) {
  if (!activity || !Array.isArray(activity.reading) || !Array.isArray(activity.exercises)) {
    return 0;
  }

  // Collect all unique week start dates (YYYY-MM-DD, Monday)
  const practicedWeeks = new Set();
  const allEntries = [...activity.reading, ...activity.exercises];

  allEntries.forEach(({ date, seconds }) => {
    if (seconds > 0) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      // Find the Monday of this week
      const monday = new Date(d);
      monday.setDate(d.getDate() - d.getDay());
      monday.setHours(0, 0, 0, 0);
      practicedWeeks.add(monday.toISOString().slice(0, 10));
    }
  });

  if (practicedWeeks.size === 0) return 0;

  // Get this week's Monday (start of the week)
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() - now.getDay());
  thisMonday.setHours(0, 0, 0, 0);

  // Build streak backwards from this week
  let streak = 0;
  let checkMonday = new Date(thisMonday);

  while (practicedWeeks.has(checkMonday.toISOString().slice(0, 10))) {
    streak++;
    // Go to previous week
    checkMonday.setDate(checkMonday.getDate() - 7);
  }

  return streak;
}

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
            linkTo: "user_dashboard",
            size: 90,
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
        }
    }
    return totalWordsTranslated;
  }

export function getTotalWordsPracticed(totalInLearning, totalLearned){
  console.log("JOHANNA: getTotalWordsPracticed", totalInLearning, totalLearned);
    const totalPracticedWords = totalInLearning + totalLearned;
    console.log("JOHANNA: totalPracticedWords blabla", totalPracticedWords);
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
            linkTo: "user_dashboard",
            size: 90,
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

export function getExerciseProgressSummary({totalInLearning, totalLearned, weeksPracticed}){
    const totalWordsPracticed = getTotalWordsPracticed(totalInLearning);
    const totalWordsLearned = getTotalWordsLearned(totalLearned)
    const weeklyStreak = getWeeklyStreak(weeksPracticed);
    const weeklyWordsPracticed = getWeeklyWordsPracticed();

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