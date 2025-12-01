import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/1.txt';
// URL = './inputs/t.txt';

const helper = (startingPosition, direction, number) => {
  const realTurn = number % 100;
  if (direction === 'R') return (startingPosition + realTurn) % 100;
  return (100 + startingPosition - realTurn) % 100;
};

export async function run() {
  const lines = await getLines(URL);

  const START = 50;
  let pos = START;
  let count = 0;
  let clicks = 0;

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    const num = ints(line);

    const dir = line[0];

    const prevPos = pos;
    clicks += Math.floor(num / 100)
    const realTurn = num % 100;
    if (dir === 'R') {
      if (pos + realTurn >= 100) clicks += 1;
      pos = (pos + realTurn) % 100;
    } else {
      if (realTurn >= pos && pos !== 0) clicks += 1;
      pos = (100 + pos - realTurn) % 100;
    }

    // pos = helper(pos, dir, num)
    // console.log(`after ${line} we get to ${pos}`);
    // console.log(`after ${line} we have ${clicks} after moving from ${prevPos} to ${pos}`)
    if (pos === 0) count += 1;
  }

  log(count);
  log(clicks);
}

export default run;

// not 7025
// 
