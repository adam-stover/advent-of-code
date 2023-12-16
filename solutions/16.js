import { getLines, ints, diff, gcd, lcm, count, makeArray, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep } from '../utils.js';

let URL = './inputs/16.txt';
// URL = './inputs/t.txt';

const AIR = '.';
const VERT_SPLITTER = '|';
const HOR_SPLITTER = '-';
const RIGHT_UP = '/';
const RIGHT_DOWN = '\\';
const LEFT = 'LEFT';
const DOWN = 'DOWN';
const RIGHT = 'RIGHT';
const UP = 'UP';

const DIR_MAP = {
  [LEFT]: [0, -1],
  [RIGHT]: [0, 1],
  [UP]: [-1, 0],
  [DOWN]: [1, 0],
};

const RIGHT_UP_MAP = {
  [LEFT]: DOWN,
  [RIGHT]: UP,
  [UP]: RIGHT,
  [DOWN]: LEFT,
};

const RIGHT_DOWN_MAP = {
  [LEFT]: UP,
  [RIGHT]: DOWN,
  [UP]: LEFT,
  [DOWN]: RIGHT,
};

const SYMBOL_MAP = {
  [RIGHT_UP]: RIGHT_UP_MAP,
  [RIGHT_DOWN]: RIGHT_DOWN_MAP,
};

export async function daySixteen() {
  const lines = await getLines(URL);
  const m = lines.length;
  const n = lines[0].length;

  const getEnergy = (start => {
    const queue = [start];
    const energized = makeMatrix(n, m, false);
    const visited = makeMatrix(n, m, () => []);

    while (queue.length) {
      const next = queue.shift();
      const [i, j, dir] = next;
      if (i < 0 || j < 0 || i >= m || j >= n) continue;

      const v = visited[i][j];
      if (v.includes(dir)) continue;
      v.push(dir);

      energized[i][j] = true;

      const cell = lines[i][j];

      if (cell === AIR) {
        const [movei, movej] = DIR_MAP[dir];
        queue.push([i + movei, j + movej, dir]);
      } else if (cell === RIGHT_UP || cell === RIGHT_DOWN) {
        const map = SYMBOL_MAP[cell];
        const new_dir = map[dir];
        const [movei, movej] = DIR_MAP[new_dir];
        queue.push([i + movei, j + movej, new_dir]);
      } else if (cell === HOR_SPLITTER) {
        if (dir === LEFT || dir === RIGHT) {
          const [movei, movej] = DIR_MAP[dir];
          queue.push([i + movei, j + movej, dir]);
        } else {
          queue.push([i, j + 1, RIGHT]);
          queue.push([i, j - 1, LEFT]);
        }
      } else if (dir === UP || dir === DOWN) {
        const [movei, movej] = DIR_MAP[dir];
        queue.push([i + movei, j + movej, dir]);
      } else {
        queue.push([i + 1, j, DOWN]);
        queue.push([i - 1, j, UP]);
      }
    }

    let energizedCount = 0;

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (energized[i][j]) energizedCount++;
      }
    }

    return energizedCount;
  });

  const energies = [];

  for (let i = 0; i < m; i++) {
    energies.push(getEnergy([i, 0, RIGHT]));
    energies.push(getEnergy([i, n - 1, LEFT]));
  }

  for (let j = 0; j < n; j++) {
    energies.push(getEnergy([0, j, DOWN]));
    energies.push(getEnergy([m - 1, j, UP]));
  }

  console.log(max(energies));
}

export default daySixteen;
