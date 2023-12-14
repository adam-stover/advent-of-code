import { getLines, ints, diff, gcd, lcm, count, makeArray, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep } from '../utils.js';
import { PerformanceObserver, performance } from 'node:perf_hooks';

let URL = './inputs/12.txt';
// URL = './inputs/t.txt';

const GOOD = '.';
const BAD = '#';
const IDK = '?';

export async function dayTwelve() {
  const rows = await getLines(URL);

  function perfObserver(list, _observer) {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'measure') {
        console.log(`${entry.name}'s duration: ${entry.duration}`);
      }
    });
  }
  const observer = new PerformanceObserver(perfObserver);
  observer.observe({ entryTypes: ['measure'] });
  // let steps = 0;

  let res = 0;

  const cacheProcess = (() => {
    const cache = {};

    return (record, groups, midStreak = false) => {
      const key = `${record}|${groups.join(',')}|${midStreak}`;
      // console.log(key);
      if (!has(cache, key)) {
        // console.log(cache);
        cache[key] = process(record, groups, midStreak);
      }
      // else console.log('cache hit')
      return cache[key]
    };
  })();

  const process = (record, groups, midStreak = false) => {
    if (record === '') {
      if (!groups || groups.length === 0 || sum(groups) === 0) return 1;
      return 0;
    }

    const char = record[0];
    const group = groups[0];
    let output;

    const handleBad = () => {
      if (!group) return 0;
      const cloned = [...groups];
      cloned[0] -= 1;
      return cacheProcess(record.slice(1), cloned, true);
    }

    const handleGood = () => {
      if (midStreak && !group) {
        const cloned = groups.filter((_, i) => i > 0);
        return cacheProcess(record.slice(1), cloned, false);
      }
      if (midStreak) return 0;
      return cacheProcess(record.slice(1), groups, false);
    }

    if (char === BAD) output = handleBad();
    else if (char === GOOD) output = handleGood();
    else if (char === IDK) output = handleBad() + handleGood();
    else throw new Error('Unhandled');

    // console.log(`${record} ${groups} : ${output}`);
    return output;
  }

  performance.mark('A');

  for (let i = 0; i < rows.length; i++) {
    // if (i !== 5) continue;
    const row = rows[i];
    // steps = 0;
    // performance.mark('A');
    // if (row !== rows[2]) continue;
    // console.log('----------------------------------------------------------------')
    let [record, groups] = row.split(' ');
    record = `${record}?`.repeat(5).slice(0, -1);
    groups = `${groups},`.repeat(5).slice(0, -1);
    groups = ints(groups);

    const passing = cacheProcess(record, groups);
    res += passing;

    // console.log('----------------------------------------------------------------')
    // performance.mark('B');
    // performance.measure('A to B', 'A', 'B');
    // performance.clearMarks();
    // console.log(`Processed ${row} with ${passing}`);
  }

  console.log(res);
}

