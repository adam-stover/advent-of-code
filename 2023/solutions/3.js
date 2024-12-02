import { getLines, ints, cloneObj, filterMap, rangeUnion, has, max, min, minmax, findLastIndex } from '../utils.js';

const URL = './inputs/3.txt';

const symbolSet = new Set();

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const nonSymbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const symbols = [
  '%', '*', '#', '&',
  '$', '@', '/', '=',
  '+', '-'
];

export async function dayThree() {
  const lines = await getLines(URL);

  const isAdjacent = (i, start, end) => {
    if (start !== 0 && symbols.includes(lines[i][start - 1])) return true;
    if (symbols.includes(lines[i][end])) return true;
    if (i !== 0) {
      for (let j = start - 1; j <= end; j++) {
        if (symbols.includes(lines[i - 1][j])) return true;
      }
    }
    if (i !== lines.length - 1) {
      for (let j = start - 1; j <= end; j++) {
        if (symbols.includes(lines[i + 1][j])) return true;
      }
    }
    return false;
  }

  // const partNumbers = [];

  // for (let i = 0; i < lines.length; i++) {
  //   let j = 0;

  //   while (j < lines[i].length) {
  //     if (numbers.includes(lines[i][j])) {
  //       const numberStart = j++;
  //       while (numbers.includes(lines[i][j])) {
  //         j++;
  //       }

  //       if (isAdjacent(i, numberStart, j)) partNumbers.push(Number(lines[i].slice(numberStart, j)));
  //     }

  //     j++;
  //   }
  // }

  // const sum = partNumbers.reduce((acc, cur) => acc + cur, 0);

  const gearNumbers = [];

  const getNumber = (i, j) => {
    let numberStart = j - 1;
    let numberEnd = j;
    while (numbers.includes(lines[i][numberStart])) {
      numberStart--;
    }
    numberStart++;
    while (numbers.includes(lines[i][numberEnd])) {
      numberEnd++;
    }
    return Number(lines[i].slice(numberStart, numberEnd));
  }

  const getGearProduct = (i, j) => {
    const things = [];
    if (numbers.includes(lines[i][j - 1])) {
      let numberEnd = j;
      let numberStart = j - 2;
      while (numbers.includes(lines[i][numberStart])) {
        numberStart--;
      }
      numberStart++;
      things.push(Number(lines[i].slice(numberStart, numberEnd)))
    }
    if (numbers.includes(lines[i][j + 1])) {
      let numberStart = j + 1;
      let numberEnd = j + 2;
      while (numbers.includes(lines[i][numberEnd])) {
        numberEnd++;
      }
      things.push(Number(lines[i].slice(numberStart, numberEnd)));
    }
    if (i !== 0) {
      const topSet = new Set();
      if (numbers.includes(lines[i - 1][j - 1])) {
        topSet.add(getNumber(i - 1, j - 1));
      }
      if (numbers.includes(lines[i - 1][j])) {
        topSet.add(getNumber(i - 1, j));
      }
      if (numbers.includes(lines[i - 1][j + 1])) {
        topSet.add(getNumber(i - 1, j + 1));
      }
      things.push(...topSet);
    }
    if (i !== lines.length - 1) {
      const bottomSet = new Set();
      if (numbers.includes(lines[i + 1][j - 1])) {
        bottomSet.add(getNumber(i + 1, j - 1));
      }
      if (numbers.includes(lines[i + 1][j])) {
        bottomSet.add(getNumber(i + 1, j));
      }
      if (numbers.includes(lines[i + 1][j + 1])) {
        bottomSet.add(getNumber(i + 1, j + 1));
      }
      things.push(...bottomSet);
    }

    if (things.length === 2) return things[0] * things[1];

    return false;
  }

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines.length; j++) {
      if (lines[i][j] === '*') {
        const gearProduct = getGearProduct(i, j);
        if (gearProduct) gearNumbers.push(gearProduct);
      }
    }
  }

  const sum = gearNumbers.reduce((acc, cur) => acc + cur, 0);

  console.log(sum);
}

export default dayThree;
