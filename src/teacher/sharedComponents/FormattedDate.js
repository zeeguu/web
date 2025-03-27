export const shortFormattedDate = (time) => {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  };
  return new Date(time).toLocaleDateString(navigator.language, options);
};

export const longFormattedDate = (time) => {
  const newDate = shortFormattedDate(time);
  const newTime = new Date(time).toLocaleTimeString(undefined);
  return newDate + " " + newTime;
};

export const formattedDateWithDay = (time) => {
  return new Date(time).toDateString();
};
