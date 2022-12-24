import { readFile } from 'node:fs/promises';

export async function getLines(url) {
  const data = await readFile(url, 'utf-8');
  const lines = data.split('\n');
  return lines;
}

export function ints(str) {
  return str.match(/(?:(?<!\d)-)?\d+/g).map(Number);
}

export function cloneMatrix(matrix) {
  const newMatrix = [];
  for (let i = 0; i < matrix.length; ++i) {
    const row = [];
    for (let j = 0; j < matrix[i].length; ++j) {
      row[j] = matrix[i][j];
    }
    newMatrix.push(row);
  }
  return newMatrix;
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
