import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/19.txt';
// URL = './inputs/t.txt';

export async function run() {
  const lines = await getLines(URL);

  const towels = lines[0].split(', ');
  const designs = lines.slice(2);

  const memo = (() => {
    const cache = {};

    return (d) => {
      if (!has(cache, d)) cache[d] = howManyDesignTowels(d);
      return cache[d];
    }
  })();

  const canDesignTowel = (design) => {
    if (design === '') return true;
    const startingOptions = towels.filter(t => design.startsWith(t));

    return startingOptions.some(opt => {
      const subdesign = design.slice(opt.length);
      return canDesignTowel(subdesign);
    });
  }

  const howManyDesignTowels = (design) => {
    if (design === '') return 1;

    const startingOptions = towels.filter(t => design.startsWith(t));

    return startingOptions.reduce((acc, cur) => {
      const subdesign = design.slice(cur.length);

      return acc + memo(subdesign);
    }, 0);
  }

  let count = 0;

  // for (const d of designs) {
  //   if (canDesignTowel(d)) count++;
  // }

  for (const d of designs) {
    count += memo(d);
  }

  log(count);
}

export default run;
