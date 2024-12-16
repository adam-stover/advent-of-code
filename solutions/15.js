import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/15.txt';
// URL = './inputs/t.txt';

const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;

const BOX = 'O';
const ROBOT = '@';
const WALL = '#';
const AIR = '.';
const LEFT_BOX = '[';
const RIGHT_BOX = ']';
const BOXES = [LEFT_BOX, RIGHT_BOX];

const UP = '^';
const DOWN = 'v';
const LEFT = '<';
const RIGHT = '>';

const prep = (lines) => {
  const map = [];
  const instructions = [];
  let finishedWithMap = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === '') finishedWithMap = true;
    else if (!finishedWithMap) {
      const row = [];
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        if (char === WALL) {
          row.push(WALL);
          row.push(WALL);
        } else if (char === BOX) {
          row.push(LEFT_BOX);
          row.push(RIGHT_BOX);
        } else if (char === AIR) {
          row.push(AIR);
          row.push(AIR);
        } else if (char === ROBOT) {
          row.push(ROBOT);
          row.push(AIR);
        }
      }
      map.push(row);
    } else instructions.push(lines[i]);
  }

  return [map, instructions.join('')];
}

const getRobot = (map) => {
  const jLen = map[0].length;
  for (let i = 1; i < map.length; i++) {
    for (let j = 1; j < jLen; j++) {
      if (map[i][j] === ROBOT) return [i, j];
    }
  }
}

const isBox = (el) => BOXES.includes(el);

export async function run() {
  const lines = await getLines(URL);

  const [map, instructions] = prep(lines);
  const [startI, startJ] = getRobot(map);

  let [i, j] = [startI, startJ];

  const moveUpHelp = (i, j) => {
    if (map[i - 1][j] === AIR) {
      return true;
    }
    if (map[i - 1][j] === WALL) {
      return false;
    }
    if (map[i - 1][j] === LEFT_BOX) {
      return moveUpHelp(i - 1, j) && moveUpHelp(i - 1, j + 1);
    }
    return moveUpHelp(i - 1, j) && moveUpHelp(i - 1, j - 1);
  }

  const moveUpRecursive = (i, j) => {
    if (map[i - 1][j] === WALL) return;
    if (map[i - 1][j] === LEFT_BOX) {
      moveUpRecursive(i - 1, j);
      moveUpRecursive(i - 1, j + 1);
    } else if (map[i - 1][j] === RIGHT_BOX) {
      moveUpRecursive(i - 1, j);
      moveUpRecursive(i - 1, j - 1);
    }
    // log(`moving ${map[i][j]} into ${map[i - 1][j]} at ${i}, ${j}`)
    map[i - 1][j] = map[i][j];
    map[i][j] = AIR;
  }

  const moveUp = () => {
    if (moveUpHelp(i, j)) {
      moveUpRecursive(i, j);
      i--;
    }
  }

  const moveDownHelp = (i, j) => {
    if (map[i + 1][j] === AIR) {
      return true;
    }
    if (map[i + 1][j] === WALL) {
      return false;
    }
    if (map[i + 1][j] === LEFT_BOX) {
      return moveDownHelp(i + 1, j) && moveDownHelp(i + 1, j + 1);
    }
    return moveDownHelp(i + 1, j) && moveDownHelp(i + 1, j - 1);
  }

  const moveDownRecursive = (i, j) => {
    if (map[i + 1][j] === WALL) return;
    if (map[i + 1][j] === LEFT_BOX) {
      moveDownRecursive(i + 1, j);
      moveDownRecursive(i + 1, j + 1);
    } else if (map[i + 1][j] === RIGHT_BOX) {
      moveDownRecursive(i + 1, j);
      moveDownRecursive(i + 1, j - 1);
    }
    map[i + 1][j] = map[i][j];
    map[i][j] = AIR;
  }

  const moveDown = () => {
    if (moveDownHelp(i, j)) {
      moveDownRecursive(i, j);
      i++;
    }
  }

  const moveLeft = () => {
    let tempJ = j - 1;
    while (isBox(map[i][tempJ])) {
      tempJ--;
    }
    if (map[i][tempJ] === AIR) {
      while (tempJ < j) {
        map[i][tempJ] = map[i][tempJ + 1];
        tempJ++;
      }
      map[i][j] = AIR;
      j--;
    }
  }

  const moveRight = () => {
    let tempJ = j + 1;
    while (isBox(map[i][tempJ])) {
      tempJ++;
    }
    if (map[i][tempJ] === AIR) {
      while (tempJ > j) {
        map[i][tempJ] = map[i][tempJ - 1];
        tempJ--;
      }
      map[i][j] = AIR;
      j++
    }
  }

  const move = (dir) => {
    if (dir === UP) moveUp();
    else if (dir === RIGHT) moveRight();
    else if (dir === DOWN) moveDown();
    else if (dir === LEFT) moveLeft();
  }

  console.time('eyo');
  for (let m = 0; m < instructions.length; m++) {
    move(instructions[m]);
    // log(instructions[m])
    // for (const row of map) {
    //   log(row.join(''))
    // }
  }

  let sum = 0;

  for (let i = 1; i < map.length; i++) {
    for (let j = 1; j < map[0].length; j++) {
      if (map[i][j] === LEFT_BOX) {
        sum += 100 * i + j;
      }
    }
  }

  console.timeEnd('eyo');

  // for (const row of map) {
  //   log(row.join(''))
  // }
  log(sum);
}

export default run;
