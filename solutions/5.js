import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, rangeUnion, log } from '../utils.js';

let URL = './inputs/5.txt';
// URL = './inputs/t.txt';

const numInRanges = (ranges, num) => {
  for (let i = 0; i < ranges.length; i++) {
    const [start, end] = ranges[i];
    if (num >= start && num <= end) return true;
  }

  return false;
}


export async function run() {
  const lines = await getLines(URL);

  let count = 0;

  const ranges = [];
  const available = [];
  let isRange = true;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === '') isRange = false;
    else if (isRange) ranges.push(ints(lines[i]));
    else available.push(ints(lines[i]));
  }

  const merged = rangeUnion(ranges);

  for (let i = 0; i < available.length; i++) {
    if (numInRanges(merged, available[i])) count++;
  }

  log(count);

  let allCount = 0;

  for (let i = 0; i < merged.length; i++) {
    const [start, end] = merged[i];
    allCount += 1 + (end - start);
  }

  log(allCount);
}

export default run;
