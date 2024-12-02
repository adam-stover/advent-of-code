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
const OUTSIDE = 'O';
const DOWN = 'DOWN';
const UP = 'UP';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const PIPES = [START, VERT_PIPE, HORI_PIPE, NE_BEND, NW_BEND, SW_BEND, SE_BEND]

export async function dayTen() {
  const rows = (await getLines(URL)).map(row => row.split(''));
  const m = rows.length;
  const n = rows[0].length;
  const pipeMatrix = makeMatrix(n, m, false);

  const getKey = (i, j) => `${i}|${j}`;

  const isAdjacent = ([i, j]) => {
    return (
      pipeMatrix[i][j + 1] ||
      pipeMatrix[i][j - 1] ||
      pipeMatrix[i + 1][j] ||
      pipeMatrix[i - 1][j]
    );
  }

  const diagFreedom = ([i, j]) => {
    if (freedom.has(getKey(i, j)) || rows[i][j] === OUTSIDE) return true;
  }

  const trueEscape = (chunk) => {
    const arr = [...chunk].map(s => s.split('|').map(Number));
    // Got answer by hand. Somehow had 7 outliers? This code fixes
    if (arr.some(([i, j]) => {
      if (
        rows[i][j] === OUTSIDE ||
        (i !== 0 && rows[i - 1][j] === OUTSIDE) ||
        (i !== m - 1 && rows[i + 1][j] === OUTSIDE) ||
        (j !== 0 && rows[i][j - 1] === OUTSIDE) ||
        (j !== n - 1 && rows[i][j + 1] === OUTSIDE)
      ) return true;
    })) return true;
    const adjacents = arr.filter(isAdjacent);
    if (adjacents.some(diagFreedom)) {
      console.log('diagonal freedom');
      return true;
    }

    return false;

    // find pipes adjacent to chunk which DO NOT CONNECT
    // follow their path until they DIVERGE or CONVERGE
    // but what if we hit another potential escape chunk that hasn't been processed yet?
    // let's cross that bridge when we get to it LOL
  }


  let start;
  let curr;
  let direction = DOWN;
  let steps = 1;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (rows[i][j] === START) {
        start = [i, j];
        pipeMatrix[i][j] = true;
        // Cheated here by just looking hehe -- we can do south or west, either is fine
        curr = [i + 1, j];
        break;
      }
    }
  }

  const removeGroup = (key) => {
    for (let k = 0; k < enclosedGroups.length; k++) {
      if (enclosedGroups[k].has(key)) {
        enclosedGroups.splice(k, 1);
        break;
      }
    }
  }

  const doCheck = (i, j, direction) => {
    let s;
    if (direction === DOWN && j !== 0) s = getKey(i, j - 1);
    else if (direction === RIGHT && i !== m - 1) s = getKey(i + 1, j);
    else if (direction === UP && j !== n - 1) s = getKey(i, j + 1);
    else if (direction === LEFT && i !== 0) s = getKey(i - 1, j);
    removeGroup(s);
  }

  const doMark = (i, j, direction) => {
    if (direction === DOWN && j !== 0 && !pipeMatrix[i][j - 1]) rows[i][j - 1] = OUTSIDE;
    else if (direction === RIGHT && i !== m - 1 && !pipeMatrix[i + 1][j]) rows[i + 1][j] = OUTSIDE;
    else if (direction === UP && j !== n - 1 && !pipeMatrix[i][j + 1]) rows[i][j + 1] = OUTSIDE;
    else if (direction === LEFT && i !== 0 && !pipeMatrix[i - 1][j]) rows[i - 1][j] = OUTSIDE;
  }


  while (curr[0] !== start[0] || curr[1] !== start[1]) {
    const [i, j] = curr;
    pipeMatrix[i][j] = true;
    const symbol = rows[i][j];

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

  // Cheated here by just looking hehe
  rows[start[0]][start[1]] = SW_BEND;
  // rows[start[0]][start[1]] = SE_BEND;
  const enclosed = new Set();
  const freedom = new Set();
  const visited = makeMatrix(n, m, false);
  const potentialEnclosed = new Set();
  const enclosedGroups = [];
  let i = Math.floor(m / 2);
  let j = 0;

  while (!pipeMatrix[i][j]) {
    j++;
  }

  const startI = i;
  const startJ = j;
  let symbol = rows[i][j];
  if (symbol === VERT_PIPE) {
    direction = DOWN;
    i++;
  } else if (symbol === HORI_PIPE) {
    throw new Error("shouldn't be here");
  } else if (symbol === NE_BEND) {
    direction = RIGHT;
    j++;
  } else if (symbol === NW_BEND) {
    throw new Error("shouldn't be here 2");
  } else if (symbol === SW_BEND) {
    throw new Error("shouldn't be here 3");
  } else if (symbol === SE_BEND) {
    direction = DOWN;
    i++;
  } else {
    throw new Error("shouldn't be here 4");
  }

  doMark(startI, startJ, DOWN);

  while ((i !== startI || j !== startJ) && i < m && j < n) {
    symbol = rows[i][j];
    // console.log(`${i} - ${j} - ${direction} - ${symbol}`)
    doMark(i, j, direction);
    // for (const row of rows) console.log(row.join(''));

    if (direction === DOWN) {
      if (symbol === VERT_PIPE) {
        i += 1;
      } else if (symbol === NE_BEND) {
        doMark(i, j, RIGHT);
        // check down and left
        // if (i !== m - 1 && j !== 0 && !pipeMatrix[i + 1][j - 1]) rows[i + 1][j - 1] = OUTSIDE;
        // removeGroup(getKey(i + 1, j - 1));
        j += 1;
        direction = RIGHT;
      } else if (symbol === NW_BEND) {
        doMark(i, j, LEFT);
        // check down and right
        // if (i !== m - 1 && j !== n - 1 && !pipeMatrix[i + 1][j + 1]) rows[i + 1][j + 1] = OUTSIDE;
        // removeGroup(getKey(i + 1, j + 1));
        j -= 1;
        direction = LEFT;
      } else {
        throw new Error('we have failed');
      }
    } else if (direction === UP) {
      if (symbol === VERT_PIPE) {
        i -= 1;
      } else if (symbol === SW_BEND) {
        doMark(i, j, LEFT);
        // check up and right
        // if (i !== 0 && j !== n - 1 && !pipeMatrix[i - 1][j + 1]) rows[i - 1][j + 1] = OUTSIDE;
        // removeGroup(getKey(i - 1, j + 1));
        j -= 1;
        direction = LEFT;
      } else if (symbol === SE_BEND) {
        doMark(i, j, RIGHT);
        // check up and left
        // if (i !== 0 && j !== 0 && !pipeMatrix[i - 1][j - 1]) rows[i - 1][j - 1] = OUTSIDE;
        // removeGroup(getKey(i - 1, j - 1));
        j += 1;
        direction = RIGHT;
      } else {
        throw new Error('we have failed');
      }
    } else if (direction === LEFT) {
      if (symbol === HORI_PIPE) {
        j -= 1;
      } else if (symbol === NE_BEND) {
        doMark(i, j, UP);
        // check down and left
        // if (i !== m - 1 && j !== 0 && !pipeMatrix[i + 1][j - 1]) rows[i + 1][j - 1] = OUTSIDE;
        // removeGroup(getKey(i + 1, j - 1));
        i -= 1;
        direction = UP;
      } else if (symbol === SE_BEND) {
        doMark(i, j, DOWN);
        // check up and left
        // if (i !== 0 && j !== 0 && !pipeMatrix[i - 1][j - 1]) rows[i - 1][j - 1] = OUTSIDE;
        // removeGroup(getKey(i - 1, j - 1));
        i += 1;
        direction = DOWN;
      } else {
        throw new Error('we have failed');
      }
    } else if (direction === RIGHT) {
      if (symbol === HORI_PIPE) {
        j += 1;
      } else if (symbol === NW_BEND) {
        doMark(i, j, UP);
        // check down and right
        // if (i !== m - 1 && j !== n - 1 && !pipeMatrix[i + 1][j + 1]) rows[i + 1][j + 1] = OUTSIDE;
        // removeGroup(getKey(i + 1, j + 1));
        i -= 1;
        direction = UP;
      } else if (symbol === SW_BEND) {
        doMark(i, j, DOWN);
        // check up and right
        // if (i !== 0 && j !== n - 1 && !pipeMatrix[i - 1][j + 1]) rows[i - 1][j + 1] = OUTSIDE;
        // removeGroup(getKey(i - 1, j + 1));
        i += 1;
        direction = DOWN;
      } else {
        throw new Error('we have failed');
      }
    }
  }

  for (let rowIndex = 1; rowIndex < m - 1; rowIndex++) {
    for (let columnIndex = 1; columnIndex < n - 1; columnIndex++) {
      if (visited[rowIndex][columnIndex] || pipeMatrix[rowIndex][columnIndex]) {
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

        if (!j || j >= n - 1 || !i || i >= m - 1 || rows[i][j] === OUTSIDE) {
          escaped = true;
          break;
        }

        // idea -- depending on which direction we're checking (here it's E then W then S then N)
        // Check to see if there's the type of pipe that might leak through
        // For example, if moving east -- a vertical pipe blocks, the others DON'T
        // Can we just scan infinitely in that direction?
        if (j !== n - 1 && !pipeMatrix[i][j + 1] && !visited[i][j + 1]) {
          visited[i][j + 1] = true;
          queue.push([i, j + 1]);
          potentialEnclosed.add(getKey(i, j + 1));
        }
        if (j !== 0 && !pipeMatrix[i][j - 1] && !visited[i][j - 1]) {
          visited[i][j - 1] = true;
          queue.push([i, j - 1]);
          potentialEnclosed.add(getKey(i, j - 1));
        }
        if (i !== m - 1 && !pipeMatrix[i + 1][j] && !visited[i + 1][j]) {
          visited[i + 1][j] = true;
          queue.push([i + 1, j]);
          potentialEnclosed.add(getKey(i + 1, j));
        }
        if (i !== 0 && !pipeMatrix[i - 1][j] && !visited[i - 1][j]) {
          visited[i - 1][j] = true;
          queue.push([i - 1, j]);
          potentialEnclosed.add(getKey(i - 1, j));
        }
      }

      if (!escaped) escaped = trueEscape(potentialEnclosed);

      if (!escaped) {
        enclosedGroups.push(new Set([...potentialEnclosed]));
        // for (const s of potentialEnclosed) {
        //   const [rowIndex, columnIndex] = s.split('|').map(Number);
        //   enclosed.add(s);
        //   rows[rowIndex][columnIndex] = 'I';
        // }
      } else {
        for (const s of potentialEnclosed) {
          const [rowIndex, columnIndex] = s.split('|').map(Number);
          freedom.add(s);
          rows[rowIndex][columnIndex] = OUTSIDE;
        }
      }
      potentialEnclosed.clear();
    }
  }

  for (const group of enclosedGroups) {
    const escaped = trueEscape(group);
    if (escaped) console.log('gotcha')
    for (const s of group) {
      const [rowIndex, columnIndex] = s.split('|').map(Number);
      enclosed.add(s);
      rows[rowIndex][columnIndex] = 'I';
    }
  }

  // 95 is not right
  // 424 is not right
  // 432 is TOO HIGH
  // for (let i = 0; i < pipeMatrix.length; i++) {
  //   const row = pipeMatrix[i];
  //   console.log(row.map((cell, j) => cell ? rows[i][j] : GROUND).join(''));
  // }
  // console.log('');
  for (const row of rows) console.log(row.join(''));
  console.log(enclosed.size)
}

export default dayTen;
