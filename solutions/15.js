import { getLines, ints, diff, gcd, lcm, count, makeArray, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep } from '../utils.js';

let URL = './inputs/15.txt';
// URL = './inputs/t.txt';

const hash = (str) => {
  let res = 0;

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    res += code;
    res *= 17;
    res = res % 256;
  }

  return res;
}

export async function dayFifteen() {
  const str = (await getLines(URL))[0];

  // const steps = str.split(',');

  // let res = 0;

  // for (const step of steps) {
  //   res += hash(step);
  // }

  // console.log(res);

  const steps = str.split(',').map(step => {
    const label = step.includes('=')
      ? step.split('=')[0]
      : step.split('-')[0];

    return [hash(label), step]
  });
  const boxes = makeArray(256, () => ([]));

  for (const [boxIndex, step] of steps) {
    const box = boxes[boxIndex];
    if (step.includes('=')) {
      const [label, focalLength] = step.split('=');
      const index = box.findIndex(([existingLabel]) => label === existingLabel);
      if (index === -1) {
        box.push([label, focalLength]);
      } else {
        box[index] = [label, focalLength];
      }
    } else {
      const [label] = step.split('-');
      const index = box.findIndex(([existingLabel]) => label === existingLabel);
      if (index >= 0) {
        box.splice(index, 1);
      }
    }
  }

  let res = 0;

  for (let i = 0; i < boxes.length; i++) {
    res += boxes[i].reduce((acc, [_, focalLength], index) => {
      const a = 1 + i;
      const b = 1 + index;
      const c = focalLength;

      // console.log(`box ${i} gets ${a} * ${b} * ${c}`)

      return acc + (a * b * c);
    }, 0);
  }

  console.log(res);
}

export default dayFifteen;
