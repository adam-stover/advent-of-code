import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log, MinHeap, makeDeepMatrix, count } from '../utils.js';

let URL = './inputs/16.txt';
// URL = './inputs/t.txt';

const REINDEER = 'S';
const END = 'E';
const WALL = '#';
const AIR = '.';

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

const MOVE_COST = 1;
const TURN_COST = 1000;

export async function run() {
  const rows = (await getLines(URL)).map(str => str.split(''));
  const iLen = rows.length;
  const jLen = rows[0].length;

  const startDir = EAST;

  const getReindeer = () => {
    for (let i = 1; i < iLen; i++) {
      for (let j = 1; j < jLen; j++) {
        if (rows[i][j] === REINDEER) return [i, j];
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

  const [starti, startj] = getReindeer();
  const [endi, endj] = getEnd();
  const cameFrom = makeDeepMatrix(false, iLen, jLen, 4);

  log(`getting from ${starti}, ${startj}, to ${endi}, ${endj}`)

  const dijstrka = () => {
    const visited = makeDeepMatrix(false, iLen, jLen, 4);
    const dists = makeDeepMatrix(Infinity, iLen, jLen, 4);
    dists[starti][startj][startDir] = 0;
    // dists[starti][startj][SOUTH] = 0;
    // dists[starti][startj][WEST] = 0;
    // dists[starti][startj][NORTH] = 0;
    const queue = new MinHeap(([i, j, dir]) => dists[i][j][dir]);
    queue.add([starti, startj, startDir]);

    while (queue.size) {
      // log(queue.heap)
      const [i, j, dir] = queue.remove();

      // if (i === endi && j === endj)
      // log(`checking ${i}, ${j}, ${dir} which has the best cost of ${dists[i][j]}`)

      visited[i][j][dir] = true;

      const neighbors = filterMap(
        DIRS,
        direction => {
          if (direction === EAST && (dir === WEST || j >= jLen - 1 || rows[i][j + 1] === WALL || visited[i][j + 1][direction])) return false;
          if (direction === SOUTH && (dir === NORTH || i >= iLen - 1 || rows[i + 1][j] === WALL || visited[i + 1][j][direction])) return false;
          if (direction === WEST && (dir === EAST || j <= 0 || rows[i][j - 1] === WALL || visited[i][j - 1][direction])) return false;
          if (direction === NORTH && (dir === SOUTH || i <= 0 || rows[i - 1][j] === WALL || visited[i - 1][j][direction])) return false;
          return true;
        },
        direction => {
          const [movei, movej] = DIR_MAP[direction];
          return [i + movei, j + movej, direction, direction !== dir];
        },
      );

      // if (!neighbors.length) log(`Dead end at ${i},${j}`)

      for (const [newi, newj, newDir, isTurn] of neighbors) {
        const tentativeDist = dists[i][j][dir] + (isTurn ? TURN_COST + MOVE_COST : MOVE_COST);
        // log(`tentative is ${tentativeDist} which is ${dists[i][j]} + ${isTurn ? TURN_COST : MOVE_COST}`)
        if (tentativeDist < dists[newi][newj][newDir]) {
          cameFrom[newi][newj][newDir] = [[i, j, dir]];
          // log(`${tentativeDist} is less than ${dists[newi][newj][newDir]} for ${newi}, ${newj}`)
          dists[newi][newj][newDir] = tentativeDist;
        } else if (tentativeDist === dists[newi][newj][newDir]) {
          cameFrom[newi][newj][newDir].push([i, j, dir]);
          // log(`${tentativeDist} is not less than ${dists[newi][newj]} for ${newi}, ${newj}`)
        }
        queue.add([newi, newj, newDir]);
      }
    }

    return dists[endi][endj];
    // return dists;
  }

  const best = dijstrka();
  const bestScore = min(best);
  log(bestScore);

  const bfs = (bestScore) => {
    const visited = makeDeepMatrix(false, iLen, jLen, 4);
    const queue = [[starti, startj, startDir, 0, [`${starti}-${startj}`]]];
    const answers = [];

    while (queue.length) {
      const [i, j, dir, cost, history] = queue.shift();
      if (i === endi && j === endj && cost === bestScore) {
        answers.push([...history]);
        continue;
      }
      if (cost > bestScore) continue;
      if (visited[i][j][dir] && cost > visited[i][j][dir]) continue;
      visited[i][j][dir] = cost;

      const neighbors = filterMap(
        DIRS,
        direction => {
          if (direction === EAST && (dir === WEST || j >= jLen - 1 || rows[i][j + 1] === WALL)) return false;
          if (direction === SOUTH && (dir === NORTH || i >= iLen - 1 || rows[i + 1][j] === WALL)) return false;
          if (direction === WEST && (dir === EAST || j <= 0 || rows[i][j - 1] === WALL)) return false;
          if (direction === NORTH && (dir === SOUTH || i <= 0 || rows[i - 1][j] === WALL)) return false;
          return true;
        },
        direction => {
          const [movei, movej] = DIR_MAP[direction];
          return [i + movei, j + movej, direction, direction !== dir];
        },
      );

      for (const [newi, newj, newDir, isTurn] of neighbors) {
        queue.push([newi, newj, newDir, cost + MOVE_COST + (isTurn ? TURN_COST : 0), [...history, `${newi}-${newj}`]])
      }
    }

    return answers;
  }

  const answers = bfs(bestScore);
  const tileSet = new Set();
  for (const history of answers) {
    for (const tile of history) {
      tileSet.add(tile);
    }
  }
  log(tileSet.size)

  // const visitedTiles = makeMatrix(jLen, iLen, false);

  // const reconstructPath = (cur) => {
  //   const [i, j, dir] = cur;
  //   visitedTiles[i][j] = true;

  //   if (i === starti && j === startj) return;

  //   for (const origin of cameFrom[i][j][dir]) {
  //     const [nexti, nextj] = origin;
  //     if (!visitedTiles[nexti][nextj]) reconstructPath(origin);
  //   }
  // }

  // for (let i = 0; i < best.length; i++) {
  //   if (best[i] === bestScore) reconstructPath([endi, endj, i]);
  // }

  // let total = 0;
  // for (const row of visitedTiles) {
  //   total += count(row, true);
  // }
  // log(total);

  // const queue = [starti, startj];

  // while (queue.length) {

  // }
}

export default run;
