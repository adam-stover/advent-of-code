import { getLines, log, ints, diff, gcd, lcm, count, makeArray, mergeMatrix, makeDeepMatrix, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep, hexToDec, MinHeap } from '../utils.js';

let URL = './inputs/24.txt';
URL = './inputs/t.txt';

const START = 7;
const END = 27;

// const START = 200000000000000;
// const END = 400000000000000;

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

  const getHailstonePositionAtT = (hailstone, time) => {
    const x = hailstone.position.x + hailstone.velocity.x * time;
    const y = hailstone.position.y + hailstone.velocity.y * time;
    const z = hailstone.position.z + hailstone.velocity.z * time;

    return { x, y, z }
  }

  const whenWillHailstoneBeAtX = (hailstone, targetx) => {
    return (targetx - hailstone.position.x) / hailstone.velocity.x;
  }

  // const whenWillHailstoneBeAtY = (hailstone, targety) => {
  //   return (targety - hailstone.position.y) / hailstone.velocity.y;
  // }

  const getSlope = (hailstone) => {
    return hailstone.velocity.y / hailstone.velocity.x;
  }

  const doIntersect = (a, b) => {
    return getSlope(a) !== getSlope(b);
  }

  const getIntersection2D = (a, b) => {
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

  const cross = (a, b) => {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x,
    };
  };

  const length = (a) => Math.sqrt(a.x**2 + a.y**2 + a.z**2);

  const getVelocityForTwoPoints = (a, b) => {
    return {
      x: b.x - a.x,
      y: b.y - a.y,
      z: b.z - a.z,
    };
  };

  const dot = (a, b) => {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  };

  const scalarVectorMultiply = (s, v) => {
    return {
      x: s * v.x,
      y: s * v.y,
      z: s * v.z,
    };
  };

  const vectorAdd = (a, b) => {
    return {
      x: a.x + b.x,
      y: a.y + b.y,
      z: a.z + b.z,
    };
  };

  const getIntersection = (a, b) => {
    const c = { ...a.position };
    const d = { ...b.position };
    const e = { ...a.velocity };
    const f = { ...b.velocity };
    const g = getVelocityForTwoPoints(c, d);
    const h = cross(f, g);
    const k = cross(f, e);
    if (h === 0 || k === 0) {
      log('no intersection');
      return false;
    }
    let sign = 1;
    if (
      (h.x > 0 && k.x < 0) || (h.x < 0 && k.x > 0) ||
      (h.y > 0 && k.y < 0) || (h.y < 0 && k.y > 0) ||
      (h.z > 0 && k.z < 0) || (h.z < 0 && k.z > 0)
    ) {
      sign = -1;
    }
    const l = length(h) / length(k);
    return vectorAdd(c, scalarVectorMultiply(l, e));
  }

  const isValidIntersection = (a, b) => {
    const p = getIntersection(a, b);

    if (p && whenWillHailstoneBeAtX(a.x) >= 0 && whenWillHailstoneBeAtX(b.x) >= 0) return true;
  }

  const testIntersectionAtT = (a, b) => {

  }

  // let intersections = 0;

  const hailstones = rows.map(getHailstone);

  const set = new Set();

  for (const h of hailstones) {

  }

  // for (let i = 0; i < rows.length - 1; i++) {
  //   for (let j = i + 1; j < rows.length; j++) {
  //     const a = hailstones[i];
  //     const b = hailstones[j];
  //     const inter = getIntersection2D(a, b);
  //     if (inter && inter.x >= START && inter.x <= END && inter.y >= START && inter.y <= END) {
  //       const aTime = whenWillHailstoneBeAtX(a, inter.x);
  //       const bTime = whenWillHailstoneBeAtX(b, inter.x);
  //       if (aTime >= 0 && bTime >= 0) intersections++;
  //     }
  //   }
  // }

  // log(intersections);
}

// 14390 is not right
// 17906 is correct
// 422604721834653696 is too high


export default dayTwentyFour;
