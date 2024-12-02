import { getLines, log, ints, diff, gcd, lcm, count, makeArray, makeDeepMatrix, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep, hexToDec, MinHeap } from '../utils.js';

let URL = './inputs/18.txt';
// URL = './inputs/t.txt';

const LEFT = 'L';
const UP = 'U';
const DOWN = 'D';
const RIGHT = 'R';

const OPPOSITE_MAP = {
  [RIGHT]: LEFT,
  [LEFT]: RIGHT,
  [UP]: DOWN,
  [DOWN]: UP,
};

const isHorizontal = (dir) => dir === LEFT || dir === RIGHT;

const DIRS = [RIGHT, DOWN, LEFT, UP];

const process = (row) => {
  // const [dir, num] = row.split(' ');
  // return [Number(num), dir]
  let hex = row.split('#')[1].slice(0, -1);
  const dir = DIRS[hex.slice(-1)];

  return [hexToDec(hex.slice(0, -1)), dir];
}

export async function dayEighteen() {
  let rows = (await getLines(URL)).map(process);

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

  const go = (rows) => {
    let res = 0;
    const xstack = [];
    x = startingX;
    y = startingY;
    let xDir;
    const points = [[startingX, startingY]];

    for (let [amount, dir] of rows) {
      res += amount
      if (dir === RIGHT) x += amount;
      else if (dir === LEFT) x -= amount;
      else if (dir === UP) y -= amount;
      else y += amount;
      points.push([x, y]);
      // log(`We go ${amount} ${dir}`)
      if (isHorizontal(dir)) {
        // while (amount > 0) {
        //   if (!xstack.length || xDir === dir) {
        //     xDir = dir;
        //     xstack.push([amount, y]);
        //     amount = 0
        //   } else {
        //     const i = xstack.length - 1;
        //     let [pastAmount, pastY] = xstack[i];
        //     const a = Math.abs(pastY - y) + 1;
        //     if (amount < pastAmount) {
        //       const b = amount + 1;
        //       // log(`Multiply ${a} by ${b}`)
        //       res += ((a) * (b))/* / 2*/;
        //       xstack[i][0] -= amount;
        //       amount = 0;
        //     } else {
        //       const b = pastAmount + 1;
        //       // log(`Multiply ${a} by ${b}`)
        //       res += ((a) * (b))/* / 2*/;
        //       amount -= b;
        //       xstack.pop();
        //     }
        //   }
        // }
      }
    }
    // points.pop();

    return [res, points];
  }

  let [lineLen, points] = go(rows);
  lineLen = (lineLen / 2) + 1;
  let res = 0;
  for (let i = 1; i < points.length; i++) {
    // res += (points[i][1] + points[i - 1][1]) * (points[i][0] - points[i - 1][0])
    const a = points[i - 1][0] * points[i][1];
    const b = points[i - 1][1] * points[i][0];
    res += a - b;
  }
  res /= 2;
  res = Math.abs(res);
  res += lineLen;
  log(res)
}

  // OK my idea is to is minx and miny to normalize everything so top left of grid (0, 0) so no negatives
  // Then have an array of ranges, so like [HORIZONTAL, y, xStart, xEnd] or [VERTICAL, x, yStart, yEnd]
  // Once that's it place, you start methodically encapsulating the entire grid in rectangles
  // Get the area of those subrectangles, and boom you're done

// 85900536595917 is too high
// 52240187443190

export default dayEighteen;
