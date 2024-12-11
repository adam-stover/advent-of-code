import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log, diff } from '../utils.js';

let URL = './inputs/11.txt';
// URL = './inputs/t.txt';

export async function run() {
  const lines = await getLines(URL);
  const stones = ints(lines[0]);

  const transformStone = (stone) => {
    if (stone === 0) return [1];
    const str = `${stone}`;
    if (str.length % 2 === 0) {
      const half = str.length / 2;
      return [Number(str.slice(0, half)), Number(str.slice(half))];
    }

    return [stone * 2024];
  }

  const solve = (x, n) => {
    if (n === 1) return `${x}`.length % 2 === 0 ? 2 : 1;
    return transformStone(x).reduce((acc, cur) => acc + memo(cur, n - 1), 0);
  }

  const memo = (() => {
    const cache = {};

    return (x, n) => {
      const key = `${x}-${n}`
      if (!has(cache, key)) cache[key] = solve(x, n);
      return cache[key];
    }
  })();

  const BLINKS = 75;

  console.time('eyo')
  const res = stones.reduce((acc, cur) => acc + memo(cur, BLINKS), 0);
  console.timeEnd('eyo');
  log(res);
}

export default run;
