function removeArrayDuplicates(array) {
  var set = new Set(array);
  var newArray = Array.from(set);
  return newArray;
}

function random(x) {
  return x[Math.floor(Math.random() * x.length)];
}

export { removeArrayDuplicates, random };
