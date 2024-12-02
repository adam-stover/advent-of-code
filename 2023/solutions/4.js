import { getLines, ints, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, max, min, minmax, findLastIndex } from '../utils.js';

const URL = './inputs/4.txt';

export async function dayFour() {
  const lines = await getLines(URL);

  // let sum = 0;

  // for (const line of lines) {
  //   const [winning, have] = line.split(':')[1].split('|').map(ints);

  //   let count = 0;

  //   for (const card of have) {
  //     if (winning.includes(card)) count++;
  //   }

  //   if (count > 0) {
  //     sum += 2 ** (count - 1);
  //   }

  // }

  // console.log(sum);

  const multipliers = (new Array(lines.length)).fill(1);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [first, second] = line.split(':');

    const [winning, have] = second.split('|').map(ints);

    let count = 0;
    for (const card of have) {
      if (winning.includes(card)) count++;
    }

    for (let j = 1; j <= count && i + j < lines.length; j++) {
      multipliers[i + j] += multipliers[i];
    }
  }

  const total = multipliers.reduce((acc, cur) => acc + cur);

  console.log(total);
}

export default dayFour;
