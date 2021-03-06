import {randomInts,Algo} from '../util';

function partition(items, left, right) {
  var pivot = items[Math.floor((right + left) / 2)];
  var i = left;
  var j = right;

  while (i <= j) {
    while (items[i] < pivot) i++;
    while (items[j] > pivot) j--;
    if (i <= j) {
      [items[i],items[j]] = [items[j], items[i]]
      i++;
      j--;
    }
  }

  return i;
}

function quickSort(items, left, right) {
  if (left === undefined) {
    left = 0;
    right = items.length-1;
  }
  if (items.length > 1) {
    var index = partition(items, left, right);
    if (left < index - 1) quickSort(items, left, index - 1);
    if (index < right)  quickSort(items, index, right);
  }
  return items;
}
      
export default new Algo({
  fn : quickSort,
  globals : { partition },
  input : n => [randomInts(n)]
})