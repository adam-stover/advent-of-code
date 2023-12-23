import { getLines, log, ints, diff, gcd, lcm, count, makeArray, mergeMatrix, makeDeepMatrix, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep, hexToDec, MinHeap } from '../utils.js';

let URL = './inputs/22.txt';
// URL = './inputs/t.txt';

const MISS = 0;
const REST = 1;
const FALL = 2;

class Brick {
  constructor(val, name) {
    const [start, end] = val;
    this.name = name;
    this.start = start;
    this.end = end;
    this.supportedBy = new Set();
    this.supports = new Set();
  }
}

export async function dayTwentyTwo() {
  const rows = await getLines(URL);

  const bricks = rows.map((row, i) => {
    const brick = row.split('~').map(coords => {
      const [x, y, z] = ints(coords);
      return { x, y, z };
    });

    let name = '';
    let num = i;
    while (num >= 0) {
      let charCode = num % 26;
      name += String.fromCharCode(charCode + 65);
      num -= 26;
    }

    return new Brick(brick, name);
  }).sort((a, b) => a.start.z - b.start.z);

  // log(bricks[0])

  // OK a coords are always less than b coords

  // Will b catch a?
  const brickInteraction = (a, b) => {
    // We need to intersect on at least one x AND y coordinate, and bend z must be higher than astart z by more than 1
    const intersect = (
      a.start.x <= b.end.x && b.start.x <= a.end.x &&
      a.start.y <= b.end.y && b.start.y <= a.end.y
    );

    if (!intersect) return MISS;
    if (a.start.z - b.end.z === 1) return REST;
    if (a.start.z - b.end.z > 1) return FALL;
    // log('accidentally above');
    return MISS;
  }

  const stopBrick = (a, b) => {
    // log('falling');
    const distanceFallen = a.start.z - b.end.z - 1;
    a.start.z -= distanceFallen;
    a.end.z -= distanceFallen;
  }

  const baseBricks = bricks.filter(b => b.start.z === 1);
  const nonBaseBricks = bricks.filter(brick => brick.start.z > 1);

  const handleSupport = (i) => {
    const a = nonBaseBricks[i];
    let bricksThatCatchA = [];
    for (let j = 0; j < bricks.length; j++) {
      const b = bricks[j];
      if (a === b) continue;

      const interaction = brickInteraction(a, b);
      if (interaction !== MISS) bricksThatCatchA.push(b);
    }

    let brickAFallsTo = [];
    let best = 0;

    for (const brick of bricksThatCatchA) {
      if (brick.end.z > best) {
        brickAFallsTo = [brick];
        best = brick.end.z;
      } else if (brick.end.z === best) {
        brickAFallsTo.push(brick);
      }
    }

    if (a.start.z - best > 1) {
      if (brickAFallsTo.length) stopBrick(a, brickAFallsTo[0]);
      else {
        // For when we hit ground
        stopBrick(a, { end: { z: 0 } })
      }
      return FALL;
    }

    // log('establishing support')

    for (const brick of brickAFallsTo) {
      brick.supports.add(a);
      a.supportedBy.add(brick);
    }

    return REST;
  }

  let state = FALL;

  while (state === FALL) {
    for (let i = 0; i < nonBaseBricks.length; i++) {
      // can make faster by removing bricks that fall to 0 from nonBaseBreaks
      if (handleSupport(i) === FALL) {
        state = FALL;
        break;
      }
      state = REST;
    }
  }

  const topBricks = bricks.filter(b => b.supports.size === 0);
  // for (const brick of bricks) {
  //   log(brick);
  // }

  let counter = 0;

  const canDisintegrate = (brick) => {
    for (const supportedBlock of brick.supports) {
      if (supportedBlock.supportedBy.size === 1) {
        log(`Brick ${brick.name} is crucial`)
        return false;
      }
    }
    return true;
  }

  const directFalls = {};

  const howManyFall = (brick) => {
    let destroyed = [brick];
    for (const supportedBlock of brick.supports) {
      if (supportedBlock.supportedBy.size === 1) {
        destroyed.push(supportedBlock)
      }
    }
    let res = destroyed.length - 1;
    // log(destroyed)
    let blocksToTest = [...new Set(flattenDeep(destroyed.map(b => [...b.supports])).filter(b => !destroyed.includes(b)))];
    // log("BLOCKS TO TEST");
    // log(blocksToTest)

    // log(`Processing brick ${brick.name}`)
    while (blocksToTest.length) {
      const nextDestroyed = [];
      for (const block of blocksToTest) {
        // log("BLOCK")
        // log(block)
        if (![...block.supportedBy].filter(b => !destroyed.includes(b)).length) {
          nextDestroyed.push(block)
        }
      }
      res += nextDestroyed.length;
      destroyed = [...new Set([...destroyed, ...nextDestroyed])]
      blocksToTest = [...new Set(flattenDeep(nextDestroyed.map(b => [...b.supports])).filter(b => !destroyed.includes(b)))];
    }
    // log(`${brick.name} causes ${res.length} to fall.`)
    // log(res)
    return res;
  }

  let res = 0;

  for (const brick of bricks) res += howManyFall(brick)

  log(res);

  // for (const brick of bricks) {
  //   if (canDisintegrate(brick)) counter++;
  // }

  const logBricks = (brick) => {
    log(`Brick ${brick.name} supports ${[...brick.supports].map(b => b.name).join(', ')}`);
    for (const b of brick.supports) logBricks(b);
  }
  // for (const b of baseBricks) logBricks(b);
  // log(counter);
}

// 544 is too high
// 421 is correct -- all I changed was sorting LOL
// P2: 11837 is too low

export default dayTwentyTwo;
