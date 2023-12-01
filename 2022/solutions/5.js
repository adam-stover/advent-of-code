import { getLines } from '../../utils.js';

const URL = './inputs/5.txt';

export default async function dayFive() {
  const lines = await getLines(URL);
  const stackLines = lines.slice(0, 8);
  const instructions = lines.slice(10);
  const stacks = [];

  for (let i = 0; i < 9; ++i) stacks.push([]);

  for (let i = stackLines.length - 1; i >= 0; --i) {
    const line = stackLines[i];
    for (let j = 0; j < stacks.length; j++) {
      const item = line[1 + j * 4];
      if (item !== ' ') stacks[j].push(item);
    }
  }

  for (let i = 0; i < instructions.length; ++i) {
    const [_, count, __, originIndex, ___, destinationIndex] = instructions[i].split(' ').map(Number);
    const origin = stacks[originIndex - 1];
    const destination = stacks[destinationIndex - 1];
    const tempStack = [];

    // for (let j = 0; j < count; ++j) {
    //   destination.push(origin.pop());
    // }

    for (let j = 0; j < count; ++j) {
      tempStack.push(origin.pop());
    }

    while (tempStack.length) {
      destination.push(tempStack.pop());
    }
  }

  const topCrates = stacks.map(stack => stack[stack.length - 1]).join('');
  console.log(topCrates);
}
