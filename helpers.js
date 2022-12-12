import { open, readFile } from 'node:fs/promises';

export async function run(callback, url) {
  const data = await readFile(url, 'utf-8');
  const lines = data.split('\n');
  for (const line of lines) {
    callback(line);
  }
}
