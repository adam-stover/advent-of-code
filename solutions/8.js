import { getLines } from '../helpers.js';

const URL = './inputs/8.txt';

const isCellVisible = (grid, rowIndex, columnIndex) => {
  const row = grid[rowIndex];
  const cell = row[columnIndex];

  let visible = true;

  // check left
  for (let i = 0; i < columnIndex; ++i) {
    if (row[i] >= cell) {
      visible = false;
      break;
    }
  }

  if (visible) return true;
  visible = true;

  // check right
  for (let i = columnIndex + 1; i < row.length; ++i) {
    if (row[i] >= cell) {
      visible = false;
      break;
    }
  }

  if (visible) return true;
  visible = true;

  // check up
  for (let i = 0; i < rowIndex; ++i) {
    if (grid[i][columnIndex] >= cell) {
      visible = false;
      break;
    }
  }

  if (visible) return true;
  visible = true;

  // check down
  for (let i = rowIndex + 1; i < grid.length; ++i) {
    if (grid[i][columnIndex] >= cell) {
      visible = false;
      break;
    }
  }

  return visible;
}

const getScenicScore = (grid, rowIndex, columnIndex) => {
  const row = grid[rowIndex];
  const cell = row[columnIndex];

  let scoreL = 0;
  let scoreR = 0;
  let scoreU = 0;
  let scoreD = 0;

  for (let i = columnIndex - 1; i >= 0; --i) {
    scoreL++;
    if (row[i] >= cell) break;
  }

  for (let i = columnIndex + 1; i < row.length; ++i) {
    scoreR++;
    if (row[i] >= cell) break;
  }

  for (let i = rowIndex - 1; i >= 0; --i) {
    scoreU++;
    if (grid[i][columnIndex] >= cell) break;
  }

  for (let i = rowIndex + 1; i < grid.length; ++i) {
    scoreD++;
    if (grid[i][columnIndex] >= cell) break;
  }

  return scoreL * scoreR * scoreU * scoreD;
}

export default async function dayEight() {
  const grid = await getLines(URL);

  // let visibleCount = grid.length * 2 + (grid[0].length - 2) * 2;
  let maxScenicScore = 0;

  // strategy 1:
  // iterate through each interior cell to determine if it's visible
  // will need to check at most row.length + col.length - 2 per cell

  for (let i = 1; i < grid.length - 1; ++i) {
    const row = grid[i];

    for (let j = 1; j < row.length - 1; ++j) {
      const score = getScenicScore(grid, i, j);
      if (score > maxScenicScore) maxScenicScore = score;
      // if (isCellVisible(grid, i, j)) visibleCount++;
    }
  }

  console.log(maxScenicScore);
}
