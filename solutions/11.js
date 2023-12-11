import { getLines, ints, diff, gcd, lcm, count, makeArray, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex } from '../utils.js';

let URL = './inputs/11.txt';
// URL = './inputs/t.txt';

const SPACE = '.';
const GALAXY = '#';
const EXPAND = 999999;

export async function dayEleven() {
  const rows = (await getLines(URL)).map(row => row.split(''));
  // const expanded = cloneMatrix(rows);
  const m = rows.length;
  const n = rows[0].length;
  // let expandM = m;
  // let expandN = n;

  const expandedRowIndices = [];
  const expandedColumnIndices = [];
  const galaxies = [];
  let sum = 0;

  const checkColumn = (j) => {
    for (let i = 0; i < m; i++) {
      if (rows[i][j] === GALAXY) return false;
    }
    return true;
  }

  for (let i = 0; i < m; i++) {
    if (rows[i].every(cell => cell === SPACE)) expandedRowIndices.push(i)
  }

  for (let j = 0; j < n; j++) {
    if (checkColumn(j)) expandedColumnIndices.push(j);
  }

  // for (let j = expandedColumnIndices.length - 1; j >= 0; j--) {
  //   const index = expandedColumnIndices[j];
  //   for (let i = 0; i < m; i++) {
  //     expanded[i].splice(index, 0, ...makeArray(EXPAND, SPACE));
  //   }
  //   expandN++;
  // }

  // for (let i = expandedRowIndices.length - 1; i >= 0; i--) {
  //   const index = expandedRowIndices[i];
  //   expanded.splice(index, 0, ...makeArray(EXPAND, makeArray(expandN, SPACE)));
  //   expandM++;
  // }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (rows[i][j] === GALAXY) galaxies.push([i, j]);
    }
  }

  for (let i = 0; i < galaxies.length; i++) {
    const [ai, aj] = galaxies[i];

    for (let j = i + 1; j < galaxies.length; j++) {
      const [bi, bj] = galaxies[j];
      let expandedRows = 0;
      let expandedColumns = 0;
      const [minI, maxI] = minmax([ai, bi]);
      const [minJ, maxJ] = minmax([aj, bj]);
      let rowIndex = expandedRowIndices.findIndex(index => index > minI && index < maxI);
      let columnIndex = expandedColumnIndices.findIndex(index => index > minJ && index < maxJ);
      if (rowIndex !== -1) {
        while (rowIndex < expandedRowIndices.length && expandedRowIndices[rowIndex] > minI && expandedRowIndices[rowIndex] < maxI) {
          expandedRows++;
          rowIndex++;
        }
      }
      if (columnIndex !== -1) {
        while (columnIndex < expandedColumnIndices.length && expandedColumnIndices[columnIndex] > minJ && expandedColumnIndices[columnIndex] < maxJ) {
          expandedColumns++;
          columnIndex++;
        }
      }

      const distance = ((expandedRows * EXPAND + maxI) - minI) + ((expandedColumns * EXPAND + maxJ) - minJ);
      console.log(`Distance between galaxy ${i + 1} and ${j + 1} is ${distance}`);
      console.log(`${expandedRows} + ${maxI} - ${minI} || ${expandedColumns} + ${maxJ} - ${minJ}`)
      sum += distance;
    }
  }

  // for (const row of expanded) console.log(row.join(''));
  console.log(galaxies.length);
  console.log(sum);
  // 82000210 is too low (OBVIOUSLY I USED THE TEST INPUT UGH)
  // 731244261352 SHOULD BE RIGHT
  // 731244803362 is too high
}

export default dayEleven;
