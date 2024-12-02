import { getLines, ints, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, max, min, minmax, findLastIndex } from '../utils.js';

const URL = './inputs/6.txt';

const h = (time, timeHeld) => {
  if (timeHeld === 0) return 0;
  if (timeHeld >= time) return 0;

  return (time - timeHeld) * timeHeld;
}

export async function daySix() {
  const lines = await getLines(URL);

  let sum = 1;

  const times = ints(lines[0]);
  const dists = ints(lines[1]);

  const time = Number(times.join(''));
  const dist = Number(dists.join(''));

  let start = 0;
  let end = 0;

  for (let i = 1; i < time; i++) {
    if (h(time, i) > dist) {
      start = i;
      break;
    }
  }

  console.log(start);

  for (let i = time - 1; i > 0; i--) {
    if (h(time, i) > dist) {
      end = i;
      break;
    }
  }

  console.log(end);

  console.log(1 + (end - start))

  // for (let i = 0; i < times.length; i++) {
  //   let isum = 0;
  //   const time = times[i];
  //   const dist = dists[i];

  //   for (let j = 1; j < time; j++) {
  //     const res = h(time, j);
  //     if (res > dist) isum++;
  //   }

  //   sum *= isum;
  // }

  // console.log(sum);
}

export default daySix;
