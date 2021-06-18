export const shortFormatedDate = (time) => {
  const options = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
  return new Date(time).toLocaleDateString(undefined, options);
};

export const longFormatedDate = (time) => {
  const newDate = shortFormatedDate(time)
  const newTime = new Date(time).toLocaleTimeString(undefined)
  return newDate + " " + newTime
};

export const formatedDateWithDay = (time)=>{
 return new Date(time).toDateString()
}
