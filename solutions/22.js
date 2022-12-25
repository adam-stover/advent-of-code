import { findLastIndex, getLines, ints } from '../utils.js';

const URL = './inputs/22.txt';

const OPEN = '.';
const WALL = '#';
const RIGHT = 0;
const DOWN = 1;
const LEFT = 2;
const UP = 3;

const turn = (currentDir, turnDir) => {
  if (turnDir === 'R') return (currentDir + 1) % 4;
  return currentDir - 1 < 0 ? UP : currentDir - 1;
}

export default async function dayTwentyTwo() {
  const lines = await getLines(URL);
  const map = lines.slice(0, -2).map(str => str.split(''));
  const instructions = lines[lines.length - 1];
  const units = ints(instructions);
  const turns = instructions.match(/[LR]/g);

  let y = 0;
  let x = map[0].indexOf(OPEN);
  let direction = RIGHT;

  for (let i = 0; i < units.length; ++i) {
    let count = units[i];

    while (count > 0) {
      // console.log(`row ${y} column ${x} position ${map[y][x]}`);
      let prospectiveY = y;
      let prospectiveX = x;
      if (direction === RIGHT) prospectiveX++;
      else if (direction === DOWN) prospectiveY++;
      else if (direction === LEFT) prospectiveX--;
      else if (direction === UP) prospectiveY--;

      let nextStep = map[prospectiveY]?.[prospectiveX];

      if (!nextStep || nextStep === ' ') {
        if (direction === RIGHT) {
          prospectiveX = map[y].findIndex(v => v === OPEN || v === WALL);
        } else if (direction === DOWN) {
          prospectiveY = map.findIndex(row => row[prospectiveX] === OPEN || row[prospectiveX] === WALL);
        } else if (direction === LEFT) {
          prospectiveX = findLastIndex(map[y], v => v === OPEN || v === WALL);
        } else {
          prospectiveY = findLastIndex(map, row => row[prospectiveX] === OPEN || row[prospectiveX] === WALL);
        }

        nextStep = map[prospectiveY][prospectiveX];
      }

      if (nextStep === WALL) {
        break;
      }

      x = prospectiveX;
      y = prospectiveY;
      count--;
    }

    direction = turns[i] ? turn(direction, turns[i]) : direction;
  }

  const row = y + 1;
  const column = x + 1;
  console.log(`row: ${row}; column: ${column}; direction: ${direction}`);
  console.log(1000 * row + 4 * column + direction);
}
