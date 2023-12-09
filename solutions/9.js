import { getLines, ints, gcd, lcm, count, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex } from '../utils.js';

let URL = './inputs/9.txt';
// URL = './inputs/t.txt';

const h = (nums) => {
  const differences = [];

  for (let i = 1; i < nums.length; i++) {
    differences.push(nums[i] - nums[i - 1]);
  }

  return differences;
}

export async function dayNine() {
  const lines = await getLines(URL);

  let sum = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nums = ints(line);
    const all = [nums];
    let differences = h(nums);
    while (!differences.every(num => num === 0)) {
      all.push(differences);
      differences = h(differences);
    }

    for (let i = all.length - 2; i >= 0; i--) {
      const addingTo = all[i];
      // console.log(addingTo);
      const adding = all[i + 1][0];
      // console.log(adding);
      addingTo.unshift(addingTo[0] - adding);
    }
    console.log(all[0][0]);

    sum += all[0][0];
  }

  console.log(sum);
}

export default dayNine;
