import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/18.txt';
// URL = './inputs/t.txt';

const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;
const DIRS = [NORTH, EAST, SOUTH, WEST];
const DIR_MAP = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

let WIDTH = 71;
let HEIGHT = 71;
let NUM_FALLEN = 1024;
// WIDTH = 7;
// HEIGHT = 7;
// NUM_FALLEN = 12;

export async function run() {
  const lines = await getLines(URL);
  const bytes = lines.map(ints);

  const bfs = (num) => {
    const rows = makeMatrix(HEIGHT, WIDTH, false);
    for (let i = 0; i < num; i++) {
      const [x, y] = bytes[i];
      rows[y][x] = true;
    }
    const visited = makeMatrix(HEIGHT, WIDTH, false);
    const queue = [[0, 0, 0]];
    const endi = HEIGHT - 1;
    const endj = WIDTH - 1;

    while (queue.length) {
      const [i, j, numSteps] = queue.shift();

      if (i === endi && j === endj) return numSteps;
      if (visited[i][j]) continue;
      visited[i][j] = true;

      const neighbors = filterMap(
        DIRS,
        direction => {
          const [movei, movej] = DIR_MAP[direction];
          if (direction === NORTH && i <= 0) return false;
          if (direction === EAST && j >= WIDTH - 1) return false;
          if (direction === SOUTH && i >= HEIGHT - 1) return false;
          if (direction === WEST && j <= 0) return false;
          if (rows[i + movei][j + movej]) return false;
          return true;
        },
        direction => {
          const [movei, movej] = DIR_MAP[direction];
          return [i + movei, j + movej, numSteps + 1];
        }
      )

      for (const neighbor of neighbors) {
        queue.push(neighbor);
      }
    }

    return false;
  }

  for (let i = 1024; i < bytes.length; i++) {
    const res = bfs(i);
    if (res === false) {
      log(`${i - 1}: ${lines[i - 1]}`);
      break;
    }
  }
}

export default run;
