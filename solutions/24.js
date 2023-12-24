import { getLines, log, ints, diff, gcd, lcm, count, makeArray, mergeMatrix, makeDeepMatrix, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep, hexToDec, MinHeap } from '../utils.js';

let URL = './inputs/24.txt';
// URL = './inputs/t.txt';

// const START = 7;
// const END = 27;

const START = 200000000000000;
const END = 400000000000000;

export async function dayTwentyFour() {
  const rows = await getLines(URL);

  const getHailstone = (row) => {
    const nums = ints(row);
    const position = {
      x: nums[0],
      y: nums[1],
      z: nums[2],
    };
    const velocity = {
      x: nums[3],
      y: nums[4],
      z: nums[5],
    };

    return { position, velocity };
  }

  // const getHailstonePositionAtT = (hailstone, time) => {
  //   const x = hailstone.position.x + hailstone.velocity.x * time;
  //   const y = hailstone.position.y + hailstone.velocity.y * time;
  //   const z = hailstone.position.z + hailstone.velocity.z * time;

  //   return { x, y, z }
  // }

  const whenWillHailstoneBeAtX = (hailstone, targetx) => {
    return (targetx - hailstone.position.x) / hailstone.velocity.x;
  }

  // const whenWillHailstoneBeAtY = (hailstone, targety) => {
  //   return (targety - hailstone.position.y) / hailstone.velocity.y;
  // }

  // const ccw = (a, b, c) => {
  //   return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
  // }

  // const intersect = (a, b, c, d) => {
  //   return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
  // }

  const getIntersection = (a, b) => {
    const a1 = a.velocity.y;
    const b1 = -a.velocity.x;
    const c1 = a1 * a.position.x + b1 * a.position.y;

    const a2 = b.velocity.y;
    const b2 = -b.velocity.x;
    const c2 = a2 * b.position.x + b2 * b.position.y;

    const determinant = a1 * b2 - a2 * b1;

    if (determinant !== 0) {
      const x = (b2 * c1 - b1 * c2) / determinant;
      const y = (a1 * c2 - a2 * c1) / determinant;
      return { x, y };
    }
  }

  let intersections = 0;

  const hailstones = rows.map(getHailstone);

  for (let i = 0; i < rows.length - 1; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const a = hailstones[i];
      const b = hailstones[j];
      const inter = getIntersection(a, b);
      if (inter && inter.x >= START && inter.x <= END && inter.y >= START && inter.y <= END) {
        const aTime = whenWillHailstoneBeAtX(a, inter.x);
        const bTime = whenWillHailstoneBeAtX(b, inter.x);
        if (aTime >= 0 && bTime >= 0) intersections++;
      }
    }
  }

  log(intersections);
}

// 14390 is not right
// 17906 is correct


export default dayTwentyFour;
