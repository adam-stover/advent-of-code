import { getLines } from '../utils.js';

const URL = './inputs/1.txt';

function processData(lines) {
  const elves = [[]];
  for (const line of lines) {
    if (line === '') {
      elves.push([]);
    } else {
        elves[elves.length - 1].push(line);
    }
  }
  return elves;
}

export async function dayOne() {
  const lines = await getLines(URL);

  const elves = processData(lines);

  const counts = elves.map(elf => elf.reduce((acc, cur) => acc + Number(cur), 0));

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
    return acc;
  }, [0, 0, 0]);

  console.log(topThree[0]);

  console.log(topThree.reduce((acc, cur) => acc + cur));
}

export default dayOne;
