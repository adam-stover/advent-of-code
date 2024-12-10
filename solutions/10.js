import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/10.txt';
// URL = './inputs/t.txt';

export async function run() {
  const lines = await getLines(URL);
  const map = lines.map(x => x.split('').map(Number));
  const iLen = map.length;
  const jLen = map[0].length;

  const getScore = (trailhead) => {
    const [startI, startJ] = trailhead;

    const queue = [[startI, startJ]];
    const destinations = new Set();

    while (queue.length) {
      const [i, j] = queue.shift();
      const val = map[i][j];
      if (val === 9) destinations.add(`${i}-${j}`);
      else {
        const target = val + 1;
        if (i > 0 && map[i - 1][j] === target) {
          queue.push([i - 1, j]);
        }
        if (i < iLen - 1 && map[i + 1][j] === target) {
          queue.push([i + 1, j]);
        }
        if (j > 0 && map[i][j - 1] === target) {
          queue.push([i, j - 1]);
        }
        if (j < jLen - 1 && map[i][j + 1] === target) {
          queue.push([i, j + 1]);
        }
      }
    }

    return destinations.size
  }

  const getRating = (trailhead) => {
    const [startI, startJ] = trailhead;

    const queue = [[startI, startJ, '']];
    let paths = 0;

    while (queue.length) {
      const [i, j] = queue.shift();
      const val = map[i][j];
      if (val === 9) paths++;
      else {
        const target = val + 1;
        if (i > 0 && map[i - 1][j] === target) {
          queue.push([i - 1, j]);
        }
        if (i < iLen - 1 && map[i + 1][j] === target) {
          queue.push([i + 1, j]);
        }
        if (j > 0 && map[i][j - 1] === target) {
          queue.push([i, j - 1]);
        }
        if (j < jLen - 1 && map[i][j + 1] === target) {
          queue.push([i, j + 1]);
        }
      }
    }

    return paths;
  }

  const getTrailheads = () => {
    const trailheads = [];
    for (let i = 0; i < iLen; i++) {
      for (let j = 0; j < jLen; j++) {
        if (map[i][j] === 0) trailheads.push([i, j]);
      }
    }
    return trailheads;
  }

  const trailheads = getTrailheads();
  let sum = 0;
  for (const trailhead of trailheads) {
    sum += getScore(trailhead);
  }
  log(sum);
}

export default run;
