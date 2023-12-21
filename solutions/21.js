import { getLines, log, ints, diff, gcd, lcm, count, makeArray, makeDeepMatrix, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep, hexToDec, MinHeap } from '../utils.js';

let URL = './inputs/21.txt';
URL = './inputs/t.txt';

const START = 'S';
const DIRT = '.';
const ROCK = '#';

const STEPS = 10;

export async function dayTwentyOne() {
  const rows = (await getLines(URL)).map(str => str.split(''));
  const m = rows.length;
  const n = rows[0].length;
  const visited = makeMatrix(n, m, 0);

  let start;

  for (let i = 0; i < rows.length; i++) {
    const j = rows[i].indexOf(START);
    if (j !== -1) {
      start = [i, j];
      break;
    }
  }

  rows[start[0]][start[1]] = DIRT;

  const queue = [[...start, 0]];
  let afterQueue = [];
  let plots = 0;
  let overlaps = 0;

  const h = (() => {
    const hEven = (i, j, steps) => {
      // log(`${i} and ${j} and ${m} and ${n}`)
      if (rows[i][j] === DIRT && !visited[i][j]) {
        if (steps % 2 !== 0) visited[i][j] = true;
        queue.push([i, j, steps + 1]);
      }
    };
    const hOdd = (i, j, steps) => {
      // log(`${i} and ${j} and ${m} and ${n}`)
      if (rows[i][j] === DIRT && !visited[i][j]) {
        if (steps % 2 === 0) visited[i][j] = true;
        queue.push([i, j, steps + 1]);
      }
    };
    return STEPS % 2 === 0 ? hEven : hOdd;
  })();

  const handleLeft = (i, j, steps) => {
    j -= 1;
    if (j < 0) {
      overlaps += 1;
      j = n - 1;
      afterQueue.push([i, j, steps + 1]);
    } else {
      h(i, j, steps);
    }
  }
  const handleRight = (i, j, steps) => {
    j += 1;
    if (j >= n) {
      overlaps += 1;
      j = 0;
      afterQueue.push([i, j, steps + 1]);
    } else {
      h(i, j, steps);
    }
  }
  const handleUp = (i, j, steps) => {
    i -= 1;
    if (i < 0) {
      overlaps += 1;
      i = m - 1;
      afterQueue.push([i, j, steps + 1]);
    } else {
      h(i, j, steps);
    }
  }
  const handleDown = (i, j, steps) => {
    i += 1;
    if (i >= m) {
      overlaps += 1;
      i = 0;
      afterQueue.push([i, j, steps + 1]);
    } else {
      h(i, j, steps);
    }
  }

  while (queue.length) {
    const [i, j, steps] = queue.shift();

    if (steps === STEPS) {
      visited[i][j] = true;
      continue;
    }

    handleLeft(i, j, steps);
    handleRight(i, j, steps);
    handleUp(i, j, steps);
    handleDown(i, j, steps);
  }

  // log(afterQueue)
  const set = new Set();
  for (const [i, j, _] of afterQueue) set.add(`${i}|${j}`);
  log(set.size);
  // log(set);
  // OK I'm calling it a night but here's my idea for tomorrow:
  // For each entry point along the edge of the grid, build a cache as you increase number of steps
  // Of how many cells you visit in X # of steps. This is what we'll use to calculate the 'edges'
  // We can know how many 'edge' grids we get to by seeing how long it takes to cross a grid
  // A grid will be entirely filled in in some # of steps after an off-tempo second entry.
  // As in, if a grid is entered at 10, 0 at step 101, then the grid needs to be entered at 10, 0 at step 102
  // Is that even possible though? Or is each grid doomed to have the 'on-off' blink
  // hmmm. Something important to keep in mind too is that my `if (steps % 2 !== 0) visited[i][j] = true;`
  // up in the helper function is only true when the total number of steps is even.
  // I'll modify the code


  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (visited[i][j]) plots++;
    }
  }

  let dirts = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (rows[i][j] === DIRT) dirts++;
    }
  }

  log(overlaps);
  log(dirts);
  log(plots);
  for (const v of visited) console.log(v.map(x => x === true ? 'O' : '.').join(''))
}

// 6904 is wrong
// 3795 is bingo

export default dayTwentyOne;
