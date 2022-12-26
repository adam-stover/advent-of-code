import { cloneMatrix, getLines, has } from '../utils.js';

const URL = './inputs/24.txt';

const WALL = '#';
const OPEN = '.';
const UP = '^';
const DOWN = 'v';
const LEFT = '<';
const RIGHT = '>';

const printMap = (map) => {
  for (const row of map) {
    console.log(row.join(''));
  }
}

const moveBlizzard = (map, blizzard) => {
  let [i, j, dir] = blizzard;
  map[i][j]--;

  if (dir === UP) {
    i--;
    if (map[i][j] === WALL) i = map.length - 2;
  } else if (dir === DOWN) {
    i++;
    if (map[i][j] === WALL) i = 1;
  } else if (dir === LEFT) {
    j--;
    if (map[i][j] === WALL) j = map[i].length - 2;
  } else if (dir === RIGHT) {
    j++;
    if (map[i][j] === WALL) j = 1;
  } else {
    console.error('wtf bro')
  }

  blizzard[0] = i;
  blizzard[1] = j;
  map[i][j]++;
}

const shift = (map, blizzards) => {
  for (const blizzard of blizzards) {
    moveBlizzard(map, blizzard);
  }
}

const getStateAfterN = (() => {
  const cache = {};

  return (map, blizzards, n) => {
    if (n === 0) return [map, blizzards];
    if (!has(cache, n)) {
      // console.log(`calculating for ${n}`)
      const [lastMap, lastBlizzards] = getStateAfterN(map, blizzards, n - 1);
      const clonedMap = cloneMatrix(lastMap);
      const clonedBlizzards = cloneMatrix(lastBlizzards);
      shift(clonedMap, clonedBlizzards);
      cache[n] = [clonedMap, clonedBlizzards];
    }
    return cache[n];
  }
})();

const solve = (_map, _blizzards, start, predicate) => {
  const queue = [start];

  const cache = new Set();

  while (queue.length) {
    const [i, j, counter] = queue.shift();
    const key = `${i}-${j}-${counter}`;
    if (!cache.has(key)) {
      if (predicate(i)) {
        return [counter, ...getStateAfterN(_map, _blizzards, counter)];
      }

      cache.add(key);
      const [map] = getStateAfterN(_map, _blizzards, counter + 1);

      if (!map[i][j]) queue.push([i, j, counter + 1]);
      if (i > 0 && !map[i - 1][j]) queue.push([i - 1, j, counter + 1]);
      if (i < map.length - 1 && !map[i + 1][j]) queue.push([i + 1, j, counter + 1]);
      if (!map[i][j - 1]) queue.push([i, j - 1, counter + 1]);
      if (!map[i][j + 1]) queue.push([i, j + 1, counter + 1]);
    }
  }
}

export default async function dayTwentyFour() {
  const map = (await getLines(URL)).map(line => line.split(''));
  const blizzards = [];
  map[0][1] = 0;
  map[map.length - 1][map[0].length - 2] = 0;
  for (let i = 1; i < map.length - 1; ++i) {
    for (let j = 1; j < map[i].length - 1; ++j) {
      if (map[i][j] !== OPEN) {
        blizzards.push([i, j, map[i][j]]);
        map[i][j] = 1;
      } else {
        map[i][j] = 0;
      }
    }
  }

  const [firstCounter, firstMap, firstBlizzards, ] = solve(
    map,
    blizzards,
    [0, 1, 0],
    i => i === map.length - 1,
  );
  console.log(firstCounter);
  const [secondCounter, secondMap, secondBlizzards] = solve(
    firstMap,
    firstBlizzards,
    [map.length - 1, map[0].length - 2, firstCounter],
    i => i === 0,
  );
  console.log(secondCounter);
  const [finalCounter, finalMap, finalBlizzards] = solve(
    secondMap,
    secondBlizzards,
    [0, 1, secondCounter],
    i => i === map.length - 1,
  );
  console.log(finalCounter);
}
