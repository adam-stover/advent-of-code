import { getLines, ints, diff, gcd, lcm, count, makeArray, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep } from '../utils.js';

let URL = './inputs/13.txt';
// URL = './inputs/t.txt';

const ASH = '.';
const ROCK = '#';

export async function dayThirteen() {
  const rows = await getLines(URL);
  const patterns = []
  let currentPattern = [];
  for (const row of rows) {
    if (row !== '') currentPattern.push(row);
    else {
      patterns.push(currentPattern);
      currentPattern = [];
    }
  }
  patterns.push(currentPattern);

  let symmetry = true;
  let res = 0;

  for (const pattern of patterns) {
    const m = pattern.length;
    const n = pattern[0].length;

    let patternTotal = 0;
    let vertSymmetry;
    let horiSymmetry;

    for (let i = 0; i < n - 1; i++) {
      let left = i;
      let right = i + 1;

      while (left >= 0 && right < n) {
        for (let rowIndex = 0; rowIndex < m; rowIndex++) {
          if (pattern[rowIndex][left] !== pattern[rowIndex][right]) {
            symmetry = false;
            break;
          }
        }
        left--;
        right++;
      }
      if (symmetry) {
        vertSymmetry = i + 1;
        // patternTotal += i + 1;
        break;
      }
      symmetry = true;
    }

    for (let i = 0; i < m - 1; i++) {
      let left = i;
      let right = i + 1;

      while (left >= 0 && right < m) {
        if (pattern[left] !== pattern[right]) {
          symmetry = false;
          break;
        }
        left--;
        right++;
      }
      if (symmetry) {
        horiSymmetry = i + 1;
        // patternTotal += (i + 1) * 100;
        break;
      }
      symmetry = true;
    }

    for (let a = 0; a < m; a++) {
      for (let b = 0; b < n; b++) {
        if (pattern[a][b] === ASH) pattern[a] = pattern[a].split('').map((cell, index) => index === b ? ROCK : cell).join('');
        else pattern[a] = pattern[a].split('').map((cell, index) => index === b ? ASH : cell).join('');

        for (let i = 0; i < n - 1; i++) {
          let left = i;
          let right = i + 1;

          while (left >= 0 && right < n) {
            for (let rowIndex = 0; rowIndex < m; rowIndex++) {
              if (pattern[rowIndex][left] !== pattern[rowIndex][right]) {
                symmetry = false;
                break;
              }
            }
            left--;
            right++;
          }
          if (symmetry && i + 1 !== vertSymmetry) {
            patternTotal += i + 1;
            break;
          }
          symmetry = true;
        }

        for (let i = 0; i < m - 1; i++) {
          let left = i;
          let right = i + 1;

          while (left >= 0 && right < m) {
            if (pattern[left] !== pattern[right]) {
              symmetry = false;
              break;
            }
            left--;
            right++;
          }
          if (symmetry && i + 1 !== horiSymmetry) {
            patternTotal += (i + 1) * 100;
            break;
          }
          symmetry = true;
        }

        if (pattern[a][b] === ASH) pattern[a] = pattern[a].split('').map((cell, index) => index === b ? ROCK : cell).join('');
        else pattern[a] = pattern[a].split('').map((cell, index) => index === b ? ASH : cell).join('');
        if (patternTotal > 0) break;
      }
      if (patternTotal > 0) break;
    }

    res += patternTotal;
  }

  console.log(res)
}

export default dayThirteen;
