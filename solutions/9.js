import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/9.txt';
let LOG = true;
// URL = './inputs/t.txt';
LOG = false;

const area = (a, b) => {
  const dx = 1 + Math.abs(a[0] - b[0]);
  const dy = 1 + Math.abs(a[1] - b[1]);

  return dx * dy;
}

const UP = 0;
const LEFT = 1;
const DOWN = 2;
const RIGHT = 3;

const VERT = 0;
const HORI = 1;

const getDir = (a, b) => {
  if (a[0] === b[0]) return a[1] > b[1] ? UP : DOWN;
  return a[0] > b[0] ? LEFT : RIGHT;
}

const key = (a) => (`${a[0]}-${a[1]}`);

export async function run1() {
  const lines = await getLines(URL);
  const tiles = lines.map(ints);

  const areas = [];

  for (let i = 0; i < tiles.length - 1; i++) {
    for (let j = 1; j < tiles.length; j++) {
      areas.push(area(tiles[i], tiles[j]))
    }
  }
  
  const sorted = areas.sort((a, b) => b - a);

  // log(sorted);
  log(sorted[0]);
}

export async function run() {
  const input = await getLines(URL);
  const tiles = input.map(ints);
  let minx = Infinity;
  let miny = Infinity;
  let maxx = 0;
  let maxy = 0;

  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i][0] < minx) minx = tiles[i][0];
    else if (tiles[i][0] > maxx) maxx = tiles[i][0];
    if (tiles[i][1] < miny) miny = tiles[i][1];
    else if (tiles[i][1] > maxy) maxy = tiles[i][1];
  }

  const maxes = [maxx, maxy];
  const mins = [minx, miny];

  const tileMap = {};
  for (let i = 0; i < tiles.length; i++) {
    const t = tiles[i];
    tileMap[key(t)] = i;
  }

  const vertLines = [];
  const horiLines = [];
  const allLines = [vertLines, horiLines];

  for (let i = 1; i <= tiles.length; i++) {
    const prev = tiles[i - 1];
    const cur = i === tiles.length ? tiles[0] : tiles[i];
    const dir = getDir(prev, cur);
    const axis = dir % 2;
    const perp = axis ? 0 : 1;
    const asc = (dir >> 1) & 1;

    allLines[axis].push([cur[axis], ...(asc ? [prev[perp], cur[perp]] : [cur[perp], prev[perp]])]);
  }

  vertLines.sort((a, b) => a[0] - b[0]);
  horiLines.sort((a, b) => a[0] - b[0]);

  const dirs = ['UP', 'LEFT', 'DOWN', 'RIGHT'];

  const arrange = (axis, parallel, perpendicular) => {
    // if axis is horizontal, put y first, and if axis is vertical, put x first
    return axis ? [perpendicular, parallel] : [parallel, perpendicular];
  }

  const isGreen = (location) => {
    // first, check: are we on a line? if so, regardless of orientation, we're good
    // if not, check all the vertical lines to our left that cross our y axis
    // numGreen + numRed must > 0
    // (numGreen + (numRed / 2)) % 2 must === 1
    // same to the right
    // then same for horizontal lines up and down

    let ret = true;
    let retMsg = `${location} is on the inside, baby!`;
    for (const dir of [UP, LEFT, DOWN, RIGHT]) {
      let count = 0;
      const axis = dir % 2;
      const perp = axis ? 0 : 1;
      const asc = (dir >> 1) & 1;
      // if up, we are scanning along a fixed x, from y=0 to y=location[1]
      // axis is vert (0)
      // perp is hori, which are intersecting lines are going to be: fixed y from x=x1 to x=x2
      // asc is 0
      // othercoord is our y
      const fixed = location[axis];
      const other = location[perp];
      const range = asc ? [other, maxes[perp]] : [mins[perp], other];
      const potentialIntersections = getPotentialIntersections(range, axis);
      const intersectingLines = potentialIntersections.filter(line => fixed >= line[1] && fixed <= line[2]);
      const potentialLine = asc ? intersectingLines[0] : intersectingLines[intersectingLines.length - 1];
      if (potentialLine && other === potentialLine[0]) {
        // we are in a line, let's head out boys!
        const lineStart = arrange(axis, potentialLine[1], other);
        const lineEnd = arrange(axis, potentialLine[2], other);
        if (LOG) log(`${location} is on a line from ${lineStart} to ${lineEnd}`)
        return true;
      }

      if (ret) {
        let ascendingReds = 0;
        let descendingReds = 0;
        for (const line of intersectingLines) {
            const intersection = arrange(axis, fixed, line[0]);
            if (isRed(intersection)) {
              // things are kinda weird here. we have to keep extra count of whether they're going up or down
              if (fixed === line[1]) ascendingReds++;
              else if (fixed === line[2]) descendingReds++;
              else log('wtf');
            }
            else count++;
        }

        count += Math.min(ascendingReds, descendingReds);
        if (count % 2 !== 1) {
          // we are on the outside!
          retMsg = `Oh no! ${location} is on the outside. We know because going ${dirs[dir]} we have ${count} lines`
          ret = false;
        } else {
          retMsg += ` ${dirs[dir]} has ${count} lines`;
        }
      }
    }

    if (LOG) log(retMsg);
    return ret;
  }

  const isRed = (location) => {
    if (has(tileMap, key(location))) {
      if (LOG) log(`${location} is gucci cuz it's red`)
      return true;
    }
    return false
  }

  const isInside = (() => {
    const cache = {};

    return (location) => {
      const locKey = key(location);
      if (!has(cache, locKey)) cache[locKey] = isRed(location) || isGreen(location);
      else if (LOG) log(`${location} is ${cache[locKey] ? 'gucci' : 'no bueno'}: we tested before`)
      return cache[locKey];
    }
  })();

  const areas = [];

  for (let i = 0; i < tiles.length - 1; i++) {
    for (let j = 1; j < tiles.length; j++) {
      areas.push([area(tiles[i], tiles[j]), i, j])
    }
  }

  const sorted = areas.sort((a, b) => b[0] - a[0]);
  // ok, to check a line:
  // find all potential intersections (e.g. for checking a horizontal line, look at all the vertical lines with x ranges between ax and bx)
  // we know that we are 'inside' and the other end is a red tile
  // for any line or red tile, it's ok as long as there are an even number of lines of red tiles in a row
  // if there are any red tiles that are not in a row, it is ok as long as they open outward and are matched by another red tile
  // ahh, but how do we know which direction is 'outward'?
  // I guess we can use our brute force: see if the square after it is green

  const getPotentialIntersections = (range, axis) => {
    // if axis is HORIZ, range is x range, then we need vertical lines
    const candidates = allLines[axis ? 0 : 1];
    const valid = [];

    let low = 0;
    let high = candidates.length - 1;
    let mid;

    while (low <= high) {
      mid = low + Math.floor((high - low) / 2);

      if (candidates[mid][0] < range[0]) low = mid + 1;
      else if (candidates[mid][0] > range[1]) high = mid - 1;
      else break;
    }

    if (candidates[mid][0] < range[0] || candidates[mid][0] > range[1]) return valid;

    const firstFoundIndex = mid;
    mid--;
    while (mid >= 0 && candidates[mid][0] >= range[0]) {
      mid--;
    }
    const lowest = mid + 1;
    mid = firstFoundIndex + 1;
    while (mid < candidates.length && candidates[mid][0] <= range[1]) {
      mid++;
    }
    const highestExclusive = mid;

    return candidates.slice(lowest, highestExclusive);
  }

  const checkLine = (a, b) => {
    if (LOG) log(`Checking line from ${a} to ${b}`)
    if (!(isInside(a) && isInside(b))) {
      if (LOG) log(`${a} - ${b} is invalid cuz they're not both inside!`);
      return false;
    }

    const aKey = key(a);
    const bKey = key(b);
    if (has(tileMap, aKey) && has(tileMap, bKey)) {
      const diff = Math.abs(tileMap[aKey] - tileMap[bKey]);
      if (diff === 1 || diff === tiles.length - 1) {
        if (LOG) log(`straight line from ${a} to ${b}`);
        return true; // straight line from red to next red
      }
    }
    const dir = getDir(a, b);
    const axis = dir % 2;
    const perp = axis ? 0 : 1
    const asc = (dir >> 1) & 1;
    const fixed = a[axis];
    const range = asc ? [a[perp], b[perp]] : [b[perp], a[perp]];
    const potentialIntersections = getPotentialIntersections(range, axis);
    const intersectingLines = potentialIntersections.filter(line => fixed >= line[1] && fixed <= line[2]);
    // in ascending order (right or down)
    for (const line of intersectingLines) {
      if (line[0]  + 1 < range[1]) {
        const location = arrange(axis, fixed, line[0] + 1);
        if (LOG) log(`testing ${location} because of line intersection at ${line}`)
        if (!isInside(location)) {
          if (LOG) log(`Oof! There is a gap from ${a} to ${b} at ${location}, which is outside`)
          return false;
        }
      }
    }
    // let's say we are checking a horizontal line
    // axis is HORIZ, fixed is our y coordinate, range is our x range
    // potentialIntersections is a list of vertical lines with x (their 0th) inside or including our range (>= range[0] && <= range[1])
    // each potential intersection has a fixed x and a y range
    // for each potential intersection, if our y is inside its y range, we have an intersection
    // if we are at the end of the intersecting line, that means we are at a red tile, but actually it doesn't matter
    // we are now in the danger zone, we mark that x value on unresolvedIntersectionPoint
    // we keep going forward until we find an intersecting line that's not one x over (or we hit the end of potential intersections)
    // if we hit our target, we're good, otherwise, check the tile ONE past the line
    // if it's good, then we're good!
    // for (let moving = a[axis ? 0 : 1]; asc ? moving < b[axis ? 0 : 1] : moving > b[axis ? 0 : 1]; asc ? moving++ : moving--) {
      // if (!memo(axis ? [moving, fixed] : [fixed, moving])) return false;
    // }
    if (LOG) log(`Woohoo! ${a} to ${b} is valid!`)
    return true;
  }

  const checkBox = (a, b) => {
    if (LOG) log(`checking box with red corners at ${a} and ${b}`)
    const altA = [a[0], b[1]];
    const altB = [b[0], a[1]];

    return checkLine(a, altA) && checkLine(altA, b) && checkLine(b, altB) && checkLine(altB, a);
  }

  const numToCheck = sorted.length;
  for (let index = 0; index < sorted.length; index++) {
    const [area, i, j] = sorted[index];
    const [a, b] = [tiles[i], tiles[j]];
    if (checkBox(a, b)) {
      log(`${a} -> ${[a[0], b[1]]} -> ${b} -> ${[b[0], a[1]]}`);
      log(area);
      break;
    }
    if (index % 10000 === 0) log(`checked ${index} | ${(100 * index / numToCheck).toFixed(2)}%`)
  }
}

// 4630762112 is too high
// 127347668 is not right
// 101336340 is not right
// 5113200 is not right
// 93214 is too low

export default run;
