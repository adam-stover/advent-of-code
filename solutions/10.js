import { getLines } from '../helpers.js';

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

// const getXAtCycle = (targetCycle, instructions) => {
//   let x = 1;
//   let cycle = 1;
//   let currentInstructionIndex = 0;
//   let midInstruction = false;

//   while (cycle < targetCycle) {
//     // console.log(cycle);
//     cycle++;
//     const [op, val] = instructions[currentInstructionIndex].split(' ');

//     if (op === 'addx') {
//       if (!midInstruction) {
//         midInstruction = true;
//       } else {
//         x += Number(val);
//         midInstruction = false;
//         currentInstructionIndex++;
//       }
//     } else {
//       currentInstructionIndex++;
//     }
//   }

//   return x;
// }

// const getSignalStrengthAtCycle = (cycle, instructions) => {
//   return cycle * getXAtCycle(cycle, instructions);
// }

export default async function dayTen() {
  const instructions = await getLines(URL);

  const thing = new Thing(instructions);

  // const interestingCycles = [20, 60, 100, 140, 180, 220];

  // while (thing.cycle <= 220) {
  //   thing.step();
  //   if (interestingCycles.includes(thing.cycle)) console.log(thing.signalStrength());
  // }

  // interestingCycles.forEach(cycle => {
  //   console.log(getSignalStrengthAtCycle(cycle, instructions));
  // })

  // const signalSum = interestingCycles.reduce((acc, cur) => acc + getSignalStrengthAtCycle(cur, instructions), 0);

  // console.log(signalSum)

  while (!thing.isDone()) {
    thing.step();
  }

  thing.printScreen();
}
