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
    // steps++;
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
  };

  const wouldThisPass = (groups, arr, index) => {
    const measuredGroups = [];
    let groupIndex = 0;

    let currentGroup = 0;

    for (let i = 0; i < index; i++) {
      if (arr[i] === BAD) currentGroup++;
      else if (currentGroup > 0) {
        measuredGroups.push(currentGroup);
        if (measuredGroups[groupIndex] !== groups[groupIndex++]) return false;
        currentGroup = 0;
      }
    }

    if (groups.length <= measuredGroups.length) {
      // console.log(`We have already failed. Shouldn't be this many groups dawg ${arr.length}`);
      return false;
    }

    currentGroup++

    // for (let i = 0; i < measuredGroups.length; i++) {
    //   if (measuredGroups[i] !== groups[i]) {
    //     // console.log(`We have already failed. ${measuredGroups[i]} should be ${groups[i]}`);
    //     return false;
    //   }
    // }

    if (currentGroup > groups[groupIndex]) {
      // console.log(`We would be building too large a group. ${currentGroup} bigger than ${arr[measuredGroups.length]}`);
      return false;
    }

    // console.log(`${arr.join('')} could pass with ${groups}`)
    return true;
  };

  const getGroupCombos = (arr, groups, groupIndex) => {
    const needed = sum(groups);
    const have = count(arr, BAD);
    const missing = needed - have;
    const group = groups[groupIndex];
  };

  const getCombinations = (groupCounts, needed, missing, arr, indices, indicesStart = 0) => {
    steps++;
    if (missing === 0) return 0;
    if (missing === 1) {
      let res = 0;
      for (let i = indicesStart; i < indices.length; i++) {
        const cloned = [...arr];
        cloned[indices[i]] = BAD;
        // let hm = 1;
        // for (let j = cloned[indices[i] - 1]; j >= 0; j--) {
        //   if (arr[j] === BAD) hm++;
        // }
        // if (hm === groupCounts[groupCounts.length - 1]) res += 1;
        const thing = cloned.map(c => c === IDK ? GOOD : c).join('');
        if (doesRowPass(thing, groupCounts)) res++;
        // else console.log(`${thing} failed for ${groupCounts}`);
      }
      return res;
    };
    if (missing === indices.length - indicesStart) {
      const cloned = [...arr];
      for (let i = indicesStart; i < indices.length; i++) {
        cloned[indices[i]] = BAD;
      }
      const thing = cloned.map(c => c === IDK ? GOOD : c).join('');
      if (doesRowPass(thing, groupCounts)) return 1;
      return 0;
    }
    let res = 0;
    for (let i = indicesStart; i < indices.length; i++) {
      if (!wouldThisPass(groupCounts, arr, indices[i])) continue;
      const cloned = [...arr];
      for (let j = indicesStart; j < i; j++) {
        cloned[indices[j]] = GOOD;
      }
      cloned[indices[i]] = BAD;
      res += getCombinations(groupCounts, needed, missing - 1, cloned, indices, i + 1);
    }
    return res/*.filter(str => count(str, BAD) === needed && doesRowPass(str, groupCounts));*/
  };

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

    if (!passing) {
      console.log(`RED FLAG ON ${row}`);
      console.log(`We need ${needed} broken. We have ${badCount} so we need to choose ${missing} from ${idkCount}`);
    }
    res += passing;

    // console.log('----------------------------------------------------------------')
    performance.mark('B');
    performance.measure('A to B', 'A', 'B');
    performance.clearMarks();
    console.log(`Processed ${row} with ${passing} after generating ${steps} combos`);
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
// times: 4962  |  84312
// times: 4588  |  83049
// times: 4054  |  80236 -- after switching to numbers instead of arrays, should avoid heap overflow but may still be too slow
// times: 3976  |  79772
// times: 3169  |  45876 -- fixing logic in `wouldThisPass` (it wasn't strict enough)


export default dayTwelve;
