import { cloneMatrix, getLines, ints, minmax } from '../utils.js';

const URL = './inputs/18.txt';

const getSurfaceArea = (cubes) => {
  let sides = cubes.length * 6;

  for (let i = 0; i < cubes.length - 1; ++i) {
    for (let j = i + 1; j < cubes.length; ++j) {
      const sumDiff = Math.abs(cubes[i][0] - cubes[j][0]) + Math.abs(cubes[i][1] - cubes[j][1]) + Math.abs(cubes[i][2] - cubes[j][2]);

      if (sumDiff === 1) sides -= 2;
    }
  }

  return sides;
}

const getInternalSurfaceArea = (cubes) => {
  const sorted = cloneMatrix(cubes).sort((a, b) => {
    const x = a[0] - b[0];
    if (x !== 0) return x;
    const y = a[1] - b[1];
    if (y !== 0) return y;
    const z = a[2] - b[2];
    if (z !== 0) return z;
    return 0;
  });

  const minX = sorted[0][0];
  const maxX = sorted[sorted.length - 1][0];
  const [minY, maxY] = minmax(sorted, cube => cube[1]);
  const [minZ, maxZ] = minmax(sorted, cube => cube[2]);

  const grid = [];
  let baseVisited = [];

  for (let x = minX; x <= maxX; ++x) {
    const xPlane = [];
    const visitedXPlane = [];
    for (let y = minY; y <= maxY; ++y) {
      const yRow = [];
      const visitedYRow = [];
      for (let z = minZ; z <= maxZ; ++z) {
        yRow.push(false);
        visitedYRow.push(false);
      }
      xPlane.push(yRow);
      visitedXPlane.push(visitedYRow);
    }
    grid.push(xPlane);
    baseVisited.push(visitedXPlane);
  }

  const xLen = grid.length;
  const yLen = grid[0].length;
  const zLen = grid[0][0].length;

  for (const cube of sorted) {
    const x = cube[0] - minX;
    const y = cube[1] - minY;
    const z = cube[2] - minZ;

    grid[x][y][z] = true;
  }

  const airCubeMap = {};

  // the problem here is that we're missing *sections* of trapped air
  // so instead let's do some 3D pathfinding
  // so what we're doing here is going through all the inner points of the grid
  // if they're air and unvisited, we search to find the extent of the air pocket
  // aha! the problem might be that we're blocking the escape routes
  // by marking them visited early
  // ok that was a problem but our answer of 2454 was still too low
  // ohhhhhhh -- wait nevermind. for a moment I thought we might be cutting off external air pockets
  // but obviously that's the whole point of our 'escaped' check.
  // huh, weird -- we're finding air pockets where there are literally cubes
  // nvm that was a conversion issue, is working as intended
  // ok this air cube map stuff worked??
  // I guess we were overcounting air pockets (1790 instead of 1784) when we persisted
  // the visited grid between point checks. this means we must have thought 'oh we're trapped'
  // when actually there was an escape path.

  for (let x = 1; x < xLen - 1; ++x) {
    for (let y = 1; y < yLen - 1; ++y) {
      for (let z = 1; z < zLen - 1; ++z) {
        if (!grid[x][y][z]) {
          const queue = [[x, y, z]];
          const potentialAirCubes = [[x, y, z]];
          const visited = cloneMatrix(baseVisited);
          let escaped = false;

          while (queue.length) {
            const point = queue.shift();
            const [x, y, z] = point;

            if (!x || x >= xLen - 1 || !y || y >= yLen - 1 || !z || z >= zLen - 1) {
              escaped = true;
              break;
            }

            if (!grid[x][y][z + 1] && !visited[x][y][z + 1]) {
              visited[x][y][z + 1] = true;
              queue.push([x, y, z + 1]);
              potentialAirCubes.push([x, y, z + 1]);
            }
            if (!grid[x][y][z - 1] && !visited[x][y][z - 1]) {
              visited[x][y][z - 1] = true;
              queue.push([x, y, z - 1]);
              potentialAirCubes.push([x, y, z - 1]);
            }
            if (!grid[x][y + 1][z] && !visited[x][y + 1][z]) {
              visited[x][y + 1][z] = true;
              queue.push([x, y + 1, z]);
              potentialAirCubes.push([x, y + 1, z]);
            }
            if (!grid[x][y - 1][z] && !visited[x][y - 1][z]) {
              visited[x][y - 1][z] = true;
              queue.push([x, y - 1, z]);
              potentialAirCubes.push([x, y - 1, z]);
            }
            if (!grid[x + 1][y][z] && !visited[x + 1][y][z]) {
              visited[x + 1][y][z] = true;
              queue.push([x + 1, y, z]);
              potentialAirCubes.push([x + 1, y, z]);
            }
            if (!grid[x - 1][y][z] && !visited[x - 1][y][z]) {
              visited[x - 1][y][z] = true;
              queue.push([x - 1, y, z]);
              potentialAirCubes.push([x - 1, y, z]);
            }
          }

          if (!escaped) {
            for (const [x, y, z] of potentialAirCubes) {
              airCubeMap[`${x}-${y}-${z}`] = [x, y, z];
            }
            baseVisited = visited;
          }
        }
      }
    }
  }

  return getSurfaceArea(Object.values(airCubeMap));
}

export default async function dayEighteen() {
  const cubes = (await getLines(URL)).map(ints);

  const surfaceArea = getSurfaceArea(cubes);
  console.log(surfaceArea);

  const internalSurfaceArea = getInternalSurfaceArea(cubes);
  console.log(internalSurfaceArea);

  console.log(surfaceArea - internalSurfaceArea);
}
