import { getLines, ints, count, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex } from '../utils.js';

let URL = './inputs/8.txt';
// URL = './inputs/t.txt';

const gcd = (a, b) => a ? gcd(b % a, a) : b;

const lcm = (a, b) => a * b / gcd(a, b);

export async function dayEight() {
  const lines = await getLines(URL);

  const dirs = lines[0];

  const nodes = lines.slice(2).reduce((acc, line) => {
    const origin = line.slice(0, 3);
    const left = line.slice(7, 10);
    const right = line.slice(12, 15);

    acc[origin] = [origin, left, right];
    return acc;
  }, {});

  const h = (key) => {
    let steps = 0;
    let stepIndex = 0;
    let curr = nodes[key];

    do {
      steps++;
      const nextStep = dirs[stepIndex++] === 'L' ? 1 : 2;
      curr = nodes[curr[nextStep]];
      if (stepIndex >= dirs.length) stepIndex = 0;
    } while (!curr[0].endsWith('Z'));

    return [steps, curr[0]];
  }

  const nodeKeys = Object.keys(nodes);
  const currs = nodeKeys.filter(key => key.endsWith('A')).map(key => nodes[key]);
  const stepMap = nodeKeys.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  // make hash where each key is a node and each result is an array of which key it'll be at in that many steps
  // ^ LOL didn't do that

  for (let i = 0; i < nodeKeys.length; i++) {
    const key = nodeKeys[i];
    const [numSteps, resultKey] = h(key);
    stepMap[key] = [numSteps, resultKey];
  }

  const stepsFromAtoFirstZ = currs.map(curr => stepMap[curr[0]]);
  console.log(stepsFromAtoFirstZ);
  // This below part validates that we're in a cycle and we can just get lcm
  // Weird to me that the steps from A to first Z are same number of steps from each Z to itself tho
  // Ahh -- it's a directed cyclic graph with the As OUTSIDE the graph pointing in to the same place the Zs point to
  // const stepsFromFirstZToSecondZ = stepsFromAtoFirstZ.map(curr => stepMap[curr[1]]);
  // console.log(stepsFromFirstZToSecondZ)
  // console.log(stepsFromFirstZToSecondZ.every(curr => curr[0] % dirs.length === 0))

  const nums = stepsFromAtoFirstZ.map(curr => curr[0]);

  const res = nums.reduce(lcm);
  console.log(res);

  // console.log(dirs.length);
  // console.log(currs.length);

  // while (!currs.every(node => node[0].endsWith('Z'))) {
  //   steps++;
  //   const nextStep = dirs[stepIndex++] === 'L' ? 1 : 2;
  //   for (let i = 0; i < currs.length; i++) {
  //     currs[i] = nodes[currs[i][nextStep]];
  //   }
  //   if (stepIndex >= dirs.length) stepIndex = 0;
  // }
}

export default dayEight;
