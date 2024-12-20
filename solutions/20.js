import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log, MinHeap } from '../utils.js';

let URL = './inputs/20.txt';
// URL = './inputs/t.txt';

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

const CHEAT_TIME = 1;
const TIME_SAVE_THRESHOLD = 100;

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

  const bfs = (cheat, cheatStart, cheatEnd, best) => {
    const queue = [[starti, startj, 0, '']];
    const visited = makeMatrix(jLen, iLen, () => ({}));

    const filterNormal = (dir, i, j, activation) => {
        if (dir === EAST && (j >= jLen - 1 || rows[i][j + 1] === WALL || visited[i][j + 1][activation])) return false;
        if (dir === SOUTH && (i >= iLen - 1 || rows[i + 1][j] === WALL || visited[i + 1][j][activation])) return false;
        if (dir === WEST && (j <= 0 || rows[i][j - 1] === WALL || visited[i][j - 1][activation])) return false;
        if (dir === NORTH && (i <= 0 || rows[i - 1][j] === WALL || visited[i - 1][j][activation])) return false;
        return true;
    }

    const filterCheat = (dir, i, j, activation) => {
        if (dir === EAST && (j >= jLen - 1 || visited[i][j + 1][activation])) return false;
        if (dir === SOUTH && (i >= iLen - 1 || visited[i + 1][j][activation])) return false;
        if (dir === WEST && (j <= 0 || visited[i][j - 1][activation])) return false;
        if (dir === NORTH && (i <= 0 || visited[i - 1][j][activation])) return false;
        return true;
    }

    const solves = [];

    while (queue.length) {
        const [i, j, time, activation] = queue.shift();
        // if (i === 8 && j === 7) log('here')

        if (time > best - TIME_SAVE_THRESHOLD) continue;
        if (i === endi && j === endj) {
            // log(`Got a solve with ${time} and ${activation}!`)
            solves.push([time, activation]);
            continue;
        }
        visited[i][j][activation] = true;

        const neighbors = filterMap(
            DIRS,
            dir => {
                if (cheat && time >= cheatStart && time < cheatEnd) return filterCheat(dir, i, j, activation);
                return filterNormal(dir, i, j, activation);
            },
            dir => {
                const [movei, movej] = DIR_MAP[dir];
                return [i + movei, j + movej];
            }
        )

        for (const [newi, newj] of neighbors) {
            if (time === cheatStart) {
                queue.push([newi, newj, time + 1, `${newi}-${newj}`]);
            } else if (time === cheatEnd) {
                queue.push([newi, newj, time + 1, `${activation}|${newi}-${newj}`]);
            } else {
                queue.push([newi, newj, time + 1, activation]);
            }
        }
    }

    return solves
  }

  const dijkstra = (cheat, cheatStart, cheatEnd) => {
    const visited = makeMatrix(jLen, iLen, false);
    const dists = makeMatrix(jLen, iLen, Infinity);
    dists[starti][startj] = 0;
    const queue = new MinHeap(([i, j]) => dists[i][j]);
    queue.add([starti, startj, 0]);
    let activation = '';

    const filterNormal = (dir, i, j) => {
        if (dir === EAST && (j >= jLen - 1 || rows[i][j + 1] === WALL || visited[i][j + 1])) return false;
        if (dir === SOUTH && (i >= iLen - 1 || rows[i + 1][j] === WALL || visited[i + 1][j])) return false;
        if (dir === WEST && (j <= 0 || rows[i][j - 1] === WALL || visited[i][j - 1])) return false;
        if (dir === NORTH && (i <= 0 || rows[i - 1][j] === WALL || visited[i - 1][j])) return false;
        return true;
    }

    const filterCheat = (dir, i, j) => {
        if (dir === EAST && (j >= jLen - 1 || visited[i][j + 1])) return false;
        if (dir === SOUTH && (i >= iLen - 1 || visited[i + 1][j])) return false;
        if (dir === WEST && (j <= 0 || visited[i][j - 1])) return false;
        if (dir === NORTH && (i <= 0 || visited[i - 1][j])) return false;
        return true;
    }

    while (queue.size) {
        const [i, j, time] = queue.remove();
        if (time === cheatStart) activation = `${i}-${j}`;
        visited[i][j] = true;

        const neighbors = filterMap(
            DIRS,
            dir => {
                if (cheat && time >= cheatStart && time < cheatEnd) return filterCheat(dir, i, j);
                return filterNormal(dir, i, j);
            },
            dir => {
                const [movei, movej] = DIR_MAP[dir];
                return [i + movei, j + movej];
            }
        )

        for (const [newi, newj] of neighbors) {
            const tentative = dists[i][j] + 1;

            if (tentative < dists[newi][newj]) {
                dists[newi][newj] = tentative;
            }
            queue.add([newi, newj, time + 1]);
        }
    }

    return [dists[endi][endj], activation];
  }

  const [best] = dijkstra(false);
  log(best);
  const cheats = [];
  for (let startTime = 0; startTime < best - CHEAT_TIME; startTime++) {
    const allSolves = bfs(true, startTime, startTime + CHEAT_TIME, best);
    for (const [time, activation] of allSolves) {
        cheats.push([time, activation]);
    }
  }
  const passingCheats = new Set(filterMap(
    cheats,
    ([time]) => (best - time) >= TIME_SAVE_THRESHOLD,
    ([_, activation]) => activation,
  ));

//   log(passingCheats);
  log(passingCheats.size);

  // 2097 is not right
  // 1229 is too low
}

export default run;
