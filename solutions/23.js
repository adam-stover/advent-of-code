import { getLines, log, ints, diff, gcd, lcm, count, makeArray, mergeMatrix, makeDeepMatrix, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep, hexToDec, MinHeap, MaxHeap } from '../utils.js';

let URL = './inputs/23.txt';
// URL = './inputs/t.txt';

const PATH = '.';
const FOREST = '#';
const NORTH_SLOPE = '^';
const EAST_SLOPE = '>';
const SOUTH_SLOPE = 'v';
const WEST_SLOPE = '<';

export async function dayTwentyThree() {
  const rows = (await getLines(URL)).map(str => str.split(''));
  const m = rows.length;
  const n = rows[0].length;

  const originalVisited = makeDeepMatrix(false, m, n);

  const starti = 0;
  const startj = rows[starti].indexOf(PATH);

  const endi = m - 1;
  const endj = rows[endi].indexOf(PATH);

  const printVisited = (i, j, v) => {
    log(`We visited ${i} ${j} already`)
    v[i][j] = 'X';
    for (let i = 0; i < v.length; i++) {
      const row = v[i].map((c, j) => c === 'X' ? 'X' : c ? 'O' : rows[i][j]);
      log(row.join(''));
    }
  }

  const memoLongest = (() => {
    const cache = {};

    return (start, end, visited) => {
      const key = `${start[0]}|${start[1]}`;
      if (!has(cache, key)) {
        cache[key] = longest(start, end, visited);
      }
      else log('cache hit')
      return cache[key];
    };
  })();

  // const longest = (start, end, visited) => {
  //   if (start[0] === end[0] && start[1] === end[1]) return 0;

  //   const [i, j] = start;
  //   const v = cloneMatrix(visited);
  //   v[i][j] = true;

  //   const cell = rows[i][j];

  //   if (cell !== PATH) {
  //     if (cell === NORTH_SLOPE) return 1 + memoLongest([i - 1, j], end, v);
  //     if (cell === EAST_SLOPE) return 1 + memoLongest([i, j + 1], end, v);
  //     if (cell === SOUTH_SLOPE) return 1 + memoLongest([i + 1, j], end, v);
  //     if (cell === WEST_SLOPE) return 1 + memoLongest([i, j - 1], end, v);
  //   }

  //   const options = [];

  //   if (i > 0 && rows[i - 1][j] !== FOREST && rows[i - 1][j] !== SOUTH_SLOPE && !v[i - 1][j]) options.push([i - 1, j]);
  //   if (i < m - 1 && rows[i + 1][j] !== FOREST && rows[i + 1][j] !== NORTH_SLOPE && !v[i + 1][j]) options.push([i + 1, j]);
  //   if (j > 0 && rows[i][j - 1] !== FOREST && rows[i][j - 1] !== EAST_SLOPE && !v[i][j - 1]) options.push([i, j - 1]);
  //   if (j < n - 1 && rows[i][j + 1] !== FOREST && rows[i][j + 1] !== WEST_SLOPE && !v[i][j + 1]) options.push([i, j + 1]);

  //   return 1 + max(options.map(s => memoLongest(s, end, v)));
  // }

  const longest = (start, end, visited) => {
    let res = 0;

    let [i, j] = start;
    const v = cloneMatrix(visited);

    while (i !== end[0] || j !== end[1]) {
      res += 1;
      v[i][j] = true;

      const cell = rows[i][j];

      // if (cell !== PATH) {
      //   if (cell === NORTH_SLOPE) i -= 1;
      //   else if (cell === EAST_SLOPE) j += 1;
      //   else if (cell === SOUTH_SLOPE) i += 1;
      //   else j -= 1
      // } else {
        const options = [];

        if (i > 0 && rows[i - 1][j] !== FOREST && /*rows[i - 1][j] !== SOUTH_SLOPE && */!v[i - 1][j]) options.push([i - 1, j]);
        if (i < m - 1 && rows[i + 1][j] !== FOREST && /*rows[i + 1][j] !== NORTH_SLOPE && */!v[i + 1][j]) options.push([i + 1, j]);
        if (j > 0 && rows[i][j - 1] !== FOREST && /*rows[i][j - 1] !== EAST_SLOPE && */!v[i][j - 1]) options.push([i, j - 1]);
        if (j < n - 1 && rows[i][j + 1] !== FOREST && /*rows[i][j + 1] !== WEST_SLOPE && */!v[i][j + 1]) options.push([i, j + 1]);

        if (options.length > 1) return res + max(options.map(s => memoLongest(s, end, v)));
        if (!options.length) return -Infinity;
        i = options[0][0];
        j = options[0][1];
      // }
    }

    // printVisited(i, j, v);
    // log(end);
    return res;
  }

  const dijkstra = () => {
    const visited = makeDeepMatrix(false, m, n);
    const dists = makeDeepMatrix(Infinity, m, n);
    dists[starti][startj] = 0;
    const queue = new MinHeap(([i, j]) => dists[i][j]);
    queue.add([starti, startj]);

    while (queue.size) {
      const [i, j] = queue.peek();
      if (i === endi && j === endj) {
        log(dists[i][j]);
      }
      queue.remove();
      visited[i][j] = true;
      if (i > 0 && rows[i - 1][j] !== FOREST && !visited[i - 1][j]) {
        const tentativeDist = dists[i][j] - 1;
        if (tentativeDist < dists[i - 1][j]) dists[i - 1][j] = tentativeDist
        queue.add([i - 1, j]);
      }
      if (i < m - 1 && rows[i + 1][j] !== FOREST && !visited[i + 1][j]) {
        const tentativeDist = dists[i][j] - 1;
        if (tentativeDist < dists[i + 1][j]) dists[i + 1][j] = tentativeDist
        queue.add([i + 1, j]);
      }
      if (j > 0 && rows[i][j - 1] !== FOREST && !visited[i][j - 1]) {
        const tentativeDist = dists[i][j] - 1;
        if (tentativeDist < dists[i][j - 1]) dists[i][j - 1] = tentativeDist
        queue.add([i, j - 1]);
      }
      if (j < n - 1 && rows[i][j + 1] !== FOREST && !visited[i][j + 1]) {
        const tentativeDist = dists[i][j] - 1;
        if (tentativeDist < dists[i][j + 1]) dists[i][j + 1] = tentativeDist
        queue.add([i, j + 1]);
      }
    }

    return dists[endi][endj]
  }

  // const best = longest([starti, startj], [endi, endj], originalVisited);
  const best = dijkstra();
  log(best);

  // Brute force works but took hours
  // Dijkstra did not give right answer
  // Will try bellman-ford

  // const heuristic = (i, j, visited) => {
  //   const v = cloneMatrix(visited);


  // }

  // let result = 'FAILURE';

  // const visited = makeDeepMatrix(false, m, n);
  // const stateKey = ([i, j]) => `${i}|${j}`;
  // const cameFrom = makeDeepMatrix(false, m, n);
  // const gScore = makeDeepMatrix(Infinity, m, n);
  // gScore[starti][startj] = 0;
  // const fScore = makeDeepMatrix(Infinity, m, n);
  // fScore[starti][startj] = heuristic(starti, startj, visited);
  // const queue = new MinHeap(([i, j]) => fScore[i][j]);
  // queue.add([starti, startj]);

  // const reconstructPath = (end) => {
  //   let [i, j] = end;
  //   let total = 0;
  //   while (i !== starti || j !== startj) {
  //     total += rows[i][j];
  //     [i, j] = cameFrom[i][j];
  //   }
  //   return total;
  // }

  // while (queue.size) {
  //   const [i, j] = queue.peek();
  //   const key = stateKey([i, j]);
  //   if (i === endi && j === endj) {
  //     result = reconstructPath([i, j]);
  //     break;
  //   }

  //   queue.remove();

  //   const neighbors = [];

  //   if (i > 0 && )
  // }
}

// 2163 is too low
// 2166 is correct
// ---------------
// 4946 is too low
// 5534 is too low
// 6930 is too low
// 6378

export default dayTwentyThree;
