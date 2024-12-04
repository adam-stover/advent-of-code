import { getLines, ints, cloneObj, filterMap, rangeUnion, has, max, min, minmax, findLastIndex, log } from '../utils.js';

let URL = './inputs/2.txt';
// URL = './inputs/t.txt';

export async function dayTwo() {
  const reports = await getLines(URL);
  const len = reports.length;

  let safeCount = 0;

  const isSafe = (levels) => {
    let areWeSafeDaddy = true;
    const isIncreasing = levels[1] > levels[0];

    for (let j = 1; j < levels.length; j++) {
      const lastLevel = levels[j - 1];
      const currentLevel = levels[j];

      const currentIncreasing = currentLevel > lastLevel;
      if (currentIncreasing !== isIncreasing) {
        areWeSafeDaddy = false;
        // log(`level ${i} is unsafe cuz ascending, cuz ${currentLevel} and ${lastLevel}`)
        // log(currentIncreasing);
        // log(isIncreasing)
        // log(levels);
        break;
      }

      const diff = Math.abs(currentLevel - lastLevel)

      if (diff < 1 || diff > 3) {
        areWeSafeDaddy = false;
        break;
      }
    }

    if (areWeSafeDaddy) {
      // log(`level ${i} is safe`)
      return true;
    }

    // log(`level ${i} is unsafe`)
    return false;
  }

  // for (let i = 0; i < len; i++) {
  //   const levels = ints(reports[i]);
  //   if (isSafe(levels)) {
  //     safeCount++;
  //   } else {
  //     for (let j = 0; j < levels.length; j++) {
  //       const nextLevel = copyExcept(levels, j);
  //       if (isSafe(nextLevel)) {
  //         safeCount++;
  //         break;
  //       }
  //     }
  //   }
  // }

  // refactored to be O(n)
  for (let i = 0; i < len; i++) {
    const levels = ints(reports[i]);
    if (isSafeFast(levels)) {
      // log(`${i} is safe`);
      safeCount++;
    }
  }

  log(safeCount);
}

// 1 2 3 4 5
// 1 2 3 5 4
// 2 1 3 4 5
// 1 2 2 5 6

const isSafeSimple = (levels) => {
  const isAscending = levels[1] > levels[0];

  for (let i = 1; i < levels.length; i++) {
    const curAscending = levels[i] > levels[i - 1];
    if (isAscending !== curAscending) return false;
    const gap = Math.abs(levels[i] - levels[i - 1]);
    if (gap < 1 || gap > 3) return false;
  }

  return true;
}

const isSafeFast = (levels) => {
  if (isSafeSimple(levels.slice(1))) return true;
  if (isSafeSimple(levels.slice(0, -1))) return true;

  let ascendings = [];
  let descendings = [];
  let dups = [];

  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1]) {
      ascendings.push(i);
    } else if (levels[i] === levels[i - 1]) {
      dups.push(i);
    } else {
      descendings.push(i);
    }
  }

  if (dups.length > 1) return false;
  if (dups.length === 1) return isSafeSimple(copyExcept(levels, dups[0]));

  const isAscending = ascendings.length > 1;
  if (isAscending && descendings.length > 1) return false;

  const problemIndex = isAscending ? descendings[0] : ascendings[0];

  if (isSafeSimple(copyExcept(levels, problemIndex - 1))) return true;
  if (isSafeSimple(copyExcept(levels, problemIndex))) return true;

  return false;
}

const copyExcept = (arr, index) => {
  const newArr = [];

  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArr.push(arr[i]);
  }

  return newArr;
}

export default dayTwo;
