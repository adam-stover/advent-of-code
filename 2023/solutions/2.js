import { getLines, ints, cloneObj, filterMap, rangeUnion, has, max, min, minmax, findLastIndex } from '../utils.js';

const URL = './inputs/2.txt';

const NUM_RED = 12;
const NUM_GREEN = 13;
const NUM_BLUE = 14;

const COLOR_MAP = {
  'red': NUM_RED,
  'green': NUM_GREEN,
  'blue': NUM_BLUE,
};

const checkLine = (line) => {
  const words = line.split('').filter(c => c !== ',' && c !== ';').join('').split(' ').filter(word => word !== '');

  for (const color of Object.keys(COLOR_MAP)) {
    let index = words.indexOf(color);

    while (index !== -1) {
      if (Number(words[index - 1]) > COLOR_MAP[color]) {
        return false;
      }

      index = words.indexOf(color, index + 1);
    }
  }

  return true;
}

const getCubes = (line) => {
  const words = line.split('').filter(c => c !== ',' && c !== ';').join('').split(' ').filter(word => word !== '');

  const colorMaxes = [];

  for (const color of Object.keys(COLOR_MAP)) {
    let index = words.indexOf(color);

    let colorMax = 0;

    while (index !== -1) {
      if (Number(words[index - 1]) > colorMax) {
        colorMax = Number(words[index - 1])
      }

      index = words.indexOf(color, index + 1);
    }

    colorMaxes.push(colorMax);
  }

  return colorMaxes[0] * colorMaxes[1] * colorMaxes[2];
}

export async function dayTwo() {
  const lines = await getLines(URL);

  const nums = lines.map(ints);

  let sum = 0;

  for (let i = 0; i < lines.length; i++) {
    const id = nums[i][0];

    if (checkLine(lines[i])) sum += Number(id);
  }

  console.log(sum);

  console.log(lines.map(getCubes).reduce((a, b) => a + b, 0));
}

export default dayTwo;
