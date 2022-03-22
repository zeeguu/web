function removeArrayDuplicates(array) {
  var set = new Set(array);
  var newArray = Array.from(set);
  return newArray;
}

export { removeArrayDuplicates };
