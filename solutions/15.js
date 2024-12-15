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
      const line = lines[i].split('');
      map.push(line);
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

export async function run() {
  const lines = await getLines(URL);

  const [map, instructions] = prep(lines);
  const [startI, startJ] = getRobot(map);

  let [i, j] = [startI, startJ];

  const moveUp = () => {
    let tempI = i - 1;
    while (map[tempI][j] === BOX) {
      tempI--;
    }
    if (map[tempI][j] === AIR) {
      map[tempI][j] = map[i - 1][j];
      map[i - 1][j] = ROBOT;
      map[i][j] = AIR;
      i--;
    }
  }

  const moveDown = () => {
    let tempI = i + 1;
    while (map[tempI][j] === BOX) {
      tempI++;
    }
    if (map[tempI][j] === AIR) {
      map[tempI][j] = map[i + 1][j];
      map[i + 1][j] = ROBOT;
      map[i][j] = AIR;
      i++;
    }
  }

  const moveLeft = () => {
    let tempJ = j - 1;
    while (map[i][tempJ] === BOX) {
      tempJ--;
    }
    if (map[i][tempJ] === AIR) {
      map[i][tempJ] = map[i][j - 1];
      map[i][j - 1] = ROBOT;
      map[i][j] = AIR;
      j--;
    }
  }

  const moveRight = () => {
    let tempJ = j + 1;
    while (map[i][tempJ] === BOX) {
      tempJ++;
    }
    if (map[i][tempJ] === AIR) {
      map[i][tempJ] = map[i][j + 1];
      map[i][j + 1] = ROBOT;
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

  for (let m = 0; m < instructions.length; m++) {
    move(instructions[m]);
  }

  let sum = 0;

  for (let i = 1; i < map.length; i++) {
    for (let j = 1; j < map[0].length; j++) {
      if (map[i][j] === BOX) {
        sum += 100 * i + j;
      }
    }
  }

  for (const row of map) {
    log(row.join(''))
  }
  log(sum);
}

export default run;
