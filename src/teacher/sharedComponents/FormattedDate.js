export const shortFormattedDate = (time) => {
  const options = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
  return new Date(time).toLocaleDateString(undefined, options);
};

export const longFormattedDate = (time) => {
  const newDate = shortFormattedDate
    (time)
  const newTime = new Date(time).toLocaleTimeString(undefined)
  return newDate + " " + newTime
};

export const formattedDateWithDay = (time) => {
  return new Date(time).toDateString()
}
