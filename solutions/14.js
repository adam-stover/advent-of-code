import { getLines, ints } from '../utils.js';

const URL = './inputs/14.txt';

const AIR = '.';
const ROCK = '#';
const SOURCE = '+';
const SAND = 'o';

const getStartingGrid = (lines) => {
  let leftBound = Infinity;
  let rightBound = 0;
  let bottomBound = 0;

  const rocks = lines.map(ints);

  for (const rock of rocks) {
    for (let j = 0; j < rock.length; j += 2) {
      if (rock[j] < leftBound) leftBound = rock[j];
      if (rock[j] > rightBound) rightBound = rock[j];
      if (rock[j + 1] > bottomBound) bottomBound = rock[j + 1];
    }
  }

  console.log(`left: ${leftBound}, right: ${rightBound}, bottom: ${bottomBound}`);

  const width = (1 + rightBound) * 2;
  const height = 3 + bottomBound;
  const grid = [];

  for (let i = 0; i < height; ++i) {
    const row = [];
    for (let j = 0; j < width; ++j) {
      if (i === height - 1) row.push(ROCK);
      else row.push(AIR);
    }
    grid.push(row);
  }

  grid[0][500] = SOURCE;

  for (const rock of rocks) {
    let y = rock[1];
    let x = rock[0];

    grid[y][x] = ROCK;

    for (let i = 2; i < rock.length; i += 2) {
      const targetX = rock[i];
      const targetY = rock[i + 1];

      while (x < targetX) {
        grid[y][++x] = ROCK;
      }

      while (x > targetX) {
        grid[y][--x] = ROCK;
      }

      while (y < targetY) {
        grid[++y][x] = ROCK;
      }

      while (y > targetY) {
        grid[--y][x] = ROCK;
      }
    }
  }

  return grid;
}

const dropSand = (grid) => {
  let x = 500;
  let y = 0;

  if (grid[y + 1][x] !== AIR && grid[y + 1][x - 1] !== AIR && grid[y + 1][x + 1] !== AIR) return false;

  while (grid[y + 1][x] === AIR || grid[y + 1][x - 1] === AIR || grid[y + 1][x + 1] === AIR) {
    if (grid[y + 1][x] === AIR) {
      y++;
    } else if (grid[y + 1][x - 1] === AIR) {
      y++;
      x--;
    } else if (grid[y + 1][x + 1] === AIR) {
      y++;
      x++;
    }
  }

  grid[y][x] = SAND;
  return true;
}

export default async function dayFourteen() {
  const lines = await getLines(URL);

  const grid = getStartingGrid(lines);

  let counter = 1;

  while (dropSand(grid)) {
    counter++;
  }

  console.log(counter);
}
