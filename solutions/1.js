import { getLines, ints, cloneObj, filterMap, rangeUnion, has, max, min, minmax, findLastIndex } from '../utils.js';

const URL = './inputs/1.txt';

const things = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'zero'].map(n => n.toString());

const getFirstDigitString = (line) => {
  for (let i = 0; i < line.length; i++) {
    for (const thing of things) {
      if (line.slice(i).startsWith(thing)) {
        return thing;
      }
    }
  }
}

const getLastDigitString = (line) => {
  for (let i = line.length - 1; i >= 0; i--) {
    for (const thing of things) {
      if (line.slice(i).startsWith(thing)) {
        return thing;
      }
    }
  }
}

const getNumFromWord = word => {
  switch (word) {
    case 'one':
      return 1;
    case 'two':
      return 2;
    case 'three':
      return 3;
    case 'four':
      return 4;
    case 'five':
      return 5;
    case 'six':
      return 6;
    case 'seven':
      return 7;
    case 'eight':
      return 8;
    case 'nine':
      return 9;
    case 'zero':
      return 0;
  }
}

export async function dayOne() {
  const lines = await getLines(URL);

  let sum = 0;

  for (const line of lines) {
    const firstDigitString = getFirstDigitString(line);
    const lastDigitString = getLastDigitString(line);
    const firstDigit = isNaN(Number(firstDigitString))
      ? getNumFromWord(firstDigitString)
      : Number(firstDigitString);
    const lastDigit = isNaN(Number(lastDigitString))
      ? getNumFromWord(lastDigitString)
      : Number(lastDigitString);

    sum += Number(`${firstDigit}${lastDigit}`);
  }

  console.log(sum);
}

export default dayOne;
