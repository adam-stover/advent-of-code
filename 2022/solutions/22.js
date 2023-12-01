import { findLastIndex, getLines, ints } from '../utils.js';

const URL = './inputs/22.txt';
const CUBE_SIZE = 50;

const OPEN = '.';
const WALL = '#';
const RIGHT = 0;
const DOWN = 1;
const LEFT = 2;
const UP = 3;

const CUBE_TOP = 0;
const CUBE_BACK = 1;
const CUBE_LEFT = 2;
const CUBE_FRONT = 3;
const CUBE_BOTTOM = 4;
const CUBE_RIGHT = 5;

const DIR_NAMES = {
  [RIGHT]: 'right',
  [DOWN]: 'down',
  [LEFT]: 'left',
  [UP]: 'up',
};

const CUBE_NAMES = {
  [CUBE_TOP]: 'top',
  [CUBE_BACK]: 'back',
  [CUBE_LEFT]: 'left',
  [CUBE_FRONT]: 'front',
  [CUBE_BOTTOM]: 'bottom',
  [CUBE_RIGHT]: 'right',
};

const CUBE_COORDS = {
  [CUBE_TOP]: [1, 1],
  [CUBE_BACK]: [0, 1],
  [CUBE_LEFT]: [2, 0],
  [CUBE_FRONT]: [2, 1],
  [CUBE_BOTTOM]: [3, 0],
  [CUBE_RIGHT]: [0, 2],
};

const getCubeSide = (y, x) => {
  const yPos = Math.floor(y / CUBE_SIZE);
  const xPos = Math.floor(x / CUBE_SIZE);
  return Number(Object.keys(CUBE_COORDS).find(key => CUBE_COORDS[key][0] === yPos && CUBE_COORDS[key][1] === xPos));
}

/*
     0 1  2 3
     4 5  6 7
     8 9
     0 1
2 3  4 5
6 7  8 9
0 1
2 3
*/

const EXITS = {
  [CUBE_TOP]: {
    [RIGHT]: [CUBE_RIGHT, UP],  // true, false
    [DOWN]: [CUBE_FRONT, DOWN], // false, false
    [LEFT]: [CUBE_LEFT, DOWN],  // true, false
    [UP]: [CUBE_BACK, UP],      // false, false
  },
  [CUBE_BACK]: {
    [RIGHT]: [CUBE_RIGHT, RIGHT], // false, false
    [DOWN]: [CUBE_TOP, DOWN],   // false, false
    [LEFT]: [CUBE_LEFT, RIGHT], // false, true
    [UP]: [CUBE_BOTTOM, RIGHT], // true, false
  },
  [CUBE_LEFT]: {
    [RIGHT]: [CUBE_FRONT, RIGHT], // false, false
    [DOWN]: [CUBE_BOTTOM, DOWN],  // false, false
    [LEFT]: [CUBE_BACK, RIGHT],   // false, true
    [UP]: [CUBE_TOP, RIGHT],      // true, false
  },
  [CUBE_FRONT]: {
    [RIGHT]: [CUBE_RIGHT, LEFT],  // false, true
    [DOWN]: [CUBE_BOTTOM, LEFT],  // true, false
    [LEFT]: [CUBE_LEFT, LEFT],    // false, false
    [UP]: [CUBE_TOP, UP],         // false, false
  },
  [CUBE_BOTTOM]: {
    [RIGHT]: [CUBE_FRONT, UP],    // true, false
    [DOWN]: [CUBE_RIGHT, DOWN],   // false, false
    [LEFT]: [CUBE_BACK, DOWN],    // true, false
    [UP]: [CUBE_LEFT, UP],        // false, false
  },
  [CUBE_RIGHT]: {
    [RIGHT]: [CUBE_FRONT, LEFT],   // false, true
    [DOWN]: [CUBE_TOP, LEFT],      // true, false
    [LEFT]: [CUBE_BACK, LEFT],     // false, false
    [UP]: [CUBE_BOTTOM, UP],       // false, false
  },
};

/*
     0 1  2 3
     4 5  6 7
     8 9
     0 1
2 3  4 5
6 7  8 9
0 1
2 3
*/

