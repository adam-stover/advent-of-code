import { getLines } from '../helpers.js';

const URL = './inputs/9.txt';

const has = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

const isAdjacent = (posHead, posTail) => {
  if (
    Math.abs(posHead[0] - posTail[0]) <= 1
    && Math.abs(posHead[1] - posTail[1]) <= 1
  ) {
    return true;
  }
  return false;
}

const moveHead = (posHead, dirChar) => {
  if (dirChar === 'L') posHead[0] -= 1;
  else if (dirChar === 'R') posHead[0] += 1;
  else if (dirChar === 'D') posHead[1] -= 1;
  else posHead[1] += 1;
}

const moveTail = (posHead, posTail) => {
  if (isAdjacent(posHead, posTail)) return;

  if (posHead[0] > posTail[0]) posTail[0] += 1;
  else if (posHead[0] < posTail[0]) posTail[0] -= 1;

  if (posHead[1] > posTail[1]) posTail[1] += 1;
  else if (posHead[1] < posTail[1]) posTail[1] -= 1;
}

const updateCache = (cache, posTail) => {
  if (!has(cache, posTail[0])) cache[posTail[0]] = new Set();
  cache[posTail[0]].add(posTail[1]);
}

export default async function dayNine() {
  // ok so we need to count the number of cells the tail has visited
  // we could make a massive grid and start in the center
  // this is inefficient tho and it's hard to know how big to make the grid
  // ideally we could start with small grid and expand as needed, but arrays can't really expand in two directions, right?
  // we could do a first pass simulation of the head to see how big the grid needs to be tho!
  const movements = await getLines(URL);
  const knotCount = 10;
  const knots = [];
  for (let i = 0; i < knotCount; ++i) {
    knots[i] = [0, 0];
  }
  const cache = {};
  let visitedCount = 0;

  for (let i = 0; i < movements.length; ++i) {
    const [dirChar, count] = movements[i].split(' ');
    for (let j = 0; j < count; ++j) {
      moveHead(knots[0], dirChar);
      for (let k = 1; k < knots.length; ++k) {
        moveTail(knots[k - 1], knots[k]);
      }
      updateCache(cache, knots[knots.length - 1]);
    }
  }

  for (const set of Object.values(cache)) {
    visitedCount += set.size;
  }

  console.log(visitedCount);
}
