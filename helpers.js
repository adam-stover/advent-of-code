import { readFile } from 'node:fs/promises';

export async function getLines(url) {
  const data = await readFile(url, 'utf-8');
  const lines = data.split('\n');
  return lines;
}
