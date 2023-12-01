import { getLines, ints } from '../utils.js';

const URL = './inputs/11.txt';

const getOpFn = (opLine) => {
  const rhs = opLine.split('new = old ')[1];

  let [operator, term] = rhs.split(' ');

  if (operator === '+') {
    if (term === 'old') return (old) => old + old;
    const numTerm = Number(term);
    return (old) => old + numTerm;
  } else {
    if (term === 'old') return (old) => old * old;
    const numTerm = Number(term);
    return (old) => old * numTerm;
  }
}

const getTestFn = (testLine, trueLine, falseLine) => {
  const divisibleBy = ints(testLine)[0];
  const ifTrue = ints(trueLine)[0];
  const ifFalse = ints(falseLine)[0];
  return (num) => (num % divisibleBy) === 0 ? ifTrue : ifFalse;
}

class Monkey {
  constructor(input, lcm) {
    const [nameLine, itemLine, opLine, testLine, trueLine, falseLine] = input;
    this.lcm = lcm;
    this.id = ints(nameLine)[0];
    this.items = ints(itemLine);
    this.op = getOpFn(opLine);
    this.test = getTestFn(testLine, trueLine, falseLine);

    this.inspectCount = 0;
  }

  step(monkeys) {
    const thrownList = [];
    for (let i = 0; i < this.items.length; ++i) {
      this.inspectCount++;
      this.items[i] = this.op(this.items[i]);
      this.items[i] = this.items[i] % this.lcm;
      // this.items[i] = Math.floor(this.items[i] / 3);
      const thrownTo = this.test(this.items[i]);
      this.throw(this.items[i], monkeys[thrownTo]);
      thrownList.push(i);
    }

    const newItems = [];
    let throwListIndex = 0;

    for (let i = 0; i < this.items.length; ++i) {
      if (i === throwListIndex) {
        throwListIndex++;
      } else {
        newItems.push(this.items[i]);
      }
    }

    this.items = newItems;
  }

  throw(item, monkey) {
    monkey.receive(item);
  }

  receive(item) {
    this.items.push(item)
  }
}

class Solution {
  constructor(input) {
    this.NUM_ROUNDS = 10000;
    this.round = 0;
    this.monkeys = [];

    let lcm = 1;

    for (let i = 3; i < input.length; i += 7) {
      const num = Number(input[i].split('divisible by ')[1]);
      lcm *= num;
    }

    for (let i = 0; i < input.length; i += 7) {
      this.monkeys.push(new Monkey(input.slice(i, i + 6), lcm));
    }
  }

  step() {
    this.round++;

    for (let i = 0; i < this.monkeys.length; ++i) {
      this.monkeys[i].step(this.monkeys);
    }
  }

  getInspectCounts() {
    return this.monkeys.map(monkey => monkey.inspectCount);
  }

  isDone() {
    return this.round >= this.NUM_ROUNDS;
  }
}

export default async function dayEleven() {
  const lines = await getLines(URL);
  const solution = new Solution(lines);

  while (!solution.isDone()) {
    solution.step();
  }

  const counts = solution.getInspectCounts();
  const highestCounts = [0, 0];

  for (let i = 0; i < counts.length; ++i) {
    if (counts[i] > highestCounts[0]) {
      highestCounts[1] = highestCounts[0];
      highestCounts[0] = counts[i];
    } else if (counts[i] > highestCounts[1]) {
      highestCounts[1] = counts[i];
    }
  }

  // console.log(counts);
  // console.log(highestCounts);
  console.log(highestCounts.reduce((acc, cur) => acc * cur));
}
