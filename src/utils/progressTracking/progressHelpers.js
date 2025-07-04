
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
  //if there is no actvitiy return a streak of 0.
  if (!activity || !Array.isArray(activity.reading) || !Array.isArray(activity.exercises)) {
    return 0;
  }

  const practicedWeeks = new Set();
  //combines entries from reading and exercise activity into one array.
  // The reading and exercise seconds for the same date is still separated.
  const allEntries = [...activity.reading, ...activity.exercises];
  console.log("allEntries", allEntries);

  //combines exercise and reading minutes for the same date in the same entry
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
      //the date of each entry with a total practice of 5 minutes or more
      //example Tue Mar 25 2025 00:00:00 GMT+0100 (centraleuropeisk normaltid)
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      console.log("d", d);

      // Find the Monday of this week
      const monday = new Date(d);
      console.log("monday,", monday);
      const day = d.getDay();
      const difference = (day === 0 ? -6 : 1 - day);
      monday.setDate(d.getDate() + difference);
      monday.setHours(0, 0, 0, 0);
      console.log("now we are finding the monday", monday);
      practicedWeeks.add(monday.toDateString());
    }
  });
  console.log("practiced weeks", practicedWeeks);
  const weekArray = Array.from(practicedWeeks).sort((a, b) => new Date(a) - new Date(b));
  console.log("This is the week array", weekArray);
  if (practicedWeeks.size === 0) return 0;

  // Get this week's Monday (start of the week)
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  console.log("this is the date of now/today", now);
  const thisMonday = new Date(now);
  const thisDay = now.getDay();
  const thisDiff = thisDay === 0 ? -6 : 1 - thisDay;
  thisMonday.setDate(now.getDate() + thisDiff);
  thisMonday.setHours(0, 0, 0, 0);
  console.log("This is monday today/now", thisMonday);

  // Build streak backwards from last week
  let streak = 0;
  //this monday
  let lastMonday = new Date(thisMonday);
  console.log("Check monday? what is this", lastMonday);
  //last weeks monday
  lastMonday.setDate(lastMonday.getDate() - 7);
  console.log("check again", lastMonday);

  while (weekArray.includes(lastMonday.toDateString())) {
    streak++;
    // Go to previous week
    lastMonday.setDate(lastMonday.getDate() - 7);
  }
  // if the user has practiced this week increment  by 1 
  if (weekArray.includes(thisMonday.toDateString())){
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

