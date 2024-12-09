import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/9.txt';
// URL = './inputs/t.txt';

const FREE = '.';

const swap = (arr, i, j) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

export async function run() {
  const lines = await getLines(URL);
  const diskmap = lines[0];

  const hash = (arr) => {
    let sum = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== FREE) {
        sum += arr[i] * i;
      }
    }

    return sum;
  }

  const mapToActual = (map) => {
    const actual = [];
    let fileId = 0;

    for (let i = 0; i < map.length; i++) {
      const el = i % 2 === 0 ? fileId++ : FREE;
      for (let j = 0; j < map[i]; j++) {
        actual.push(el);
      }
    }

    return actual;
  }

  const defrag = (actual) => {
    let freeIndex = actual.indexOf(FREE);

    for (let j = actual.length - 1; j > freeIndex; j--) {
      const el = actual[j];
      if (el !== FREE) {
        swap(actual, j, freeIndex);
        freeIndex = actual.indexOf(FREE, freeIndex + 1)
      }
    }
  }

  const findFreeSpace = (actual, repeats, start, end) => {
    let i = start;
    let reps = 0;
    let result = false;
    while (i < end) {
      if (actual[i] === FREE) {
        reps++;
        if (result === false) result = i;
        if (reps === repeats) return result;
      } else {
        result = false;
        reps = 0;
      }
      i++;
    }

    return -1;
  }

  const defrag2 = (actual, map) => {
    const startJ = (map.length - 1) % 2 === 0 ? map.length - 1 : map.length - 2;
    let freeIndex = actual.indexOf(FREE);

    for (let j = actual.findLastIndex(el => el !== FREE); j > 1; j--) {
      if (actual[j] === FREE) continue;
      const fileId = actual[j];
      let repeats = 0;

      while (actual[j] === fileId) {
        j--;
        repeats += 1;
      }
      j += 1;

      const replaceIndex = findFreeSpace(actual, repeats, freeIndex, j);

      if (replaceIndex !== -1 && replaceIndex < j) {
        // log(`Can move ${fileId}`)
        for (let i = 0; i < repeats; i++) {
          swap(actual, replaceIndex + i, j + i)
        }
      }
    }
  }

  const actual = mapToActual(diskmap);
  // log(actual.join(''));
  defrag2(actual, diskmap);
  // log(actual.join(''))
  const res = hash(actual);
  log(res);
}

export default run;
