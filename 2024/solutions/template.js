import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/1.txt';
URL = './inputs/t.txt';

const helper = (a, b, c) => {
  return false;
};

export async function run() {
  const lines = await getLines(URL);

  let count = 0;
  let sum = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nums = ints(line);

    const cond = helper(nums);

    if (cond) {
      const num = 0;
      count++;
      sum += num;
    }
  }

  log(count);
  log(sum);
}

export default run;
