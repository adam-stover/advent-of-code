import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log, count, cloneMatrix } from '../utils.js';

let URL = './inputs/6.txt';
// URL = './inputs/t.txt';

const ROCK = '#';
const AIR = '.';
const GUARD = '^';
const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

const thing = {
  [UP]: [-1, 0],
  [RIGHT]: [0, 1],
  [DOWN]: [1, 0],
  [LEFT]: [0, -1],
};

const nextDir = {
  [UP]: RIGHT,
  [RIGHT]: DOWN,
  [DOWN]: LEFT,
  [LEFT]: UP,
};

export async function run() {
  const lines = await getLines(URL);
  const iLen = lines.length;
  const jLen = lines[0].length;

  const findGuard = () => {
    for (let i = 0; i < lines.length; i++) {
      for (let j = 0; j < lines.length; j++) {
        if (lines[i][j] === GUARD) return [i, j];
      }
    }
  }

  const move = (i, j, dir, loop = false) => {
    const [moveI, moveJ] = thing[dir];

    let curI = i;
    let curJ = j;

    let nextI = curI + moveI;
    let nextJ = curJ + moveJ;

    while (nextI >= 0 && nextI < iLen && nextJ >= 0 && nextJ < jLen && lines[nextI][nextJ] !== ROCK) {
      if (loop && loopable[nextDir[dir]][curI][curJ] && lines[nextI][nextJ] === AIR) {
        // log(`we got one at ${nextI}, ${nextJ}, we identified it while at ${curI}, ${curJ} moving ${dir}`)
        // if (stuckers[nextI][nextJ] === true) log('dup')
        stuckers[nextI][nextJ] = true;
      }

      curI = nextI;
      curJ = nextJ;

      nextI = curI + moveI;
      nextJ = curJ + moveJ;
    }

    if (lines[nextI]?.[nextJ] === ROCK) {
      // log(`we have hit a rock going ${dir} at ${nextI} ${nextJ}`)

      return {
        curI,
        curJ,
        finished: false,
      };
    }

    // log(`we are donezo: ${nextI} ${nextJ}`)
    return {
      curI,
      curJ,
      finished: true,
    };
  }

  const drawLoopingLine = (i, j, dir) => {
    if (dir === UP && j === 0) return;
    if (dir === RIGHT && i === 0) return;
    if (dir === DOWN && j === jLen - 1) return;
    if (dir === LEFT && i === iLen - 1) return;

    let reverse;
    if (dir === UP) reverse = DOWN;
    else if (dir === RIGHT) reverse = LEFT;
    else if (dir === DOWN) reverse = UP;
    else if (dir === LEFT) reverse = RIGHT;

    const [moveI, moveJ] = thing[reverse];
    let curI = i;
    let curJ = j;

    while (curI >= 0 && curI < iLen && curJ >= 0 && curJ < jLen && lines[curI][curJ] !== ROCK) {
      loopable[dir][curI][curJ] = true;
      curI += moveI;
      curJ += moveJ;
    }
  }

  const execute = (startI, startJ, loop = false) => {
    let [i, j] = [startI, startJ];
    let dir = UP;

    while (true) {
      const {
        curI,
        curJ,
        finished,
      } = move(i, j, dir, !loop);

      if (finished) return;

      // OK so we hit a rock. now let's draw the loopable line backwards.
      if (loop) drawLoopingLine(curI, curJ, dir);

      i = curI;
      j = curJ;
      dir = nextDir[dir];
    }
  }

  const stuckers = makeMatrix(jLen, iLen, false);
  const loopable = [
    makeMatrix(jLen, iLen, false),
    makeMatrix(jLen, iLen, false),
    makeMatrix(jLen, iLen, false),
    makeMatrix(jLen, iLen, false),
  ];

  const [startI, startJ] = findGuard();

  // execute(startI, startJ, true);
  // execute(startI, startJ);

  const candidates = [];

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines.length; j++) {
      if (lines[i][j] === AIR) candidates.push([i, j]);
      // if (stuckers[i][j]) candidates.push([i, j]);
    }
  }

  const testLoop = (startI, startJ, candidateI, candidateJ) => {
    const visited = [
      makeMatrix(jLen, iLen, false),
      makeMatrix(jLen, iLen, false),
      makeMatrix(jLen, iLen, false),
      makeMatrix(jLen, iLen, false),
    ];

    let [i, j] = [startI, startJ];
    let dir = UP;

    const testLines = cloneMatrix(lines.map(x => x.split('')));
    testLines[candidateI][candidateJ] = ROCK;

    const testMove = (i, j, dir) => {
      const [moveI, moveJ] = thing[dir];

      let curI = i;
      let curJ = j;

      let nextI = curI + moveI;
      let nextJ = curJ + moveJ;

      while (nextI >= 0 && nextI < iLen && nextJ >= 0 && nextJ < jLen && testLines[nextI][nextJ] !== ROCK) {
        if (visited[dir][curI][curJ]) {
          // log('we loop');
          return { loop: true };
        }
        visited[dir][curI][curJ] = true;

        curI = nextI;
        curJ = nextJ;

        nextI = curI + moveI;
        nextJ = curJ + moveJ;
      }

      if (testLines[nextI]?.[nextJ] === ROCK) {
        return {
          curI,
          curJ,
          finished: false,
          loop: false,
        };
      }

      // log('we escaped');

      return {
        curI,
        curJ,
        finished: true,
        loop: false,
      };
    }

    while (true) {
      const {
        curI,
        curJ,
        finished,
        loop
      } = testMove(i, j, dir);

      if (loop) return true;
      if (finished) return false;

      i = curI;
      j = curJ;
      dir = nextDir[dir];
    }
  }

  log(candidates.length)

  const numLoops = candidates.reduce((acc, [i, j]) => acc + testLoop(startI, startJ, i, j), 0);
  log(numLoops);

  // const totalStuckers = stuckers.reduce((total, cur) => total + count(cur, true), 0);

  // const map = lines.map(x => x.split(''));

  // for (let i = 0; i < stuckers.length; i++) {
  //   for (let j = 0; j < stuckers[0].length; j++) {
  //     if (stuckers[i][j]) map[i][j] = 'O';
  //   }
  // }

  // log(map.map(x => x.join('')));
  // log(totalStuckers);

  // 423 is too low
  // 425 is too low
  // 426 is not right
  // 603 is not right
  // 776 is not right

  // log(totalSteps);
}

export default run;
