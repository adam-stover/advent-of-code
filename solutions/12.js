import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log, rotateMatrix, sum } from '../utils.js';

let URL = './inputs/12.txt';
// URL = './inputs/t.txt';

const SOLID = '#';
const AIR = '.';

// rotates clockwise
const rotate = (m, times = 1) => {
  const rotations = times % 4;
  if (rotations === 0) return m;
  const rotated = [
    [m[2][0], m[1][0], m[0][0]],
    [m[2][1], m[1][1], m[0][1]],
    [m[2][2], m[1][2], m[0][2]],
  ];

  if (rotations === 1) return rotated;
  return rotate(rotated, rotations - 1);
}

const flip = (m) => rotateMatrix(m);

const getRotations = (box) => {
  const rotations = new Set([bitmask(box)]);
  let cur = box;
  for (let i = 0; i < 3; i++) {
    cur = rotate(cur);
    rotations.add(bitmask(cur))
  }
  cur = flip(cur);
  rotations.add(bitmask(cur));
  for (let i = 0; i < 3; i++) {
    cur = rotate(cur);
    rotations.add(bitmask(cur));
  }
  return [...rotations];
}

const print = (m) => {
  for (let i = 0; i < m.length; i++) {
    log(m[i].map(x => x ? SOLID : AIR).join(''));
  }
}

const bitmask = (m) => {
  let x = 0;
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[0].length; j++) {
      if (m[i][j]) x |= (2 ** (i * 3 + j));
    }
  }

  return x;
}

const bithas = (mask, i, j) => Boolean(mask & (2**(i * 3 + j)));

// gets the mask that applies to a 3x3 grid which is dy, dx relative to us
// so -2, -2 means the grid is above and to the left, and we only care about our one bit
// but that one bit should be our new 9 bit
// vertical is easy, we can just shift bits
const col2 = 0b100100100;
// const col1 = 0b010010010;
const col0 = 0b001001001;
const clear2 = 0b011011011;
// const clear1 = 0b101101101;
const clear0 = 0b110110110;
const overflow = 0b111111111;

const offset = (mask, dy, dx) => {
  if (dy < 0) mask <<= (-dy * 3);
  else if (dy > 0) mask >>= (dy * 3);

  if (dx < 0) {
    // we want to ignore the right columns
    if (dx === -1) mask &= clear2;
    else mask &= col0;
    mask <<= (-dx);
  } else if (dx > 0) {
    if (dx === 1) mask &= clear0;
    else mask &= col2;
    mask >>= dx;
  }

  return mask & overflow;
}

const placeOnGrid = (grid, gridmask, shape, topLeftI, topLeftJ) => {
  // just for printing purposes
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (bithas(shape, i, j)) grid[i + topLeftI][j + topLeftJ] = true;
    }
  }

  const range = 2;

  for (let dy = -range; dy <= range; dy++) {
    for (let dx = -range; dx <= range; dx++) {
      const i = topLeftI + dy;
      const j = topLeftJ + dx;

      if (i >= 0 && i < gridmask.length && j >= 0 && j < gridmask[0].length) {
        const offsetShape = offset(shape, dy, dx);
        gridmask[i][j] |= offsetShape;
      }
    }
  }
}

const maskToShape = mask => {
  const shape = makeMatrix(3, 3, (i, j) => bithas(mask, i, j) ? true : false);
  return shape;
}

const canPlaceOnGridAtCoords = (gridmasks, rotations, i, j) => {
  const target = gridmasks[i][j];

  for (const mask of rotations) {
    if ((target & mask) === 0) return true;
  }
  return false;
}

const canPlaceOnGrid = (gridmasks, rotations) => {
  for (let i = 0; i < gridmasks.length; i++) {
    for (let j = 0; j < gridmasks[0].length; j++) {
      if (canPlaceOnGridAtCoords(gridmasks, rotations, i, j)) return true;
    }
  }
  return false;
}

const canFitSimple = (region) => {
  const [dims, quantities] = region;
  const totalArea = dims[0] * dims[1];
  const numShapes = sum(quantities);
  const worstCase = numShapes * 9;
  if (worstCase > totalArea) return false;
  return true;
}

export async function run() {
  const lines = await getLines(URL);

  const shapes = [];
  const rotationsList = [];

  const regions = [];

  for (let i = 0; i <= 5; i++) {
    const shape = lines.slice(5 * i + 1, 5 * i + 4).map(str => str.split('').map(x => x === SOLID ? true : false));
    shapes.push(shape);

    const rotations = getRotations(shape);
    rotationsList.push(rotations);
  }
  for (let i = 30; i < lines.length; i++) {
    const [dims, quantities] = lines[i].split(': ').map(ints);
    regions.push([dims, quantities]);
  }

  const count = sum(regions, canFitSimple);

  log(count);
}

export default run;
