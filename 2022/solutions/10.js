import { getLines } from '../utils.js';

const URL = './inputs/10.txt';

class Thing {
  constructor(instructions) {
    this.instructions = instructions;
    this.cycle = 1;
    this.midInstruction = false;
    this.index = 0;
    this.xReg = 1;
    this.screen = [];

    this.WIDTH = 40;
    this.HEIGHT = 6;

    for (let i = 0; i < this.HEIGHT; ++i) {
      this.screen.push('');
    }

    this.row = 0;
  }

  draw() {
    if (Math.abs(this.xReg - this.screen[this.row].length) <= 1) {
      this.screen[this.row] += '#';
    } else {
      this.screen[this.row] += '.';
    }

    if (this.screen[this.row].length >= this.WIDTH) {
      this.row++;
    }
  }

  step() {
    this.draw();
    this.cycle++;
    const [op, val] = this.instructions[this.index].split(' ');

    if (op === 'noop') {
      this.index++;
      return;
    }

    if (!this.midInstruction) {
      this.midInstruction = true;
      return;
    }

    this.xReg += Number(val);
    this.midInstruction = false;
    this.index++;
  }

  signalStrength() {
    return this.cycle * this.xReg;
  }

  printScreen() {
    for (let i = 0; i < this.screen.length; ++i) {
      console.log(this.screen[i]);
    }
  }

  isDone() {
    return this.row === this.HEIGHT;
  }
}

export default async function dayTen() {
  const instructions = await getLines(URL);

  const thing = new Thing(instructions);
  // const interestingCycles = [20, 60, 100, 140, 180, 220];

  // let sum = 0;

  // while (thing.cycle <= 220) {
  //   thing.step();
  //   if (interestingCycles.includes(thing.cycle)) sum += thing.signalStrength();
  // }

  // console.log(sum);

  while (!thing.isDone()) {
    thing.step();
  }

  thing.printScreen();
}
