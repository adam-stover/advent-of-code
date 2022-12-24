import { getLines, ints } from '../utils.js';

const URL = './inputs/18.txt';

export function rangeUnion(ranges) {
  const sorted = cloneMatrix(ranges).sort((a, b) => a[0] - b[0]);
  const union = [];

  for (const [start, end] of sorted) {
    if (union.length && union[union.length - 1][1] >= start - 1) {
      // following if is to avoid entirely contained ranges
      if (union[union.length - 1][1] < end) {
        union[union.length - 1] = [union[union.length - 1][0], end];
      }
    } else {
      union.push([start, end]);
    }
  }

  return union;
}

// const cubeUnion = (cubes) => {
//   const union = [];

//   for (const a of cubes) {
//     let done = false;
//     for (const b of union) {
//       // if sum of differences is 1
//       if (a.reduce((acc, cur, i) => acc + Math.abs(cur - b[i]), 0) === 1) {
//         done = true;

//       }
//     }
//   }
// }


export default async function dayEighteen() {
  const cubes = (await getLines(URL)).map(ints);

  let sides = cubes.length * 6;

  for (let i = 0; i < cubes.length - 1; ++i) {
    for (let j = i + 1; j < cubes.length; ++j) {
      const sumDiff = Math.abs(cubes[i][0] - cubes[j][0]) + Math.abs(cubes[i][1] - cubes[j][1]) + Math.abs(cubes[i][2] - cubes[j][2]);

      if (sumDiff === 1) sides -= 2;
    }
  }

  console.log(sides);
}
