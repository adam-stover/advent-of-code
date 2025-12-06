import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/6.txt';
// URL = './inputs/t.txt';

export async function run1() {
  const lines = await getLines(URL);
  const num_problems = ints(lines[0]).length;

  let sum = 0;

  const operands = [];
  let operators = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (i === lines.length - 1) {
      const trimmed = line.replace(/\s+/g, ' ').trim();
      operators = trimmed.split(' ');
      continue;
    } else {
      const nums = ints(line);
      operands.push(nums);
    }
  }

  for (let i = 0; i < num_problems; i++) {
    let temp = operands[0][i];
    const operator = operators[i];
    for (let j = 1; j < operands.length; j++) {
      if (operator === '+') temp += operands[j][i];
      else temp *= operands[j][i];
    }
    sum += temp;
  }

  log(sum);
}

export async function run() {
  const lines = await getLines(URL);
  const num_problems = ints(lines[0]).length;
  const width = lines[0].length;

  let sum = 0;

  const operators = lines[lines.length - 1].replace(/\s+/g, ' ').trim().split(' ');

  let x = 0;
  for (let problemIndex = 0; problemIndex < num_problems; problemIndex++) {
    const nums = [];
    while (x < width && lines.some(line => line[x] !== ' ')) {
      let numStr = '';
      for (let y = 0; y < lines.length - 1; y++) {
        if (lines[y][x] !== ' ') numStr += lines[y][x];
      }
      nums.push(Number(numStr));
      x++;
    }
    // log(nums);
    if (nums.length) sum += nums.reduce((acc, cur) => operators[problemIndex] === '+' ? acc + cur : acc * cur);
    x++;
  }

  log(sum);
}

export default run;
