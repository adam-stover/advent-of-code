import { getLines, ints, diff, gcd, lcm, count, makeArray, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep } from '../utils.js';

let URL = './inputs/15.txt';
// URL = './inputs/t.txt';

export async function dayFifteen() {
  const rows = (await getLines(URL)).map(row => row.split(''));

  console.log('hello world');
}

export default dayFifteen;
