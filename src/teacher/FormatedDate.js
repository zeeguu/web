export const shortFormatedDate = (time) => {
  return new Date(time).toLocaleDateString();
};

export const longFormatedDate = (time) => {
  return new Date(time).toUTCString();
};

export const formatedDateWithDay = (time)=>{
 return new Date(time).toDateString()
}
