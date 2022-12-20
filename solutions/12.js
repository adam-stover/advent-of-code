import { cloneMatrix, getLines } from "../utils.js";

const URL = './inputs/12.txt';

const getElevation = (char) => {
  if (char === 'S') return 'a'.charCodeAt(0);
  if (char === 'E') return 'z'.charCodeAt(0);
  return char.charCodeAt(0);
}

const getShortestPath = (grid, visited, startingPoint) => {
  const height = grid.length;
  const width = grid[0].length;
  const queue = [[...startingPoint]];
  visited[startingPoint[0]][startingPoint[1]] = true;

  while (queue.length) {
    const path = queue.shift();
    const [i, j, counter] = path;
    const elevation = grid[i][j];

    if (elevation === 'E') return path;

    const maxElevation = getElevation(elevation) + 1;

    if (j + 1 < width && !visited[i][j + 1] && getElevation(grid[i][j + 1]) <= maxElevation) {
      visited[i][j + 1] = true;
      queue.push([i, j + 1, counter + 1]);
    }
    if (j - 1 >= 0 && !visited[i][j - 1] && getElevation(grid[i][j - 1]) <= maxElevation) {
      visited[i][j - 1] = true;
      queue.push([i, j - 1, counter + 1])
    }
    if (i + 1 < height && !visited[i + 1][j] && getElevation(grid[i + 1][j]) <= maxElevation) {
      visited[i + 1][j] = true;
      queue.push([i + 1, j, counter + 1]);
    }
    if (i - 1 >= 0 && !visited[i - 1][j] && getElevation(grid[i - 1][j]) <= maxElevation) {
      visited[i - 1][j] = true;
      queue.push([i - 1, j, counter + 1])
    }
  }
}

export default async function dayTwelve() {
  const grid = await getLines(URL);
  const startingPoints = [];
  const visited = [];

  for (let i = 0; i < grid.length; ++i) {
    const subarr = [];
    for (let j = 0; j < grid[i].length; ++j) {
      subarr.push(false);
    }
    visited.push(subarr);
  }

  for (let i = 0; i < grid.length; ++i) {
    for (let j = 0; j < grid[i].length; ++j) {
      if (grid[i][j] === 'S' || grid[i][j] === 'a') {
        startingPoints.push([i, j, 0]);
        visited[i][j] = true;
      }
    }
  }

  const pathLengths = startingPoints.map(sp => getShortestPath(grid, cloneMatrix(visited), sp)).filter(x => x);

  console.log(pathLengths.reduce((smallest, cur) => smallest < cur[2] ? smallest : cur[2], Infinity));
}
