import { readFile } from 'node:fs/promises';

export async function getLines(url) {
  const data = await readFile(url, 'utf-8');
  const lines = data.split('\n');
  return lines;
}

export function ints(str) {
  return str.match(/(?:(?<!\d)-)?\d+/g)?.map(Number);
}

export function makeMatrix(length, height, fill) {
  const matrix = [];

  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < length; j++) {
      row.push(fill);
    }
    matrix.push(row);
  }

  return matrix;
}

export function cloneMatrix(matrix) {
  const newMatrix = [];
  for (let i = 0; i < matrix.length; ++i) {
    if (Array.isArray(matrix[i])) newMatrix[i] = cloneMatrix(matrix[i]);
    else newMatrix[i] = matrix[i];
  }
  return newMatrix;
}

export function cloneObj(obj) {
  const newObj = {}

  for (const key of Object.keys(obj)) {
    newObj[key] = obj[key];
  }

  return newObj;
}

export function filterMap(arr, filterFn, mapFn) {
  const res = [];
  for (let i = 0; i < arr.length; ++i) {
    if (filterFn(arr[i])) res.push(mapFn(arr[i]));
  }
  return res;
}

export function rangeUnion(ranges) {
  const sorted = cloneMatrix(ranges).sort((a, b) => a[0] - b[0]);
  const union = [];

  for (const [start, end] of sorted) {
    if (union.length && union[union.length - 1][1] >= start - 1) {
      // following if is to avoid entirely contained ranges
      if (union[union.length - 1][1] < end) {
        union[union.length - 1] = [union[union.length - 1][0], end];
      }
    } else {
      union.push([start, end]);
    }
  }

  return union;
}

export function has(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function max(arr, cb) {
  const transform = cb ? cb : x => x;
  return arr.reduce((acc, cur) => {
    const val = transform(cur);
    const accVal = transform(acc);
    return accVal > val ? acc : cur;
  }, -Infinity);
}

export function min(arr, cb) {
  const transform = cb ? cb : x => x;
  return arr.reduce((acc, cur) => {
    const val = transform(cur);
    const accVal = transform(acc);
    return accVal < val ? acc : cur;
  }, Infinity);
}

export function minmax(arr, cb) {
  if (!arr.length) throw new Error('arr is empty noob');

  const transform = cb ? cb : x => x;

  const first = transform(arr[0]);
  let min = first;
  let max = first;

  for (let i = 1; i < arr.length; ++i) {
    const val = transform(arr[i]);
    if (val < min) min = val;
    else if (val > max) max = val;
  }

  return [min, max];
}

export function findLastIndex(arr, cb) {
  for (let i = arr.length - 1; i >= 0; --i) {
    if (cb(arr[i])) return i;
  }

  return -1;
}