const getTransformation = (prevFace, nextFace) => {
  switch (prevFace) {
    case CUBE_TOP:
      switch (nextFace) {
        case CUBE_RIGHT:
          return [true, false];
        case CUBE_FRONT:
          return [false, false];
        case CUBE_LEFT:
          return [true, false];
        case CUBE_BACK:
          return [false, false];
        default:
          console.error('wtf');
      }
    case CUBE_BACK:
      switch (nextFace) {
        case CUBE_RIGHT:
          return [false, false];
        case CUBE_TOP:
          return [false, false];
        case CUBE_LEFT:
          return [false, true];
        case CUBE_BOTTOM:
          return [true, false];
      }
    case CUBE_LEFT:
      switch (nextFace) {
        case CUBE_FRONT:
          return [false, false];
        case CUBE_BOTTOM:
          return [false, false];
        case CUBE_BACK:
          return [false, true];
        case CUBE_TOP:
          return [true, false];
      }
    case CUBE_FRONT:
      switch (nextFace) {
        case CUBE_RIGHT:
          return [false, true];
        case CUBE_BOTTOM:
          return [true, false];
        case CUBE_LEFT:
          return [false, false];
        case CUBE_TOP:
          return [false, false];
      }
    case CUBE_BOTTOM:
      switch (nextFace) {
        case CUBE_FRONT:
          return [true, false];
        case CUBE_RIGHT:
          return [false, false];
        case CUBE_BACK:
          return [true, false];
        case CUBE_LEFT:
          return [false, false];
      }
    case CUBE_RIGHT:
      switch (nextFace) {
        case CUBE_FRONT:
          return [false, true];
        case CUBE_TOP:
          return [true, false];
        case CUBE_BACK:
          return [false, false];
        case CUBE_BOTTOM:
          return [false, false];
      }
    default:
      console.error('fuck this hsit')
  }
}

const getNextSide = (current, direction) => {
  return EXITS[current][direction];
}

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
  // for (let i = 0; i < 10; ++i) {
    let count = units[i];

    while (count > 0) {
      // console.log(`row ${y} column ${x} position ${map[y][x]} moving ${DIR_NAMES[direction]}`);
      let prospectiveY = y;
      let prospectiveX = x;
      if (direction === RIGHT) prospectiveX++;
      else if (direction === DOWN) prospectiveY++;
      else if (direction === LEFT) prospectiveX--;
      else if (direction === UP) prospectiveY--;

      let nextStep = map[prospectiveY]?.[prospectiveX];
      let prospectiveDirection = direction;
      const currentCube = getCubeSide(y, x);
      const [nextCube, nextDirection] = getNextSide(currentCube, direction);

      if (!nextStep || nextStep === ' ') {
        let prevRelativeY = y % CUBE_SIZE;
        let prevRelativeX = x % CUBE_SIZE;
        // console.log(`relative y: ${prevRelativeY}; relative x: ${prevRelativeX}`)
        let relativeY;
        let relativeX;
        const [transforms, inverts] = getTransformation(currentCube, nextCube);

        if (nextDirection === DOWN) {
          relativeY = 0;
          relativeX = transforms ? prevRelativeY : prevRelativeX;
          if (inverts) relativeX = CUBE_SIZE - 1 - relativeX;
        } else if (nextDirection === UP) {
          relativeY = CUBE_SIZE - 1;
          relativeX = transforms ? prevRelativeY : prevRelativeX;
          if (inverts) relativeX = CUBE_SIZE - 1 - relativeX;
        } else if (nextDirection === RIGHT) {
          relativeX = 0;
          relativeY = transforms ? prevRelativeX : prevRelativeY;
          if (inverts) relativeY = CUBE_SIZE - 1 - relativeY;
        } else {
          relativeX = CUBE_SIZE - 1;
          relativeY = transforms ? prevRelativeX : prevRelativeY;
          if (inverts) relativeY = CUBE_SIZE - 1 - relativeY;
        }

        // console.log(`relative y: ${relativeY}; relative x: ${relativeX}`)

        prospectiveY = relativeY + CUBE_SIZE * CUBE_COORDS[nextCube][0];
        prospectiveX = relativeX + CUBE_SIZE * CUBE_COORDS[nextCube][1];
        prospectiveDirection = nextDirection;

        nextStep = map[prospectiveY][prospectiveX];
      }

      if (nextStep === WALL) {
        // console.log('hit wall');
        break;
      }

      // console.log(`moving from ${CUBE_NAMES[currentCube]} to ${CUBE_NAMES[nextCube]}: ${prospectiveY}, ${prospectiveX}, ${DIR_NAMES[prospectiveDirection]}`)

      x = prospectiveX;
      y = prospectiveY;
      direction = prospectiveDirection;
      count--;
    }

    direction = turns[i] ? turn(direction, turns[i]) : direction;
  }

  const row = y + 1;
  const column = x + 1;
  console.log(`row: ${row}; column: ${column}; direction: ${direction}`);
  console.log(1000 * row + 4 * column + direction);
}
