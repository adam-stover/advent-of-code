import { getLines, ints, cloneObj, filterMap, rangeUnion, has, max, min, minmax, findLastIndex, copyExcept, log, makeMatrix } from '../utils.js';

let URL = './inputs/4.txt';
// URL = './inputs/t.txt';

const XMAS = 'XMAS';
const SAMX = 'SAMX';

const countStr = (line, str) => {
  let index = line.indexOf(str);

  if (index === -1) return 0;

  let count = 0;

  while (index >= 0 && index < line.length - 1) {
    count++;
    index = line.indexOf(str, index + 1);
  }

  return count;
}

const getSidewaysCount = (lines) => {
  let count = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    count += countStr(line, XMAS);
    count += countStr(line, SAMX);
  }

  return count;
}

const rotateMatrix = (matrix) => {
  const rotated = makeMatrix(
    matrix.length,
    matrix[0].length,
    (i, j) => matrix[j][i],
  );

  return rotated;
}

const diagonalizeMatrix = (matrix, limit = 4) => {
  const diagonals = [];
  const iLen = matrix.length;
  const jLen = matrix[0].length;

  for (let j = jLen - limit; j >= 0; j--) {
    const diag = [];

    for (let k = j; k < jLen; k++) {
      const i = k - j;

      log(`pushing ${i} ${k}: ${matrix[i][k]}`)
      diag.push(matrix[i][k]);
    }

    diagonals.push(diag);
  }

  // make sure not to hit 0
  for (let i = 1; i < iLen; i++) {
    const diag = [];

    for (let k = i; k < iLen; k++) {
      const j = k - i;

      diag.push(matrix[k][j]);
    }

    diagonals.push(diag);
  }

  for (let i = limit - 1; i < iLen; i++) {
    const diag = [];

    for (let k = i; k >= 0; k--) {
      const j = i - k;

      diag.push(matrix[k][j]);
    }

    diagonals.push(diag);
  }

  // make sure not to hit 0
  for (let j = 1; j <= jLen - limit; j++) {
    const diag = [];

    for (let k = j; k < jLen; k++) {
      const i = iLen - (k - j) - 1;

      diag.push(matrix[i][k]);
    }

    diagonals.push(diag);
  }

  return diagonals;
}

const validateOpps = (a, b) => {
  if (a === 'M' && b === 'S') return true;

  if (a === 'S' && b === 'M') return true;

  return false;
}

export async function dayFour() {
  const lines = await getLines(URL);

  const isXmas = (i, j) => {
    if (lines[i][j] !== 'A') return false;

    // if (i === 1 && j === 2) {
    //   log('here')
    // }

    const topLeft = lines[i-1][j-1];
    const bottomRight = lines[i+1][j+1];
    const topRight = lines[i - 1][j+1];
    const bottomLeft = lines[i+1][j-1];

    if (validateOpps(topLeft, bottomRight) && validateOpps(topRight, bottomLeft)) return true;
  }

  // const sidewaysCount = getSidewaysCount(lines);
  // const rotated = rotateMatrix(lines).map(x => x.join(''));
  // const verticalCount = getSidewaysCount(rotated);
  // const diags = diagonalizeMatrix(lines).map(x => x.join(''));
  // log(diags.length)
  // log(diags);
  // const diagCount = getSidewaysCount(diags);
  // log(sidewaysCount)
  // log(verticalCount)
  // log(diagCount)

  // log(sidewaysCount + verticalCount + diagCount);

  let count = 0;

  for (let i = 1; i < lines.length - 1; i++) {
    for (let j = 1; j < lines[0].length - 1; j++) {
      if (isXmas(i, j)) {
        // log(`${i} and ${j}`)
        count++;
      }
    }
  }

  log(count);

  // 1227 is not right
}

export default dayFour;
