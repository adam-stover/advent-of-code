import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/2.txt';
// URL = './inputs/t.txt';

const isValid = (num) => {
  const str = num.toString();

  if (str.length % 2) return true;

  const halfway = str.length / 2;
  return str.slice(0, halfway) !== str.slice(halfway)
}

const repeats = (str, len, divisor) => {
  if (len % divisor) return false;
  const patternLength = len / divisor;
  let lastIndex = patternLength;;
  const pattern = str.slice(0, patternLength);
  for (let i = patternLength * 2; i <= len; i += patternLength) {
    if (str.slice(lastIndex, i) !== pattern) return false;
    lastIndex = i;
  }
  return true;
}

const isValidTwo = (num) => {
  const str = num.toString();
  const len = str.length;
  const testUntil = len / 2;

  for (let divisor = 2; divisor <= len; divisor += 1) {
    if (repeats(str, len, divisor)) return false;
  }

  return true;
}

const helperTwo = (start, end) => {
  let sum = 0;
  for (let num = start; num <= end; num++) {
    if (!isValidTwo(num)) sum += num;
  }
  log(`${start} to ${end} has ${sum}`)
  return sum;
}

const helper = (start, end) => {
  let sum = 0;
  for (let num = start; num <= end; num++) {
    if (!isValid(num)) sum += num;
  }
  return sum;
};

export async function runPartOne() {
  const lines = await getLines(URL);
  const nums = ints(lines[0]);

  let sum = 0;

  for (let i = 0; i < nums.length; i += 2) {
    sum += helper(nums[i], nums[i + 1]);
  }

  log(sum);
}


export async function run() {
  const lines = await getLines(URL);
  const nums = ints(lines[0]);

  let sum = 0;

  for (let i = 0; i < nums.length; i += 2) {
    sum += helperTwo(nums[i], nums[i + 1]);
  }

  log(sum);
}

export default run;
