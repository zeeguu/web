function removeArrayDuplicates(array) {
  var set = new Set(array);
  var newArray = Array.from(set);
  return newArray;
}

function removeByValue(array, val) {
  // from https://stackoverflow.com/questions/3954438/how-to-remove-item-from-array-by-value
  let index = array.indexOf(val);
  if (index !== -1) array.splice(index, 1);
  return array;
}

function random(x) {
  return x[Math.floor(Math.random() * x.length)];
}

export { removeArrayDuplicates, removeByValue, random };
