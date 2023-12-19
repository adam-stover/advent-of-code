import { getLines, log, ints, diff, gcd, lcm, count, makeArray, makeDeepMatrix, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep, hexToDec, MinHeap } from '../utils.js';

let URL = './inputs/18.txt';
// URL = './inputs/t.txt';

const LEFT = 'L';
const UP = 'U';
const DOWN = 'D';
const RIGHT = 'R';

const DIRS = [RIGHT, DOWN, LEFT, UP];

const process = (row) => {
  let hex = row.split('#')[1].slice(0, -1);
  const dir = DIRS[hex.slice(-1)];

  return [hexToDec(hex.slice(0, -1)), dir];
}

export async function dayEighteen() {
  const rows = (await getLines(URL)).map(process);

  let minx = 0;
  let maxx = 0;
  let miny = 0;
  let maxy = 0;

  let x = 0;
  let y = 0;

  for (let i = 0; i < rows.length; i++) {
    const [amount, dir] = rows[i];

    if (dir === RIGHT) {
      x += amount;
      maxx = max([maxx, x]);
    } else if (dir === LEFT) {
      x -= amount;
      minx = min([minx, x])
    } else if (dir === UP) {
      y -= amount;
      miny = min([miny, y]);
    } else {
      y += amount;
      maxy = max([maxy, y]);
    }
  }

  let startingX = 0 - minx;
  let startingY = 0 - miny;
  let currentRowIndex = 0;
  let unprocessedSpace = true;

  c(rows.slice(0, 10))

  while (unprocessedSpace) {

  }


  // OK my idea is to is minx and miny to normalize everything so top left of grid (0, 0) so no negatives
  // Then have an array of ranges, so like [HORIZONTAL, y, xStart, xEnd] or [VERTICAL, x, yStart, yEnd]
  // Once that's it place, you start methodically encapsulating the entire grid in rectangles
  // Get the area of those subrectangles, and boom you're done
  // for (let i = 0; i < rows.length; i++) {
  //   const [amount, dir] = rows[i];

  //   if (dir === RIGHT) {
  //     x += amount;
  //     maxx = max([maxx, x]);
  //   } else if (dir === LEFT) {
  //     x -= amount;
  //     minx = min([minx, x])
  //   } else if (dir === UP) {
  //     y -= amount;
  //     miny = min([miny, y]);
  //   } else {
  //     y += amount;
  //     maxy = max([maxy, y]);
  //   }
  // }
}

// 54414 is not the right answer
// 122958 is not the right answer

export default dayEighteen;
