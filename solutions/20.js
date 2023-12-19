import { getLines, log, ints, diff, gcd, lcm, count, makeArray, makeDeepMatrix, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep, hexToDec, MinHeap } from '../utils.js';

let URL = './inputs/20.txt';
URL = './inputs/t.txt';

const LEFT = 'L';
const UP = 'U';
const DOWN = 'D';
const RIGHT = 'R';

const DIRS = [RIGHT, DOWN, LEFT, UP];

export async function dayTwenty() {
  const rows = await getLines(URL);

  const process = (row) => {
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const output = process(row);
  }

  log('hello world');
}

export default dayTwenty;
