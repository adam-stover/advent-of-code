import { getLines, has, minmax } from '../utils.js';

const URL = './inputs/23.txt';

const ELF = '#';
const OPEN = '.';
const NORTH = 0;
const SOUTH = 1;
const WEST = 2;
const EAST = 3;

const printMap = (map) => {
  for (const row of map) {
    console.log(row.join(''));
  }
}

const isAdjacent = (map, elf) => {
  const [row, column] = elf;

  if (map[row - 1]) {
    const above = map[row - 1];
    if (above[column - 1] === ELF || above[column] === ELF || above[column + 1] === ELF) return true;
  }
  if (map[row][column - 1] === ELF || map[row][column + 1] === ELF) return true;
  if (map[row + 1]) {
    const below = map[row + 1];
    if (below[column - 1] === ELF || below[column] === ELF || below[column + 1] === ELF) return true;
  }
  return false;
}

const processRound = (state) => {
  const [map, elves, firstDir] = state;
  const proposals = {};
  let elfMoved = false;

  for (let i = 0; i < elves.length; ++i) {
    if (isAdjacent(map, elves[i])) {
      const [row, column] = elves[i];
      let considering = firstDir;
      let propose;
      do {
        if (considering === NORTH) {
          if (row !== 0) {
            const above = map[row - 1];
            if (above[column - 1] !== ELF && above[column] !== ELF && above[column + 1] !== ELF) {
              propose = [row - 1, column];
            }
          }
        } else if (considering === SOUTH) {
          if (row !== map.length - 1) {
            const below = map[row + 1];
            if (below[column - 1] !== ELF && below[column] !== ELF && below[column + 1] !== ELF) {
              propose = [row + 1, column];
            }
          }
        } else if (considering === WEST) {
          if (column !== 0) {
            if (map[row][column - 1] !== ELF && map[row - 1]?.[column - 1] !== ELF && map[row + 1]?.[column - 1] !== ELF) {
              propose = [row, column - 1];
            }
          }
        } else if (column !== map[row].length - 1) {
          if (map[row][column + 1] !== ELF && map[row - 1]?.[column + 1] !== ELF && map[row + 1]?.[column + 1] !== ELF) {
            propose = [row, column + 1];
          }
        }

        considering++;
        if (considering > EAST) considering = NORTH;
      } while (considering !== firstDir && !propose);

      if (propose) {
        const key = `${propose[0]}-${propose[1]}`;
        if (has(proposals, key)) {
          proposals[key].push([i, propose]);
        } else {
          proposals[key] = [[i, propose]];
        }
      }
    }
  }

  for (const key of Object.keys(proposals)) {
    if (proposals[key].length === 1) {
      elfMoved = true;
      const [i, propose] = proposals[key][0];
      const [newRow, newColumn] = propose;
      const [originalRow, originalColumn] = elves[i];
      map[originalRow][originalColumn] = OPEN;
      map[newRow][newColumn] = ELF;
      elves[i] = propose;
    }
  }

  state[2]++;
  if (state[2] > EAST) state[2] = NORTH;
  return elfMoved;
}

const countSmallestRectangle = (map, elves) => {
  const [minY, maxY] = minmax(elves, elf => elf[0]);
  const [minX, maxX] = minmax(elves, elf => elf[1]);
  let count = 0;

  for (let y = minY; y <= maxY; ++y) {
    for (let x = minX; x <= maxX; ++x) {
      if (map[y][x] === OPEN) count++;
    }
  }

  return count;
}

const getMapAndElves = (lines) => {
  const map = [];
  const elves = [];
  const ogHeight = lines.length;
  const ogWidth = lines[0].length;
  const height = ogHeight * 3;
  const width = ogWidth * 3;

  for (let row = 0; row < height; ++row) {
    const inRowBounds = Math.floor(row / ogHeight) === 1;
    const ogRow = row % ogHeight;
    const rowArr = [];
    for (let column = 0; column < width; ++column) {
      if (inRowBounds) {
        const inColumnBounds = Math.floor(column / ogWidth) === 1;
        if (inColumnBounds) {
          const ogColumn = column % ogWidth;
          if (lines[ogRow][ogColumn] === ELF) {
            rowArr.push(ELF);
            elves.push([row, column]);
          } else {
            rowArr.push(OPEN);
          }
        } else {
          rowArr.push(OPEN);
        }
      } else {
        rowArr.push(OPEN);
      }
    }
    map.push(rowArr);
  }

  return [map, elves];
}

export default async function dayTwentyThree() {
  const lines = (await getLines(URL)).map(row => row.split(''));
  const state = getMapAndElves(lines);
  state.push(NORTH);

  const COUNT = 10;

  // for (let i = 0; i < COUNT; ++i) {
  //   processRound(state);
  // }
  let i = 1;
  while (processRound(state)) {
    i++;
  }

  printMap(state[0]);
  console.log(countSmallestRectangle(state[0], state[1]));
  console.log(i);
}
