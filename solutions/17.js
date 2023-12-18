import { getLines, ints, diff, gcd, lcm, count, makeArray, makeDeepMatrix, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep, MinHeap } from '../utils.js';

let URL = './inputs/17.txt';
// URL = './inputs/t.txt';

const LEFT = 0;
const UP = 1;
const DOWN = 2;
const RIGHT = 3;

const DIR_MAP = {
  [LEFT]: [0, -1],
  [RIGHT]: [0, 1],
  [UP]: [-1, 0],
  [DOWN]: [1, 0],
};

const OPPOSITE_MAP = {
  [LEFT]: RIGHT,
  [UP]: DOWN,
  [RIGHT]: LEFT,
  [DOWN]: UP,
};

const DIRS = [LEFT, DOWN, RIGHT, UP];

export async function daySeventeen() {
  const rows = (await getLines(URL)).map(row => row.split('').map(Number));
  const m = rows.length;
  const n = rows[0].length;

  // Heuristic doesn't even follow rules LOL -- but I guess it's admissible because it's optimistic
  const heuristic = (i, j, dir, streak) => {
    let res = 0;

    const goRight = () => {
      if (dir === RIGHT) streak++;
      else {
        dir = RIGHT;
        streak = 0;
      }
      j++;
      res += rows[i][j];
    }

    const goDown = () => {
      if (dir === DOWN) streak++;
      else {
        dir = DOWN;
        streak = 0;
      }
      i++;
      res += rows[i][j];
    }

    const goLeft = () => {
      if (dir === LEFT) streak++;
      else {
        dir = LEFT;
        streak = 0;
      }
      j--;
      res += rows[i][j];
    }

    const goUp = () => {
      if (dir === UP) streak++;
      else {
        dir = UP;
        streak = 0;
      }
      i--;
      res += rows[i][j];
    }

    const goMap = {
      [RIGHT]: goRight,
      [DOWN]: goDown,
      [LEFT]: goLeft,
      [UP]: goUp,
    };

    const go = (newDir) => {
      if (streak >= 9 && dir === newDir) {
        throw new Error(`Cannot continue ${dir}`);
      }
      // if (streak < 3 && dir !== newDir) {
      //   throw new Error(`Must continue more in ${dir} before turning`)
      // }
      if (OPPOSITE_MAP[dir] === newDir) {
        throw new Error(`Can't switch from ${dir} to ${newDir}`);
      }

      goMap[newDir]();
    }

    while (i < m - 1 && j < n - 1) {
      while (i <= j && i < m - 1) {
        if (streak >= 9 && dir === DOWN) {
          if (j < n - 1) go(RIGHT);
          else go(LEFT);
        } else {
          go(DOWN);
        }
      }

      while (j < i && j < n - 1) {
        if (streak >= 9 && dir === RIGHT) {
          if (i < m - 1) go(DOWN);
          else go(UP);
        } else {
          go(RIGHT);
        }
      }
    }

    return res;
  }

  let result = 'FAILURE';

  const stateKey = ([i, j, dir, streak]) => `${i}|${j}|${dir}|${streak}`;
  const cameFrom = makeDeepMatrix(false, m, n, 4, 10);
  const gScore = makeDeepMatrix(Infinity, m, n, 4, 10);
  gScore[0][0] = makeMatrix(10, 4, 0);
  const fScore = makeDeepMatrix(Infinity, m, n, 4, 10);
  fScore[0][0][RIGHT][0] = heuristic(0, 0, RIGHT, 0);
  const queue = new MinHeap(([i, j, dir, streak]) => fScore[i][j][dir][streak]);
  const queueSet = new Set([stateKey([0, 0, RIGHT, 0])]);
  queue.add([0, 0, RIGHT, 0]);

  const reconstructPath = (end) => {
    let [i, j, dir, streak] = end;
    let total = 0;
    while (i !== 0 || j !== 0) {
      console.log(`${i}|${j}`);
      total += rows[i][j];
      [i, j, dir, streak] = cameFrom[i][j][dir][streak];
    }
    return total;
  }

  while (queue.size) {
    const [i, j, dir, streak] = queue.peek();
    const key = stateKey([i, j, dir, streak]);
    if (i === m - 1 && j === n - 1 && streak >= 3) {
      // console.log('SUCCESS');
      result = reconstructPath([i, j, dir, streak]);
      break;
    }

    queue.remove();
    queueSet.delete(key);

    const neighbors = filterMap(
      DIRS,
      direction => {
        if (direction !== dir && streak < 3) return false;
        if (direction === dir && streak >= 9) return false;
        if (direction === UP && (dir === DOWN || i <= 0)) return false;
        if (direction === LEFT && (dir === RIGHT || j <= 0)) return false;
        if (direction === DOWN && (dir === UP || i >= m - 1)) return false;
        if (direction === RIGHT && (dir === LEFT || j >= n - 1)) return false;
        return true;
      },
      direction => {
        const [movei, movej] = DIR_MAP[direction];
        return [i + movei, j + movej, direction, direction === dir ? streak + 1 : 0];
      },
    );

    for (const [newi, newj, newDir, newStreak] of neighbors) {
      const tentativeGScore = gScore[i][j][dir][streak] + rows[newi][newj];
      if (tentativeGScore < gScore[newi][newj][newDir][newStreak]) {
        cameFrom[newi][newj][newDir][newStreak] = [i, j, dir, streak];
        gScore[newi][newj][newDir][newStreak] = tentativeGScore;
        fScore[newi][newj][newDir][newStreak] = tentativeGScore + heuristic([newi, newj, newDir, newStreak]);
        const newKey = stateKey([newi, newj, newDir, newStreak]);
        if (!queueSet.has(newKey)) {
          queueSet.add(newKey);
          queue.add([newi, newj, newDir, newStreak]);
        }
      }
    }
  }

  console.log(result);
}

// 1294 is too high
// 1235 is too high
// 1191 is also too high

export default daySeventeen;
