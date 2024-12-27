import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/25.txt';
// URL = './inputs/t.txt';

const PIN = '#';
const GAP = '.';

export async function run() {
  const lines = (await getLines(URL)).map(line => line.trim());

  const prep = () => {
    const locks = [];
    const keys = [];

    let lastIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === '') {
        const entity = lines.slice(lastIndex, i);
        lastIndex = i + 1;
        if (entity[0][0] === PIN) locks.push(entity);
        else keys.push(entity);
      }
    }

    const lastEntity = lines.slice(lastIndex);
    if (lastEntity[0][0] === PIN) locks.push(lastEntity);
    else keys.push(lastEntity);

    return [locks, keys];
  }

  const doesKeyFitLock = (key, lock) => {
    for (let i = 0; i < key.length; i++) {
      for (let j = 0; j < key[0].length; j++) {
        if (key[i][j] === PIN && lock[i][j] === PIN) return false;
      }
    }

    return true;
  }

  const [locks, keys] = prep();

  let count = 0;

  for (const key of keys) {
    for (const lock of locks) {
      if (doesKeyFitLock(key, lock)) count++;
    }
    // if (locks.some(lock => doesKeyFitLock(key, lock))) count++;
  }

  log(count);
}

export default run;
