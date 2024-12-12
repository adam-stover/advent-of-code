import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/12.txt';
// URL = './inputs/t.txt';

const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;

export async function run() {
  const lines = await getLines(URL);
  const iLen = lines.length;
  const jLen = lines[0].length;

  const visited = makeMatrix(jLen, iLen, false);

  const bfs = (startI, startJ) => {
    if (visited[startI][startJ]) return 0;

    const queue = [[startI, startJ]];
    const val = lines[startI][startJ];
    let area = 0;
    let perimeter = 0;

    while (queue.length) {
      const [i, j] = queue.shift();
      if (visited[i][j]) continue;
      visited[i][j] = true;
      area++;

      if (i > 0 && lines[i - 1][j] === val) {
        queue.push([i - 1, j]);
      } else {
        perimeter++;
      }
      if (i < iLen - 1 && lines[i + 1][j] === val) {
        queue.push([i + 1, j]);
      } else {
        perimeter++;
      }
      if (j > 0 && lines[i][j - 1] === val) {
        queue.push([i, j - 1]);
      } else {
        perimeter++;
      }
      if (j < jLen - 1 && lines[i][j + 1] === val) {
        queue.push([i, j + 1]);
      } else {
        perimeter++;
      }
    }

    return area * perimeter;
  }

  // side = ${dir}-${i}-${startj}

  const bfs2 = (startI, startJ) => {
    if (visited[startI][startJ]) return [0, 0];

    const queue = [[startI, startJ]];
    const val = lines[startI][startJ];
    const fences = [{}, {}, {}, {}];
    let area = 0;
    let sides = 0;

    while (queue.length) {
      const [i, j] = queue.shift();
      if (visited[i][j]) continue;
      visited[i][j] = true;
      area++;

      if (i > 0 && lines[i - 1][j] === val) {
        queue.push([i - 1, j]);
      } else {
        if (!has(fences[NORTH], i)) fences[NORTH][i] = [];
        fences[NORTH][i].push(j);
      }
      if (i < iLen - 1 && lines[i + 1][j] === val) {
        queue.push([i + 1, j]);
      } else {
        if (!has(fences[SOUTH], i)) fences[SOUTH][i] = [];
        fences[SOUTH][i].push(j);
      }
      if (j > 0 && lines[i][j - 1] === val) {
        queue.push([i, j - 1]);
      } else {
        if (!has(fences[WEST], j)) fences[WEST][j] = [];
        fences[WEST][j].push(i);
      }
      if (j < jLen - 1 && lines[i][j + 1] === val) {
        queue.push([i, j + 1]);
      } else {
        if (!has(fences[EAST], j)) fences[EAST][j] = [];
        fences[EAST][j].push(i);
      }
    }

    for (const fenceMapInOneDirection of fences) {
      for (const line of Object.values(fenceMapInOneDirection)) {
        line.sort((a, b) => a -b);
        let lastNum = line[0];
        let numSides = 1;

        for (let i = 1; i < line.length; i++) {
          if (line[i] - lastNum !== 1) numSides++;
          lastNum = line[i];
        }

        sides += numSides;``
      }
    }

    return [area, sides];
  }

  let res = 0;

  for (let i = 0; i < iLen; i++) {
    for (let j = 0; j < jLen; j++) {
      const [area, sides] = bfs2(i, j);
      const amt = area * sides;
      // if (amt) {
      //   log(`val ${lines[i][j]} at ${i}-${j} totals ${area} * ${sides} = ${amt}`);
      // }
      res += amt;
    }
  }

  log(res);

  // 6068584 is not right
}

export default run;
