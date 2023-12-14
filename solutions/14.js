import { getLines, ints, diff, gcd, lcm, count, makeArray, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep } from '../utils.js';

let URL = './inputs/14.txt';
// URL = './inputs/t.txt';

const ROUND = 'O';
const CUBE = '#';
const AIR = '.';

export async function dayFourteen() {
  const map = (await getLines(URL)).map(row => row.split(''));
  const m = map.length;
  const n = map[0].length;

  const tiltNorth = () => {
    const highestThing = makeArray(n, -1);

    for (let i = 0; i < n; i++) {
      if (map[0][i] !== AIR) highestThing[i] = 0;
    }

    // Go through each row and move each rock as high as possible
    for (let i = 1; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (map[i][j] === ROUND) {
          highestThing[j] += 1;
          const row = highestThing[j];
          if (row !== i) {
            map[row][j] = ROUND;
            map[i][j] = AIR;
          }
        } else if (map[i][j] === CUBE) {
          highestThing[j] = i;
        }
      }
    }
  }

  const tiltWest = () => {
    const leftestThing = makeArray(m, -1);

    for (let i = 0; i < m; i++) {
      if (map[i][0] !== AIR) leftestThing[i] = 0;
    }

    // Go through each row and move each rock as left as possible
    for (let i = 0; i < m; i++) {
      for (let j = 1; j < n; j++) {
        if (map[i][j] === ROUND) {
          leftestThing[i] += 1;
          const row = leftestThing[i];
          if (row !== j) {
            map[i][row] = ROUND;
            map[i][j] = AIR;
          }
        } else if (map[i][j] === CUBE) {
          leftestThing[i] = j;
        }
      }
    }
  }

  const tiltSouth = () => {
    const lowestThing = makeArray(n, m);

    for (let i = 0; i < n; i++) {
      if (map[m - 1][i] !== AIR) lowestThing[i] -= 1;
    }

    // Go through each row and move each rock as low as possible
    for (let i = m - 2; i >= 0; i--) {
      for (let j = 0; j < n; j++) {
        if (map[i][j] === ROUND) {
          lowestThing[j] -= 1;
          const row = lowestThing[j];
          if (row !== i) {
            map[row][j] = ROUND;
            map[i][j] = AIR;
          }
        } else if (map[i][j] === CUBE) {
          lowestThing[j] = i;
        }
      }
    }
  }

  const tiltEast = () => {
    const righestThing = makeArray(m, n);

    for (let i = 0; i < m; i++) {
      if (map[i][n - 1] !== AIR) righestThing[i] -= 1;
    }

    // Go through each row and move each rock as right as possible
    for (let i = 0; i < m; i++) {
      for (let j = n - 2; j >= 0; j--) {
        if (map[i][j] === ROUND) {
          righestThing[i] -= 1;
          const row = righestThing[i];
          if (row !== j) {
            map[i][row] = ROUND;
            map[i][j] = AIR;
          }
        } else if (map[i][j] === CUBE) {
          righestThing[i] = j;
        }
      }
    }
  }

  const cycle = () => {
    tiltNorth();
    tiltWest();
    tiltSouth();
    tiltEast();
  }

  const REAL_COUNT = 1000000000;
  const COUNT = 1000;
  const cache = {};
  let res = 0;

  for (let i = 0; i < COUNT; i++) {
    const key = map.reduce((acc, cur) => `${acc}|${cur.join('')}`, '');
    if (!has(cache, key)) {
      cache[key] = [i];
    } else {
      cache[key].push(i);
      // console.log(`Repeat at ${cache[key]}`);
    }
    if (i && i % 1000000 === 0) {
      // for (const row of map) console.log(row.join(''));
      console.log(`${i} times`);
    }
    cycle();
  }

  const keys = Object.keys(cache).filter(key => cache[key].length > 1);
  const sampleValues = cache[keys[0]];
  const cycleLength = sampleValues[1] - sampleValues[0];
  const numWeWant = (REAL_COUNT - sampleValues[0]) % cycleLength + sampleValues[0];

  const chosenKey = keys.find(key => cache[key].includes(numWeWant))

  // console.log(cache[chosenKey]);

  const finalMap = chosenKey.split('|').slice(1);
  // for (const row of finalMap) console.log(row.join(''));

  for (let i = 0; i < finalMap.length; i++) {
    const multiplier = m - i;
    const num = count(finalMap[i], ROUND);
    res += num * multiplier;
  }

  console.log(res);
}

// 96848 is not right
// 98894 LET'S GO

export default dayFourteen;
