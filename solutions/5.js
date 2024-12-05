import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/5.txt';
// URL = './inputs/t.txt';

const helper = (a, b, c) => {
  return false;
};

export async function run() {
  const lines = await getLines(URL);

  const split = lines.indexOf('');
  const ruleLines = lines.slice(0, split).map(ints);
  const updates = lines.slice(split + 1).map(ints);

  const ruleMap = {};

  for (const [a, b] of ruleLines) {
    if (!has(ruleMap, a)) {
      ruleMap[a] = {
        prev: new Set(),
        next: new Set(),
      }
    }
    if (!has(ruleMap, b)) {
      ruleMap[b] = {
        prev: new Set(),
        next: new Set()
      }
    }

    ruleMap[a].next.add(b);
    ruleMap[b].prev.add(a);
  }

  let sum = 0;

  const sortFn = (a, b) => {
    if (ruleMap[a].next.has(b)) return -1;
    if (ruleMap[a].prev.has(b)) return 1;

    return 0;
  }

  const isUpdateSorted = (update) => {
    for (let i = 1; i < update.length; i++) {
      if (sortFn(update[i - 1], update[i]) === 1) return false;
    }

    return true;

    // const sorted = [...update].sort(sortFn);
    // return (update.join('|') === sorted.join('|'));
  }

  for (const update of updates) {
    if (!isUpdateSorted(update)) {
      const sorted = [...update].sort(sortFn);
      const medianIndex = Math.floor(sorted.length / 2);
      // log(update)
      // log(update[medianIndex])
      sum += sorted[medianIndex];
    }
  }

  log(sum);

  // Not 5238
}

export default run;
