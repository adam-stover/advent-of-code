import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/13.txt';
// URL = './inputs/t.txt';

const COST_A = 3;
const COST_B = 1;
const MAX_PRESS = Number.MAX_SAFE_INTEGER;
const ERROR = 10000000000000;

const handleMachine = ({ a, b, p }) => {
  // a * a.x + b * b.x = p.x
  // a * a.y + b * b.y = p.y
  const a1 = a.x;
  const b1 = b.x;
  const c1 = p.x;

  const a2 = a.y;
  const b2 = b.y;
  const c2 = p.y;

  const determinant = a1 * b2 - a2 * b1;

  if (determinant !== 0) {
    const x = (b2 * c1 - b1 * c2) / determinant;
    const y = (a1 * c2 - a2 * c1) / determinant;
    return [x, y];
  }
}

export async function run() {
  const lines = await getLines(URL);

  const machines = [];

  for (let i = 0; i < lines.length; i += 4) {
    const [ax, ay] = ints(lines[i]);
    const [bx, by] = ints(lines[i + 1]);
    const [px, py] = ints(lines[i + 2]);
    const machine = {
      a: { x: ax, y: ay },
      b: { x: bx, y: by },
      p: { x: px + ERROR, y: py + ERROR },
    };

    machines.push(machine);
  }

  const res = machines.map(handleMachine);
  let cost = 0;

  for (const answer of res) {
    if (
      answer &&
      Math.floor(answer[0]) === answer[0] &&
      Math.floor(answer[1]) === answer[1] &&
      answer[0] <= MAX_PRESS &&
      answer[1] <= MAX_PRESS
    ) {
      cost += answer[0] * COST_A + answer[1] * COST_B;
    }
  }

  log(cost);
}

export default run;
