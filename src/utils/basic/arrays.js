function removeArrayDuplicates(array) {
  var set = new Set(array);
  var newArray = Array.from(set);
  return newArray;
}

function random(x) {
  return x[Math.floor(Math.random() * x.length)];
}

function compareArrays(initArr, newArr) {
  const deleteItems = [];
  const addItems = [];

  for (let item of initArr) {
    if (!newArr.includes(item)) {
      deleteItems.push(item);
    }
  }

  for (let item of newArr) {
    if (!initArr.includes(item)) {
      addItems.push(item);
    }
  }

  return { deleteItems, addItems };
}

export { removeArrayDuplicates, random, compareArrays };
