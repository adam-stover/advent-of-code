import { getLines, ints, diff, gcd, lcm, count, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex } from '../utils.js';

let URL = './inputs/10.txt';
// URL = './inputs/t.txt';

const START = 'S';
const GROUND = '.';
const VERT_PIPE = '|';
const HORI_PIPE = '-';
const NE_BEND = 'L';
const NW_BEND = 'J';
const SW_BEND = '7';
const SE_BEND = 'F';
const DOWN = 'DOWN';
const UP = 'UP';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

export async function dayTen() {
  const rows = (await getLines(URL)).map(row => row.split(''));
  const m = rows.length;
  const n = rows[0].length;

  let start;
  let curr;
  let direction = DOWN;
  let steps = 1;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (rows[i][j] === START) {
        start = [i, j];
        curr = [i + 1, j];
        break;
      }
    }
  }

  while (curr[0] !== start[0] || curr[1] !== start[1]) {
    const [i, j] = curr;
    const symbol = rows[i][j];
    rows[i][j] = START;

    if (direction === DOWN) {
      if (symbol === VERT_PIPE) {
        curr[0] += 1;
      } else if (symbol === NE_BEND) {
        curr[1] += 1;
        direction = RIGHT;
      } else if (symbol === NW_BEND) {
        curr[1] -= 1;
        direction = LEFT;
      } else {
        throw new Error('we have failed');
      }
    } else if (direction === UP) {
      if (symbol === VERT_PIPE) {
        curr[0] -= 1;
      } else if (symbol === SW_BEND) {
        curr[1] -= 1;
        direction = LEFT;
      } else if (symbol === SE_BEND) {
        curr[1] += 1;
        direction = RIGHT;
      } else {
        throw new Error('we have failed');
      }
    } else if (direction === LEFT) {
      if (symbol === HORI_PIPE) {
        curr[1] -= 1;
      } else if (symbol === NE_BEND) {
        curr[0] -= 1;
        direction = UP;
      } else if (symbol === SE_BEND) {
        curr[0] += 1;
        direction = DOWN;
      } else {
        throw new Error('we have failed');
      }
    } else if (direction === RIGHT) {
      if (symbol === HORI_PIPE) {
        curr[1] += 1;
      } else if (symbol === NW_BEND) {
        curr[0] -= 1;
        direction = UP;
      } else if (symbol === SW_BEND) {
        curr[0] += 1;
        direction = DOWN;
      } else {
        throw new Error('we have failed');
      }
    }

    steps++;
  }

  const enclosed = new Set();
  const visited = makeMatrix(n, m, false);
  const potentialEnclosed = new Set();

  for (let rowIndex = 1; rowIndex < m - 1; rowIndex++) {
    for (let columnIndex = 1; columnIndex < n - 1; columnIndex++) {
      if (visited[rowIndex][columnIndex] || rows[rowIndex][columnIndex] === START) {
        visited[rowIndex][columnIndex] = true;
        continue;
      }

      visited[rowIndex][columnIndex] = true;

      const queue = [[rowIndex, columnIndex]];
      potentialEnclosed.add(`${rowIndex}|${columnIndex}`);
      let escaped = false;

      while (queue.length) {
        const point = queue.shift();
        const [i, j] = point;

        if (!j || j >= n - 1 || !i || i >= m - 1) {
          escaped = true;
          break;
        }

        if (j !== n - 1 && rows[i][j + 1] !== START && !visited[i][j + 1]) {
          visited[i][j + 1] = true;
          queue.push([i, j + 1]);
          potentialEnclosed.add(`${i}|${j + 1}`);
        }
        if (j !== 0 && rows[i][j - 1] !== START && !visited[i][j - 1]) {
          visited[i][j - 1] = true;
          queue.push([i, j - 1]);
          potentialEnclosed.add(`${i}|${j - 1}`);
        }
        if (i !== m - 1 && rows[i + 1][j] !== START && !visited[i + 1][j]) {
          visited[i + 1][j] = true;
          queue.push([i + 1, j]);
          potentialEnclosed.add(`${i + 1}|${j}`);
        }
        if (i !== 0 && rows[i - 1][j] !== START && !visited[i - 1][j]) {
          visited[i - 1][j] = true;
          queue.push([i - 1, j]);
          potentialEnclosed.add(`${i - 1}|${j}`);
        }
      }

      if (!escaped) {
        console.log('nothing escaped');
        for (const p of potentialEnclosed) {
          enclosed.add(p);
        }
      }
      potentialEnclosed.clear();
    }
  }

  for (const row of rows) console.log(row.join(''));
  console.log(enclosed.size)
}

export default dayTen;
