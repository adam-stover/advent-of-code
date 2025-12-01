import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/14.txt';
// URL = './inputs/t.txt';

const AIR = '.';
let HEIGHT = 103;
let WIDTH = 101;
// HEIGHT = 7;
// WIDTH = 11;

const TOTAL_TIME = 100;
const NORTHWEST = 0;
const NORTHEAST = 1;
const SOUTHEAST = 2;
const SOUTHWEST = 3;
const MIDDLE = 4;

export async function run() {
  const lines = await getLines(URL);

  const robots = [];

  for (let i = 0; i < lines.length; i++) {
    const [px, py, vx, vy] = ints(lines[i]);
    const robot = {
      i,
      start_position: { x: px, y: py },
      p: { x: px, y: py },
      v: { x: vx, y: vy },
    };
    robots.push(robot);
  }

  const tickRobot = (robot) => {
    robot.p.x = (robot.p.x + robot.v.x) % WIDTH;
    if (robot.p.x < 0) robot.p.x = WIDTH + robot.p.x;
    robot.p.y = (robot.p.y + robot.v.y) % HEIGHT;
    if (robot.p.y < 0) robot.p.y = HEIGHT + robot.p.y;
  }

  const tick = () => {
    for (let i = 0; i < robots.length; i++) {
      tickRobot(robots[i]);
    }
  }

  const getRobotQuadrant = (robot) => {
    const middleX = Math.floor(WIDTH / 2);
    const middleY = Math.floor(HEIGHT / 2);

    if (robot.p.x === middleX || robot.p.y === middleY) return MIDDLE;
    if (robot.p.x < middleX) {
      if (robot.p.y < middleY) return NORTHWEST;
      return SOUTHWEST;
    }
    if (robot.p.y < middleY) return NORTHEAST;
    return SOUTHEAST;
  }

  const getScore = () => {
    let topLeft = 0;
    let topRight = 0;
    let bottomLeft = 0;
    let bottomRight = 0;
    let middles = 0;

    for (let i = 0; i < robots.length; i++) {
      const quadrant = getRobotQuadrant(robots[i]);

      if (quadrant === NORTHWEST) topLeft++;
      else if (quadrant === NORTHEAST) topRight++;
      else if (quadrant === SOUTHEAST) bottomRight++;
      else if (quadrant === SOUTHWEST) bottomLeft++;
      else middles++;
    }

    log(`${topLeft}, ${topRight}, ${bottomLeft}, ${bottomRight}, ${middles}`)
    return topLeft * topRight * bottomLeft * bottomRight;
  }

  const draw = () => {
    const positions = {};
    for (const robot of robots) {
      const key = `${robot.p.x}-${robot.p.y}`;
      if (!has(positions, key)) positions[key] = 1;
      else positions[key]++;
    }

    let touches = 0;
    let lastCellRobot = false;
    const rows = [];

    for (let y = 0; y < HEIGHT; y++) {
      const row = [];
      for (let x = 0; x < WIDTH; x++) {
        const key = `${x}-${y}`;
        if (positions[key]) {
          if (lastCellRobot) touches++;
          else lastCellRobot = true;
          row.push(positions[key]);
        }
        else {
          row.push(AIR);
          lastCellRobot = false;
        }
      }
      rows.push(row);
    }
    // log(touches);
    if (touches > 75) {
      rows.forEach(row => log(row.join('')))
      return true;
    }
    return false;
  }

  for (let i = 1; i < 10000; i++) {
    tick();
    // log(`${i}log('----------------------------------------')`)
    if (draw()) log(i);
  }

  // log(robots.map(r => `x: ${r.p.x}, y: ${r.p.y}`));
  // log(score);
  // 7815 is not right
  // 7816 is not right
}

export default run;
