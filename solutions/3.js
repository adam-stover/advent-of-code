import { getLines, ints, cloneObj, filterMap, rangeUnion, has, max, min, minmax, findLastIndex, copyExcept, log } from '../utils.js';

let URL = './inputs/3.txt';
URL = './inputs/t.txt';

const helper = (commands) => {
  let sum = 0;

  for (const command of commands) {
    const [a, b] = ints(command);

    sum += a * b;
  }

  return sum;
}

export async function dayThree() {
  const lines = await getLines(URL);

  const regex = /mul\(\d{1,3},\d{1,3}\)/g;

  let sum = 0;

  const full = lines.join('');
  // const commands = full.match(regex);

  // for (const command of commands) {
  //   const [a, b] = ints(command);

  //   sum += a * b;
  // }

  // part two

  let enabledIndex = 0;
  let disabledIndex = full.indexOf("don't()");

  // log(`From ${enabledIndex} to ${disabledIndex}`);

  let cmds = full.slice(enabledIndex, disabledIndex).match(regex);

  sum += helper(cmds);

  while (enabledIndex !== -1 && disabledIndex !== -1) {
    enabledIndex = full.indexOf("do()", disabledIndex);
    if (enabledIndex !== -1) {
      disabledIndex = full.indexOf("don't()", enabledIndex);
      cmds = full.slice(enabledIndex, disabledIndex).match(regex);
      sum += helper(cmds);
    }

  }

  log(sum);
}

export default dayThree;
