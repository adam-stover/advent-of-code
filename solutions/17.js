import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, diff, log } from '../utils.js';

let URL = './inputs/17.txt';
// URL = './inputs/t.txt';

const ADV = 0;
const BXL = 1;
const BST = 2;
const JNZ = 3;
const BXC = 4;
const OUT = 5;
const BDV = 6;
const CDV = 7;

export async function run() {
  const lines = await getLines(URL);

  // const starta = ints(lines[0])[0];
  const startb = ints(lines[1])[0];
  const startc = ints(lines[2])[0];

  const instructions = ints(lines[4]);
  const program = instructions.join(',');

  const run = (a1, b1, c1) => {
    let a = a1;
    let b = b1;
    let c = c1;
    const outputs = [];
    let p = 0;

    const getCombo = (input) => {
      if (input === 0) return 0;
      if (input === 1) return 1;
      if (input === 2) return 2;
      if (input === 3) return 3;
      if (input === 4) return a;
      if (input === 5) return b;
      if (input === 6) return c;
      if (input === 7) throw new Error('invalid');
    }

    while (p < instructions.length) {
      if (instructions[p] === ADV) {
        a = Math.floor(a / (2 ** getCombo(instructions[p + 1])));
        p += 2;
      } else if (instructions[p] === BXL) {
        b = b ^ instructions[p + 1];
        p += 2;
      } else if (instructions[p] === BST) {
        b = getCombo(instructions[p + 1]) % 8;
        p += 2;
      } else if (instructions[p] === JNZ) {
        if (a === 0) p += 2;
        else p = instructions[p + 1];
      } else if (instructions[p] === BXC) {
        b = b ^ c;
        p += 2;
      } else if (instructions[p] === OUT) {
        if (outputs.length >= instructions.length) return outputs.join(',');
        const res = getCombo(instructions[p + 1]) % 8;
        if (res !== instructions[outputs.length]) {
          if (outputs.length > 13) log(`${a}, ${b}, ${c}, and ${p}`)
          outputs.push(res);
          return outputs.join(',');
        }
        outputs.push(res);
        p += 2;
      } else if (instructions[p] === BDV) {
        b = Math.floor(a / (2 ** getCombo(instructions[p + 1])));
        p += 2;
      } else if (instructions[p] === CDV) {
        c = Math.floor(a / (2 ** getCombo(instructions[p + 1])));
        p += 2;
      } else {
        throw new Error('fail here');
      }
    }

    return outputs.join(',');
  }

  const runBackwardsTest = (aend, output) => {
    const runForwards = (testingA) => {
      let a = Math.floor(testingA / 8);
      if (a % 8 !== output) return false;
      if (a !== aend) return false;
      return true;
    }

    const opts = [];

    for (let a = aend * 8; a < aend * 8 + 8; a++) {
      if (runForwards(a)) opts.push(a);
    }

    return opts;
  }

  const runBackwards = (aend, output) => {
    // final step: A is aend
    // Second final step: B % 8 is output
    const runForwards = (testingA) => {
      let a = testingA;
      let b = a % 8;
      b = (b ^ 3) >>> 0;
      let c = Math.floor(a / (2**b));
      b = (b ^ c) >>> 0;
      a = Math.floor(a / 8);
      if (a !== aend) return false;
      b = (b ^ 5) >>> 0;
      if (b % 8 !== output) {
        // log(`${b} % 8 is ${b % 8} which does not equal ${output} from ${testingA}`)
        return false;
      }
      return true;
    }

    const opts = [];

    for (let a = aend * 8; a < aend * 8 + 8; a++) {
      if (runForwards(a)) opts.push(a);
    }

    return opts;
  }

  let targets = [0];
  const targetOutputs = instructions;
  log(program);

  for (let i = targetOutputs.length - 1; i >= 0; i--) {
    const targetOutput = targetOutputs[i];
    log(`Processing instruction ${i} with target ${targetOutput} we have ${targets.length} options for A to end at: ${targets.join(',')}`);
    targets = targets.flatMap(targetA => runBackwards(targetA, targetOutput));

    if (!targets.length) {
      log(`We have failed at outputting ${targetOutputs[i]} at ${i}`);
      break;
    }
  }

  if (targets.length) log(min(targets));
}

export default run;
