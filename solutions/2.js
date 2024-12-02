import { getLines, ints, cloneObj, filterMap, rangeUnion, has, max, min, minmax, findLastIndex } from '../utils.js';

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
        // console.log(`level ${i} is unsafe cuz ascending, cuz ${currentLevel} and ${lastLevel}`)
        // console.log(currentIncreasing);
        // console.log(isIncreasing)
        // console.log(levels);
        break;
      }

      const diff = Math.abs(currentLevel - lastLevel)

      if (diff < 1 || diff > 3) {
        areWeSafeDaddy = false;
        break;
      }
    }

    if (areWeSafeDaddy) {
      // console.log(`level ${i} is safe`)
      return true;
    }

    // console.log(`level ${i} is unsafe`)
    return false;
  }

  for (let i = 0; i < len; i++) {
    const levels = ints(reports[i]);
    if (isSafe(levels)) {
      safeCount++;
    } else {
      for (let j = 0; j < levels.length; j++) {
        const nextLevel = copyExcept(levels, j);
        if (isSafe(nextLevel)) {
          safeCount++;
          break;
        }
      }
    }
  }

  console.log(safeCount);
}

const copyExcept = (arr, index) => {
  const newArr = [];

  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArr.push(arr[i]);
  }

  return newArr;
}

export default dayTwo;
