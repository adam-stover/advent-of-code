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
