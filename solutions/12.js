import { getLines, ints, diff, gcd, lcm, count, makeArray, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep } from '../utils.js';
import { PerformanceObserver, performance } from 'node:perf_hooks';

let URL = './inputs/12.txt';
// URL = './inputs/t.txt';

const GOOD = '.';
const BAD = '#';
const IDK = '?';

export async function dayTwelve() {
  const rows = await getLines(URL);

  const doesRowPass = (row, counts) => {
    // if (row === '.#.###.#.######') console.log('wtf');
    // console.log(row);
    const groups = row.split(GOOD).filter(x => x);
    if (groups.length !== counts.length) {
      return false;
    }
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].length !== counts[i]) return false;
    }
    // console.log(`Row ${row} passed!`)
    return true;
  }

  const wouldThisPass = (groups, arr, index) => {
    const measuredGroups = [];

    let currentGroup = 0;

    for (let i = 0; i < index; i++) {
      if (arr[i] === BAD) currentGroup++;
      else if (currentGroup > 0) {
        measuredGroups.push(currentGroup);
        currentGroup = 0;
      }
    }

    if (arr.length <= measuredGroups.length) {
      // console.log(`We have already failed. Shouldn't be this many groups dawg ${arr.length}`);
      return false;
    }

    for (let i = 0; i < measuredGroups.length; i++) {
      if (measuredGroups[i] !== groups[i]) {
        // console.log(`We have already failed. ${measuredGroups[i]} should be ${groups[i]}`);
        return false;
      }
    }

    if (currentGroup > arr[measuredGroups.length]) {
      // console.log(`We would be building too large a group. ${currentGroup} bigger than ${arr[measuredGroups.length]}`);
      return false;
    }

    return true;
  }

  const getCombinations = (groupCounts, needed, missing, arr, indices, indicesStart = 0) => {
    steps++;
    if (missing === 0) return [];
    if (missing === 1) {
      const res = [];
      for (let i = indicesStart; i < indices.length; i++) {
        const cloned = [...arr];
        cloned[indices[i]] = BAD;
        const thing = cloned.map(c => c === IDK ? GOOD : c).join('');
        if (doesRowPass(thing, groupCounts)) res.push(thing);
      }
      return res;
    };
    if (missing === indices.length - indicesStart) {
      const cloned = [...arr];
      for (let i = indicesStart; i < indices.length; i++) {
        cloned[indices[i]] = BAD;
      }
      const thing = cloned.map(c => c === IDK ? GOOD : c).join('');
      if (doesRowPass(thing, groupCounts)) return [thing];
      return [];
    }
    const results = [];
    for (let i = indicesStart; i < indices.length; i++) {
      if (!wouldThisPass(groupCounts, arr, indices[i])) continue;
      const innerClonedArr = [...arr];
      for (let j = indicesStart; j < i; j++) {
        innerClonedArr[indices[j]] = GOOD;
      }
      innerClonedArr[indices[i]] = BAD;
      results.push(getCombinations(groupCounts, needed, missing - 1, innerClonedArr, indices, i + 1));
    }
    return flattenDeep(results)/*.filter(str => count(str, BAD) === needed && doesRowPass(str, groupCounts));*/
  }

  let res = 0;

  function perfObserver(list, _observer) {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'measure') {
        console.log(`${entry.name}'s duration: ${entry.duration}`);
      }
    });
  }
  const observer = new PerformanceObserver(perfObserver);
  observer.observe({ entryTypes: ['measure'] });
  let steps = 0;

  for (const row of rows) {
    steps = 0;
    performance.mark('A');
    // if (row !== rows[2]) continue;
    // console.log('----------------------------------------------------------------')
    let [record, nums] = row.split(' ');
    record = `${record}?`.repeat(5).slice(0, -1);
    nums = `${nums},`.repeat(5).slice(0, -1);
    const recordArr = record.split('');
    // const processed = record.split(GOOD).filter(x => x);
    const badCount = count(record, BAD);
    const idkCount = count(record, IDK);
    const groupCounts = ints(nums);
    const needed = sum(groupCounts);
    const missing = needed - badCount;
    const idkIndices = [];

    // console.log(row);
    // console.log(`We need ${needed} broken. We have ${badCount} so we need to choose ${missing} from ${idkCount}`);

    if (missing === idkCount || missing === 0) {
      res += 1;
      continue;
    }

    for (let i = 0; i < record.length; i++) {
      if (record[i] === IDK) idkIndices.push(i);
    }

    const passing = getCombinations(groupCounts, needed, missing, recordArr, idkIndices);

    if (!passing.length) {
      console.log(`RED FLAG ON ${row}`);
      console.log(`We need ${needed} broken. We have ${badCount} so we need to choose ${missing} from ${idkCount}`);
    }
    res += passing.length;

    // console.log('----------------------------------------------------------------')
    performance.mark('B');
    performance.measure('A to B', 'A', 'B');
    performance.clearMarks();
    console.log(`Processed ${row} with ${passing.length} after generating ${steps} combos`);
  }

  console.log(res);
}

// P1 answers
// 6171 is too low
// 6267 is too low
// 7108 is ALSO too low
// 7110 -- I missed TWO test cases
// P2 durations
// times: 16099 | 132672
// times: 15693 | 131070
// times: 4962  | 84312

export default dayTwelve;
