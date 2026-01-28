export function getCurrentWeekRange() {
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
  startOfWeek.setDate(now.getDate() - shiftNumOfDay);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
}

export function getWeeklyTranslatedWordsCount(counts) {
  const { startOfWeek, endOfWeek } = getCurrentWeekRange();

  return counts
    .filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startOfWeek && itemDate <= endOfWeek && item.count !== undefined && !isNaN(item.count);
    })
    .map((item) => ({
      ...item,
      count: item.count || 0,
    }));
}

export function calculateWeeklyReadingMinutes(readingActivity) {
  const { startOfWeek, endOfWeek } = getCurrentWeekRange();
  const weeklyReadingSeconds = readingActivity.reduce((sum, entry) => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0); // normalize to midnight

    if (entryDate >= startOfWeek && entryDate <= endOfWeek) {
      return sum + entry.seconds;
    }
    return sum;
  }, 0);

  if (weeklyReadingSeconds % 60 > 30) {
    return Math.floor(weeklyReadingSeconds / 60) + 1; // round up if more than 30 seconds. This is what is done in user dashboard
  }
  return Math.floor(weeklyReadingSeconds / 60);
}

export function calculateTotalReadingMinutes(readingActivity) {
  const totalReadingSeconds = readingActivity.reduce((sum, entry) => sum + entry.seconds, 0);
  return Math.floor(totalReadingSeconds / 60);
}

export function selectTwoRandomItems(items) {
  const nonZeroItems = items.filter((item) => item.value > 0);

  if (nonZeroItems.length <= 2) {
    return nonZeroItems;
  }
  const firstIndex = Math.floor(Math.random() * nonZeroItems.length);
  let secondIndex;

  do {
    secondIndex = Math.floor(Math.random() * nonZeroItems.length);
  } while (secondIndex === firstIndex);

  return [nonZeroItems[firstIndex], nonZeroItems[secondIndex]];
}
