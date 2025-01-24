function removeArrayDuplicates(array) {
  var set = new Set(array);
  var newArray = Array.from(set);
  return newArray;
}

function removeFirstItemByValue(item, list) {
  /*
    Removes the first occurence of item in list.

    from https://stackoverflow.com/questions/3954438/how-to-remove-item-from-array-by-value
  */
  let index = list.indexOf(item);
  if (index !== -1) list.splice(index, 1);
  return list;
}

function random(x) {
  return x[Math.floor(Math.random() * x.length)];
}

function removeAllMatchingItemFromList(item, list) {
  /*
    Removes all items that match the item in the list.
  */
  return list.filter((i) => i !== item);
}

export {
  removeArrayDuplicates,
  removeFirstItemByValue,
  random,
  removeAllMatchingItemFromList,
};