// P1 answers
// 6171 is too low
// 6267 is too low
// 7108 is ALSO too low
// 7110 -- I missed TWO test cases
// P2 durations
// 1563383987776 is too low
// 1566786613613 LET'S GOOOOOOOO
// times: 16099 | 132672
// times: 15693 | 131070
// times: 4962  |  84312
// times: 4588  |  83049
// times: 4054  |  80236 -- after switching to numbers instead of arrays, should avoid heap overflow but may still be too slow
// times: 3976  |  79772
// times: 3169  |  45876 -- fixing logic in `wouldThisPass` (it wasn't strict enough)
// times: 3203  |  40170 -- tightening `wouldThisPass` further
// times: 2860  |  32697 -- tightening `wouldThisPass` even further
// times: 1749  |  23445 -- optimized `doesRowPass` to use array instead of string
// times: 1681  |  21421 -- optimized `doesRowPass` to accept index to avoid cloning
// times: 162   |   2425 -- complete refactor
// after caching refactor -- 1348 for entire input
// Next approach -- split up row into pre-groups (divided by GOOD cells)
// How many valid options can you generate from each group?
// As this is a smaller problem, this is ***CACHEABLE*** because it will repeat!!!!!!
// Note to future self -- LOOK FOR HOW TO SUBDIVIDE PROBLEMS!!!
// PS 1042 PM dec 12

  // const doesRowPass = (row, counts, index) => {
  //   // doesRowPassCalled++;
  //   // steps++;
  //   // if (row === '.#.###.#.######') console.log('wtf');
  //   // console.log(row);
  //   const groups = [];
  //   let curr = 0;
  //   for (let i = 0; i < row.length; i++) {
  //     if (row[i] === BAD || i === index) curr++;
  //     else if (curr > 0) {
  //       groups.push(curr);
  //       curr = 0;
  //     }
  //   }
  //   if (curr > 0) groups.push(curr);
  //   // const groups = row.split(GOOD).filter(x => x);
  //   if (groups.length !== counts.length) {
  //     return false;
  //   }
  //   for (let i = 0; i < groups.length; i++) {
  //     if (groups[i] !== counts[i]) return false;
  //   }
  //   // console.log(`Row ${row} passed!`)
  //   return true;
  // };

  // const wouldThisPass = (groups, arr, index) => {
  //   // wouldThisPassCalled++;
  //   const measuredGroups = [];

  //   let groupIndex = 0;
  //   let currentGroup = 0;

  //   for (let i = 0; i < index; i++) {
  //     if (arr[i] === BAD) currentGroup++;
  //     else if (currentGroup > 0) {
  //       measuredGroups.push(currentGroup);
  //       if (measuredGroups[groupIndex] !== groups[groupIndex++]) return false;
  //       currentGroup = 0;
  //     }
  //   }

  //   if (groups.length <= measuredGroups.length) {
  //     // console.log(`We have already failed. Shouldn't be this many groups dawg ${arr.length}`);
  //     return false;
  //   }

  //   currentGroup++;

  //   if (currentGroup > groups[groupIndex]) {
  //     // console.log(`We would be building too large a group. ${currentGroup} bigger than ${arr[measuredGroups.length]}`);
  //     return false;
  //   }

  //   let i = index + 1;

  //   while (i < arr.length && arr[i] !== GOOD && currentGroup < groups[groupIndex]) {
  //     i++;
  //     currentGroup++;
  //   }

  //   if (currentGroup < groups[groupIndex++]) {
  //     return false;
  //   }

  //   if (arr[i++] === BAD) {
  //     return false;
  //   }

  //   currentGroup = 0;

  //   while (i < arr.length && groupIndex < groups.length) {
  //     if (arr[i++] !== GOOD) currentGroup++;
  //     else if (currentGroup > 0) {
  //       if (currentGroup >= groups[groupIndex]) groupIndex++;
  //       currentGroup = 0;
  //     }
  //   }

  //   if (groupIndex < groups.length && currentGroup < groups[groupIndex]) {
  //     return false;
  //   }

  //   // console.log(`${arr.join('')} could pass with ${groups}`)
  //   return true;
  // };

  // // See how many groups I can knock out with one block of ?#s
  // // return array where first element is how many combos for one group,
  // // second element is how many combos for two groups, etc.
  // const getGroupCombos = (arr, groups, groupIndex, start, end) => {
  //   const group = groups[groupIndex];
  //   const subarr = arr.slice(start, end);
  //   const idkIndices = []
  //   for (let i = 0; i < subarr.length; i++) {
  //     if (subarr[i] === IDK) idkIndices.push(i);
  //   }
  //   const badCount = count(subarr, BAD);
  //   const idkCount = idkIndices.length;
  //   const missing = group - badCount;
  //   if (missing === idkCount || missing === 0) return [1];
  //   if (missing === 1) {

  //   }
  // };

  // const getGetCombinations = (groups, indices) => {
  //   // const cache = {}

  //   // const memoize = (arr, missing, indicesStart = 0) => {
  //   //   const key = `${arr.join('')}|${missing}|${indicesStart}`;
  //   //   if (!has(cache, key)) cache[key] = getCombos(arr, missing, indicesStart);
  //   //   return cache[key];
  //   // }

  //   const getCombos = (arr, missing, indicesStart = 0) => {
  //     steps++;
  //     if (steps % 100000000 === 0) console.log(`getCombos called ${steps / 1000000} million times`);
  //     if (missing === 0) return 0;
  //     if (missing === 1) {
  //       let res = 0;
  //       for (let i = indicesStart; i < indices.length; i++) {
  //         // const cloned = [...arr];
  //         // cloned[indices[i]] = BAD;
  //         // let hm = 1;
  //         // for (let j = cloned[indices[i] - 1]; j >= 0; j--) {
  //         //   if (arr[j] === BAD) hm++;
  //         // }
  //         // if (hm === groups[groups.length - 1]) res += 1;
  //         // const thing = cloned.map(c => c === IDK ? GOOD : c).join('');
  //         if (doesRowPass(arr, groups, indices[i])) res++;
  //         // else console.log(`${thing} failed for ${groups}`);
  //       }
  //       return res;
  //     };
  //     if (missing === indices.length - indicesStart) {
  //       const cloned = [...arr];
  //       for (let i = indicesStart; i < indices.length; i++) {
  //         cloned[indices[i]] = BAD;
  //       }
  //       // const thing = cloned.map(c => c === IDK ? GOOD : c).join('');
  //       if (doesRowPass(cloned, groups)) return 1;
  //       return 0;
  //     }
  //     let res = 0;
  //     for (let i = indicesStart; i < indices.length; i++) {
  //       if (!wouldThisPass(groups, arr, indices[i])) continue;
  //       const cloned = [...arr];
  //       for (let j = indicesStart; j < i; j++) {
  //         cloned[indices[j]] = GOOD;
  //       }
  //       cloned[indices[i]] = BAD;
  //       res += getCombos(cloned, missing - 1, i + 1);
  //     }
  //     return res/*.filter(str => count(str, BAD) == && doesRowPass(str, groups));*/
  //   };

  //   return getCombos;
  // };


export default dayTwelve;
