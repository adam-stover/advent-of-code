import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log, MinHeap, cloneMatrix } from '../utils.js';

let URL = './inputs/20.txt';
URL = './inputs/t.txt';

const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;
const DIRS = [NORTH, EAST, SOUTH, WEST];
const DIR_MAP = {
  [NORTH]: [-1, 0],
  [EAST]: [0, 1],
  [SOUTH]: [1, 0],
  [WEST]: [0, -1],
};

const TRACK = '.';
const START = 'S';
const END = 'E';
const WALL = '#';

const CHEAT_TIME = 20;
const TIME_SAVE_THRESHOLD = 50;

export async function run() {
  const lines = await getLines(URL);
  const rows = lines.map(str => str.split(''));
  const iLen = rows.length;
  const jLen = rows[0].length;

  const getStart = () => {
    for (let i = 1; i < iLen; i++) {
        for (let j = 1; j < jLen; j++) {
          if (rows[i][j] === START) return [i, j];
        }
      }
  }

  const getEnd = () => {
    for (let i = 1; i < iLen; i++) {
      for (let j = 1; j < jLen; j++) {
        if (rows[i][j] === END) return [i, j];
      }
    }
  }

  const [starti, startj] = getStart();
  const [endi, endj] = getEnd();

  const bfsBest = () => {
    const queue = [[starti, startj, 0]];
    const visited = makeMatrix(jLen, iLen, false);

    while (queue.length) {
      const [i, j, time] = queue.shift();
      if (i === endi && j === endj) return time;
      if (visited[i][j]) continue;
      visited[i][j] = true;

      const neighbors = filterMap(
        DIRS,
        dir => {
          if (dir === EAST && (j >= jLen - 1 || rows[i][j + 1] === WALL)) return false;
          if (dir === SOUTH && (i >= iLen - 1 || rows[i + 1][j] === WALL)) return false;
          if (dir === WEST && (j <= 0 || rows[i][j - 1] === WALL)) return false;
          if (dir === NORTH && (i <= 0 || rows[i - 1][j] === WALL)) return false;
          return true;
        },
        dir => {
          const [movei, movej] = DIR_MAP[dir];
          return [i + movei, j + movej];
        },
      );

      for (const [newi, newj] of neighbors) {
        queue.push([newi, newj, time + 1]);
      }
    }
  }

  const bfsPaths = (target) => {
    const queue = [[starti, startj, 0, '']];
    const visited = makeMatrix(jLen, iLen, 0);
    const opts = [];

    while (queue.length) {
      const [i, j, time, path] = queue.shift();

      if (time > target) continue;

      if (i === endi && j === endj) {
        opts.push(path);
        continue;
      }
      if (visited[i][j] > 254) continue;
      visited[i][j]++;

      const neighbors = filterMap(
        DIRS,
        dir => {
          if (dir === EAST && (j >= jLen - 1 || rows[i][j + 1] === WALL)) return false;
          if (dir === SOUTH && (i >= iLen - 1 || rows[i + 1][j] === WALL)) return false;
          if (dir === WEST && (j <= 0 || rows[i][j - 1] === WALL)) return false;
          if (dir === NORTH && (i <= 0 || rows[i - 1][j] === WALL)) return false;
          return true;
        },
        dir => {
          const [movei, movej] = DIR_MAP[dir];
          return [i + movei, j + movej];
        },
      );

      for (const [newi, newj] of neighbors) {
        queue.push([newi, newj, time + 1, `${path}|${i}-${j}`]);
      }
    }

    return opts;
  }

  const bfsCustomStart = (starti, startj, startTime, target) => {
    const queue = [[starti, startj, startTime]];
    const visited = makeMatrix(jLen, iLen, false);

    while (queue.length) {
      const [i, j, time] = queue.shift();
      if (time > target) continue;
      if (i === endi && j === endj) return true;
      if (visited[i][j]) continue;
      visited[i][j] = true;

      const neighbors = filterMap(
        DIRS,
        dir => {
          if (dir === EAST && (j >= jLen - 1 || rows[i][j + 1] === WALL)) return false;
          if (dir === SOUTH && (i >= iLen - 1 || rows[i + 1][j] === WALL)) return false;
          if (dir === WEST && (j <= 0 || rows[i][j - 1] === WALL)) return false;
          if (dir === NORTH && (i <= 0 || rows[i - 1][j] === WALL)) return false;
          return true;
        },
        dir => {
          const [movei, movej] = DIR_MAP[dir];
          return [i + movei, j + movej];
        },
      );

      for (const [newi, newj] of neighbors) {
        queue.push([newi, newj, time + 1]);
      }
    }

    return false;
  }

  const best = bfsBest();
  log(best);
  const [path] = bfsPaths(best);
  const locations = path.split('|').filter(x => x).map(str => str.split('-').map(Number));

  const getNumCheatsStartingHere = (index) => {
    const target = best - TIME_SAVE_THRESHOLD;
    const visited = makeMatrix(jLen, iLen, false);
    const location = locations[index];
    const queue = [[location[0], location[1], index]];
    const successfulEndLocations = new Set();

    while (queue.length) {
      const [i, j, time] = queue.shift();
      if (time > index + CHEAT_TIME) continue;
      if (time > target) continue;
      if (i === endi && j === endj) {
        successfulEndLocations.add(`${i}-${j}`);
        continue;
      }
      if (visited[i][j]) continue;
      visited[i][j] = true;

      if (time > index && rows[i][j] !== WALL && !successfulEndLocations.has(`${i}-${j}`)) {
        // Ending cheat here is now an option.
        const canDoItInTime = bfsCustomStart(i, j, time, target);
        if (canDoItInTime) successfulEndLocations.add(`${i}-${j}`);
      }

      const neighbors = filterMap(
        DIRS,
        dir => {
          if (dir === EAST && j >= jLen - 1) return false;
          if (dir === SOUTH && i >= iLen - 1) return false;
          if (dir === WEST && j <= 0) return false;
          if (dir === NORTH && i <= 0) return false;
          return true;
        },
        dir => {
          const [movei, movej] = DIR_MAP[dir];
          return [i + movei, j + movej];
        },
      );

      for (const [newi, newj] of neighbors) {
        queue.push([newi, newj, time + 1]);
      }
    }

    return successfulEndLocations.size;
  }

  let total = 0;
  for (let i = 0; i < locations.length; i++) {
    const added = getNumCheatsStartingHere(i);
    total += added
    log(`processing ${i}, adding ${added} for total of ${total}`)
  }
  log(total);

  // 2097 is not right
  // 1229 is too low

  // 947684 is too low
  // 1010963 is too low
  // 1011024 is not right
  // 1231862 is too high
}

export default run;
