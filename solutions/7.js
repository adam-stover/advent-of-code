import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/7.txt';
// URL = './inputs/t.txt';

const conc = (a, b) => {
  return Number(`${a}${b}`);
}

const testLine = (testValue, runningTotal, ...rest) => {
  if (rest.length === 1) {
    // log(`${testValue}: ${runningTotal}, ${rest[0]}`)
    // log(rest);
    if (runningTotal + rest[0] === testValue) return true;
    if (runningTotal * rest[0] === testValue) return true;
    if (conc(runningTotal, rest[0]) === testValue) return true;
    return false;
  }

  const addOpt = testLine(testValue, runningTotal + rest[0], ...rest.slice(1));
  if (addOpt) return true;
  const multOptt = testLine(testValue, runningTotal * rest[0], ...rest.slice(1));
  if (multOptt) return true;
  const concOpt = testLine(testValue, conc(runningTotal, rest[0]), ...rest.slice(1));
  if (concOpt) return true;
  return false;
};

export async function run() {
  const lines = await getLines(URL);

  let sum = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [testValue, firstNum, ...nums] = ints(line);

    const cond = testLine(testValue, firstNum, ...nums);

    if (cond) {
      // log(line)
      sum += testValue;
    }
  }

  log(sum);
}

export default run;
