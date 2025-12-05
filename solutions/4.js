import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/4.txt';
// URL = './inputs/t.txt';

const PAPER = '@';
const AIR = '.';

export async function run() {
  let lines = await getLines(URL);
  const HEIGHT = lines.length;
  const WIDTH = lines[0].length;

  let count = 0;

  const countAdjacent = (i, j) => {
    let num = 0;
    if (i !== 0) {
      if (j !== 0 && lines[i - 1][j - 1] === PAPER) num++;
      if (lines[i - 1][j] === PAPER) num++;
      if (j < WIDTH && lines[i - 1][j + 1] === PAPER) num++;
    }
    if (j !== 0 && lines[i][j - 1] === PAPER) num++;
    if (j < WIDTH && lines[i][j + 1] === PAPER) num++;
    if (i < HEIGHT - 1) {
      if (j !== 0 && lines[i + 1][j - 1] === PAPER) num++;
      if (lines[i + 1][j] === PAPER) num++;
      if (j < WIDTH & lines[i + 1][j + 1] === PAPER) num++;
    }

    return num;
  }

  let temp = 0;
  do {
    temp = 0;
    const next = [];
    for (let i = 0; i < lines.length; i++) {
      const row = [];
      for (let j = 0; j < WIDTH; j++) {
        if (lines[i][j] === PAPER && countAdjacent(i, j) < 4) {
          temp++;
          row.push('x');
        } else {
          row.push(lines[i][j]);
        }
      }
      next.push(row);
    }
    count += temp;
    lines = next;
  } while (temp !== 0)

  log(count);
}

export default run;

