import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/3.txt';
// URL = './inputs/t.txt';

const helper = (nums, count = 12) => {
  if (count === 0) return '';
  let largest = 0;
  let largestIndex = -1;
  for (let i = 0; i < nums.length - (count - 1); i++) {
    if (nums[i] > largest) {
      largest = nums[i];
      largestIndex = i;
    }
    if (largest === 9) break;
  }

  return `${largest}${helper(nums.slice(largestIndex + 1), count - 1)}`;
};

export async function run() {
  const lines = await getLines(URL);

  let sum = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const nums = [];
    for (let i = 0; i < line.length; i++) {
      nums.push(Number(line[i]));
    }

    const joltage = helper(nums);

    log(`${line} gives ${joltage}`);

    sum += Number(joltage);
  }

  log(sum);
}

export default run;
