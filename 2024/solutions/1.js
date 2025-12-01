import { getLines, ints, cloneObj, filterMap, rangeUnion, has, max, min, minmax, findLastIndex } from '../utils.js';

let URL = './inputs/1.txt';
// URL = './inputs/t.txt';

export async function dayOne() {
  const lines = await getLines(URL);
  const nums = lines.map(line => ints(line));
  const len = nums.length;

  const first = {};
  const second = [];

  // for (let i = 0; i < len; i++) {
  //   first.push(nums[i][0]);
  //   second.push(nums[i][1]);
  // }

  // first.sort((a, b) => a - b);
  // second.sort((a, b) => a - b);

  // let sum = 0;

  // for (let i = 0; i < len; i++) {
  //   sum += Math.abs(first[i] - second[i]);
  // }

  // console.log(sum);

  // part two

  for (let i = 0; i < len; i++) {
    first[nums[i][0]] = 0;
  }

  for (let i = 0; i < len; i++) {
    if (has(first, nums[i][1])) {
      first[nums[i][1]]++;
    }
  }

  let sum = 0;

  for (let i = 0; i < len; i++) {
    const key = nums[i][0];
    sum += Number(key) * first[key];
  }

  console.log(sum);
}

export default dayOne;
