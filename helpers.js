import { open } from 'node:fs/promises';

export async function run(callback, url) {
  const file = await open(url);

  console.log(file);

  for await (const line of file.readLines()) {
    callback(line);
  }
}
