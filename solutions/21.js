import { getLines, ints, filterMap, log, } from '../utils.js';

let URL = './inputs/21.txt';
// URL = './inputs/t.txt';

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;
const DIRS = [UP, RIGHT, DOWN, LEFT];
const DIR_MAP = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];
const A = 'A';
const PRINT_MAP = {
  [UP]: '^',
  [RIGHT]: '>',
  [DOWN]: 'v',
  [LEFT]: '<',
  [A]: 'A',
};

const NUM_COORD_MAP = {
  [A]: [3, 2],
  0: [3, 1],
  1: [2, 0],
  2: [2, 1],
  3: [2, 2],
  4: [1, 0],
  5: [1, 1],
  6: [1, 2],
  7: [0, 0],
  8: [0, 1],
  9: [0, 2],
};

const DIR_COORD_MAP = {
  [A]: [0, 2],
  [UP]: [0, 1],
  [LEFT]: [1, 0],
  [DOWN]: [1, 1],
  [RIGHT]: [1, 2],
};

export async function run() {
  const lines = (await getLines(URL)).map(line => line.split('').filter(x => x !== '\r').join(''));

  const bfsNumeric = (origin, target) => {
    const queue = [[...origin, []]];
    const endi = target[0];
    const endj = target[1];
    const res = [];
    let best = Infinity;

    while (queue.length) {
        const [i, j, ops] = queue.shift();
        if (i === endi && j === endj) {
        if (ops.length < best) best = ops.length;
        if (ops.length === best) res.push(ops);
        continue;
        }
        if (ops.length >= best) continue;

        const neighbors = filterMap(
        DIRS,
        dir => {
            if (dir === UP && i <= 0) return false;
            if (dir === RIGHT && j >= 2) return false;
            if (dir === DOWN && (i >= 3 || (i === 2 && j === 0))) return false;
            if (dir === LEFT && (j <= 0 || (j === 1 && i === 3))) return false;
            return true;
        },
        dir => {
            const [movei, movej] = DIR_MAP[dir];
            return [i + movei, j + movej, [...ops, dir]];
        }
        )

        for (const neighbor of neighbors) {
        queue.push(neighbor);
        }
    }

    return res;
  }

  const COUNT = 25;

  const getDirPaths = (origin, destination) => {
    const okey = origin.join('');
    const dkey = destination.join('');
    if (okey === dkey) return [[A]];

    switch (okey) {
      case '01':
        if (dkey === '02') return [[RIGHT, A]];
        if (dkey === '10') return [[DOWN, LEFT, A]];
        if (dkey === '11') return [[DOWN, A]];
        if (dkey === '12') return [[DOWN, RIGHT, A], [RIGHT, DOWN, A]];
      case '02':
        if (dkey === '01') return [[LEFT, A]];
        if (dkey === '10') return [[LEFT, DOWN, LEFT, A], [DOWN, LEFT, LEFT, A]];
        if (dkey === '11') return [[LEFT, DOWN, A], [DOWN, LEFT, A]];
        if (dkey === '12') return [[DOWN, A]];
      case '10':
        if (dkey === '01') return [[RIGHT, UP, A]];
        if (dkey === '02') return [[RIGHT, RIGHT, UP, A], [RIGHT, UP, RIGHT, A]];
        if (dkey === '11') return [[RIGHT, A]];
        if (dkey === '12') return [[RIGHT, RIGHT, A]];
      case '11':
        if (dkey === '01') return [[UP, A]];
        if (dkey === '02') return [[UP, RIGHT, A], [RIGHT, UP, A]];
        if (dkey === '10') return [[LEFT, A]];
        if (dkey === '12') return [[RIGHT, A]];
      case '12':
        if (dkey === '01') return [[UP, LEFT, A], [LEFT, UP, A]];
        if (dkey === '02') return [[UP, A]];
        if (dkey === '10') return [[LEFT, LEFT, A]];
        if (dkey === '11') return [[LEFT, A]];
      default:
        throw new Error('unhandled');
    }
  }


  // OK lean into DP
  // every subsequent answer is the next layer (count + 1) of minimum moves
  // start with first layer
  const firstAnswer = {};
  const answers = [firstAnswer];

  for (const origin_char of [A, UP, DOWN, LEFT, RIGHT]) {
    firstAnswer[origin_char] = {};
    for (const destination_char of [A, UP, DOWN, LEFT, RIGHT]) {
      if (origin_char === destination_char) continue;
      const origin = DIR_COORD_MAP[origin_char];
      const destination = DIR_COORD_MAP[destination_char];
      firstAnswer[origin_char][destination_char] = getDirPaths(origin, destination)[0].length;
    }
  }

  for (let i = 1; i < COUNT; i++) {
    const answer = {};
    const prevAnswer = answers[answers.length - 1];
    for (const origin_char of [A, UP, DOWN, LEFT, RIGHT]) {
      answer[origin_char] = {};
      for (const destination_char of [A, UP, DOWN, LEFT, RIGHT]) {
        if (origin_char === destination_char) continue;
        const origin = DIR_COORD_MAP[origin_char];
        const destination = DIR_COORD_MAP[destination_char];
        const paths = getDirPaths(origin, destination);
        let best = Infinity;
        for (const path of paths) {
          let o = A;
          let totalCost = 0;
          for (const op of path) {
            totalCost += o === op ? 1 : prevAnswer[o][op];
            o = op;
          }
          if (totalCost < best) best = totalCost;
        }
        answer[origin_char][destination_char] = best;
      }
    }
    answers.push(answer);
  }

  const true_origin = [3, 2];

  const processLine = (line) => {
  let steps = 0;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const target = NUM_COORD_MAP[char];
    const paths = bfsNumeric(true_origin, target)
    paths.forEach(p => {p.push(A)});
    const best = paths.reduce((acc, p) => {
      let total_cost = 0;
      let o = A;
      for (const op of p) {
        const cost = o === op ? 1 : answers[answers.length - 1][o][op];
        total_cost += cost;
        o = op;
      }
      return total_cost < acc ? total_cost : acc;
    }, Infinity);
    steps += best;
    true_origin[0] = target[0];
    true_origin[1] = target[1];
  }

  log(steps);

  return steps;
  }

  let total = 0;

  for (const line of lines) {
    const len = processLine(line);
    const compl = ints(line) * len;
    total += compl;
  }

  log(total);
}

export default run;
