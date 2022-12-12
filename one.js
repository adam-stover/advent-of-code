import { run } from './helpers.js';

const URL = './inputs/one.txt';

export async function dayOne() {
  const elves = [[]];

  const processLine = (line) => {
    if (line === '') {
        elves.push([]);
    } else {
        elves[elves.length - 1].push(line);
    }
  }

  await run(processLine, URL);

  const topThree = counts.reduce((acc, cur) => {
    const [first, second, third] = acc;
    if (cur > first) {
        return [cur, first, second];
    }
    if (cur > second) {
        return [first, cur, second];
    }
    if (cur > third) {
        return [first, second, cur];
    }
  }, [0, 0, 0]);

  console.log(topThree[0]);

  console.log(topThree.reduce((acc, cur) => acc + cur));
}

export default dayOne;
