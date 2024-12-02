import { getLines, log, ints, diff, gcd, lcm, count, makeArray, mergeMatrix, makeDeepMatrix, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep, hexToDec, MinHeap } from '../../../utils.js';

let URL = './inputs/21.txt';
// URL = './inputs/t.txt';

const START = 'S';
const DIRT = '.';
const ROCK = '#';

const STEPS = 26501365;
const MULTIPLIER = 19;
// 49: 1528
// 47: 1383
// 45: 1256

export async function dayTwentyOne() {
  const template = (await getLines(URL)).map(str => str.split(''));
  let rowTemplate = cloneMatrix(template);
  for (let i = 1; i < MULTIPLIER; i++) {
    rowTemplate = mergeMatrix(rowTemplate, cloneMatrix(template), true);
  }
  let rows = cloneMatrix(rowTemplate);
  for (let i = 1; i < MULTIPLIER; i++) {
    rows = mergeMatrix(rows, cloneMatrix(rowTemplate));
  }
  const m = rows.length;
  const n = rows[0].length;
  const correctStart = Math.ceil(MULTIPLIER ** 2 / 2);
  let foundStartCount = 0;

  let start;

  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows.length; j++) {
      if (rows[i][j] === START) {
        foundStartCount += 1;
        if (foundStartCount === correctStart) {
          start = [i, j];
        } else {
          rows[i][j] = DIRT;
        }
      }
    }
  }

  rows[start[0]][start[1]] = DIRT;

  const thing = (numSteps) => {
    const queue = [[...start, 0]];
    const visited = makeMatrix(n, m, 0);
    let afterQueue = [];
    let plots = 0;
    let overlaps = 0;

    const h = (() => {
      const hEven = (i, j, steps) => {
        // log(`${i} and ${j} and ${m} and ${n}`)
        if (rows[i][j] === DIRT && !visited[i][j]) {
          if (steps % 2 !== 0) visited[i][j] = true;
          queue.push([i, j, steps + 1]);
        }
      };
      const hOdd = (i, j, steps) => {
        // log(`${i} and ${j} and ${m} and ${n}`)
        if (rows[i][j] === DIRT && !visited[i][j]) {
          if (steps % 2 === 0) visited[i][j] = true;
          queue.push([i, j, steps + 1]);
        }
      };
      return numSteps % 2 === 0 ? hEven : hOdd;
    })();

    const handleLeft = (i, j, steps) => {
      j -= 1;
      if (j < 0) {
        overlaps += 1;
        j = n - 1;
        afterQueue.push([i, j, steps + 1]);
      } else {
        h(i, j, steps);
      }
    }
    const handleRight = (i, j, steps) => {
      j += 1;
      if (j >= n) {
        overlaps += 1;
        j = 0;
        afterQueue.push([i, j, steps + 1]);
      } else {
        h(i, j, steps);
      }
    }
    const handleUp = (i, j, steps) => {
      i -= 1;
      if (i < 0) {
        overlaps += 1;
        i = m - 1;
        afterQueue.push([i, j, steps + 1]);
      } else {
        h(i, j, steps);
      }
    }
    const handleDown = (i, j, steps) => {
      i += 1;
      if (i >= m) {
        overlaps += 1;
        i = 0;
        afterQueue.push([i, j, steps + 1]);
      } else {
        h(i, j, steps);
      }
    }

    while (queue.length) {
      const [i, j, steps] = queue.shift();

      if (steps === numSteps) {
        visited[i][j] = true;
        continue;
      }

      handleLeft(i, j, steps);
      handleRight(i, j, steps);
      handleUp(i, j, steps);
      handleDown(i, j, steps);
    }

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (visited[i][j]) plots++;
      }
    }

    log(`${overlaps} overlaps`);
    log(plots);

    return plots
  }

  const allPlots = [];

  // for (let i = 1; i < STEPS; i += 2) {
  //   allPlots.push(thing(i));
  // }

  // let diffs = diff(allPlots);

  // console.dir(diffs, {'maxArrayLength': null});

  // OK: None of the solutions I thought of can practically work. But there is some cycle calculation we can do YET AGAIN
  // The differences are increasing linearly on a cycle of 131
  // d[n:n + 131] - d[n - 131:n] is 123176 where d is an array of differences between odd outputs

  // thing(STEPS);

  const init = [
    10,  20,  22,  30,  37,  47,  56,  64,  64,  68,  79,  88,
    102, 105, 105, 121, 121, 133, 141, 146, 152, 159, 163, 166,
    187, 180, 199, 192, 198, 213, 260, 261, 268, 244, 252, 262,
    269, 278, 280, 286, 294, 292, 308, 304, 333, 338, 344, 358,
    349, 359, 372, 379, 386, 383, 408, 389, 413, 429, 420, 423,
    436, 472, 460, 472, 473, 482, 503, 497, 503, 483, 510, 517,
    541, 523, 539, 557, 545, 564, 591, 567, 572, 589, 606, 607,
    633, 611, 603, 615, 618, 637, 665, 655, 660, 658, 670, 745,
    799, 788, 796, 717, 713, 725, 746, 760, 747, 745, 768, 786,
    800, 783, 807, 800, 811, 801, 818, 832, 851, 839, 838, 853,
    858, 873, 908, 868, 890, 880, 941, 894, 917, 926, 942
  ];

  const diffs = [
    920,  920,  940, 936, 906, 916,  960,  958,  906, 928, 936, 920,
    954,  934,  924, 932, 932, 940,  942,  934,  934, 954, 924, 922,
    926,  932,  944, 926, 912, 936, 1064, 1058, 1048, 984, 926, 914,
    930,  940,  932, 926, 912, 904,  924,  916,  976, 938, 944, 948,
    926,  922,  956, 950, 936, 918,  968,  902,  954, 950, 922, 920,
    924,  988,  952, 958, 946, 950,  976,  950,  952, 896, 934, 942,
    960,  916,  936, 954, 926, 942,  970,  924,  922, 940, 960, 946,
    968,  916,  904, 910, 910, 924,  950,  928,  932, 922, 920, 992,
    1070, 1048, 1048, 934, 906, 920,  940,  944,  938, 908, 928, 948,
    954,  930,  948, 934, 932, 920,  926,  936,  952, 930, 912, 924,
    924,  936,  966, 914, 928, 910,  962,  914,  928, 930, 938
  ];

  const getDifference = (n) => {
    const multiplier = Math.floor(n / 131);
    const index = n % 131;

    return init[index] + diffs[index] * multiplier;
  }

  let val = 4;

  let goal = Math.floor(STEPS / 2);

  for (let i = 0; i < goal; i++) {
    val += getDifference(i);
  }
  log(val)
}

// 6904 is wrong
// 3795 is bingo

export default dayTwentyOne;
