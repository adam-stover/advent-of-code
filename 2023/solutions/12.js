import { getLines, ints, diff, gcd, lcm, count, makeArray, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep } from '../utils.js';
// import { PerformanceObserver, performance } from 'node:perf_hooks';

let URL = './inputs/12.txt';
// URL = './inputs/t.txt';

const GOOD = '.';
const BAD = '#';
const IDK = '?';

export async function dayTwelve() {
  const rows = await getLines(URL);

  // function perfObserver(list, _observer) {
  //   list.getEntries().forEach((entry) => {
  //     if (entry.entryType === 'measure') {
  //       console.log(`${entry.name}'s duration: ${entry.duration}`);
  //     }
  //   });
  // }
  // const observer = new PerformanceObserver(perfObserver);
  // observer.observe({ entryTypes: ['measure'] });
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


export default dayTwelve;
