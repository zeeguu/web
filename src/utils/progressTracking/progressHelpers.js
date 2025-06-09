
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

export function getWeeklyTranslatedWordsCount(counts) {
    const { startOfWeek, endOfWeek } = getCurrentWeekRange();
  
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

export function calculateConsecutivePracticeWeeks(activity) {
  console.log("activity", activity)
  if (!activity || !Array.isArray(activity.reading) || !Array.isArray(activity.exercises)) {
    return 0;
  }

  // Collect all unique week start dates (YYYY-MM-DD, Monday)
  const practicedWeeks = new Set();
  const allEntries = [...activity.reading, ...activity.exercises];

    // Sum seconds for each unique date
  const dateToSeconds = {};
  allEntries.forEach(({ date, seconds }) => {
      if (!date) return;
      if (!dateToSeconds[date]) {
        dateToSeconds[date] = 0;
      }
      dateToSeconds[date] += seconds;
    });

    console.log("dateToSeconds", dateToSeconds);

  Object.entries(dateToSeconds).forEach(([date, seconds] ) => {
    if (seconds >= 300) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      // Find the Monday of this week
      const monday = new Date(d);
      monday.setDate(d.getDate() - d.getDay());
      monday.setHours(0, 0, 0, 0);
      practicedWeeks.add(monday.toISOString().slice(0, 10));
    }
  });
  const weekArray = Array.from(practicedWeeks).sort((a, b) => new Date(a) - new Date(b));
  if (practicedWeeks.size === 0) return 0;

  // Get this week's Monday (start of the week)
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() - now.getDay());
  thisMonday.setHours(0, 0, 0, 0);

  // Build streak backwards from last week
  let streak = 0;
  let checkMonday = new Date(thisMonday);
  checkMonday.setDate(checkMonday.getDate() - 7);

  while (weekArray.includes(checkMonday.toISOString().slice(0, 10))) {
    streak++;
    // Go to previous week
    checkMonday.setDate(checkMonday.getDate() - 7);
  }
  // if the user has practiced this week increment  by 1 
  if (weekArray.includes(thisMonday.toISOString().slice(0, 10))){
  streak++;}
  
  return streak;
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
    console.log("Weekly reading seconds", weeklyReadingSeconds);
    if (weeklyReadingSeconds % 60 > 30){
      return Math.floor(weeklyReadingSeconds / 60) + 1; // round up if more than 30 seconds. This is what is done in user dashboard
    }
    return Math.floor(weeklyReadingSeconds / 60); 
}

export function calculateTotalReadingMinutes(readingActivity){
    const totalReadingSeconds = readingActivity.reduce(
        (sum, entry) => sum + entry.seconds,
        0
    );
    return Math.floor(totalReadingSeconds / 60);
};

export function selectTwoRandomItems(items){
    const nonZeroItems = items.filter(item => item.value > 0);

    if (nonZeroItems.length<=2){
      return nonZeroItems;
    };

    const firstIndex = Math.floor(Math.random()* nonZeroItems.length);
    let secondIndex;

    do{
      secondIndex = Math.floor(Math.random() * nonZeroItems.length);
    }
    while (secondIndex === firstIndex);

    return [nonZeroItems[firstIndex], nonZeroItems[secondIndex]];
};

