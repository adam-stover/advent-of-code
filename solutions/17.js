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
        log(`${b} % 8 is ${b % 8} which does not equal ${output} from ${testingA}`)
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

  const runBackwardsList = (aendList, output) => {
    const runForwards = (testingA) => {
      let a = testingA;
      let b = a % 8;
      b = b ^ 3;
      let c = Math.floor(a / (2**b));
      b = b ^ c;
      a = Math.floor(a / 8);
      b = b ^ 5;
      if (b % 8 === output && aendList.includes(a)) return true;
      return false;
    }

    const opts = [];

    for (let a = aendList[0] * 8; a < aendList[aendList.length - 1] * 8 + 8; a++) {
      if (runForwards(a)) opts.push(a);
    }

    return opts;
  }

  let targets = [0];
  const targetOutputs = instructions;
  log(targetOutputs);

  for (let i = targetOutputs.length - 1; i >= 0; i--) {
    const targetOutput = targetOutputs[i];
    log(`Processing instruction ${i} with target ${targetOutput} we have ${targets.length} options for A to end at: ${targets.join(',')}`);
    targets = targets.flatMap(targetA => runBackwards(targetA, targetOutput));
    // targets = runBackwardsList(targets, targetOutput);

    if (!targets.length) {
      log(`We have failed at outputting ${targetOutputs[i]} at ${i}`);
      break;
    }
  }

  if (targets.length) log(targets);

  // let starta = 5034303167;
  // let starta = 10056599953087;
  // let starta = 202464959;
  // // let starta = 89791;
  // let output = run(starta, startb, startc);
  // const closeAnswers = [];
  // // const INCREMENT = 8;
  // const INCREMENT = 268435456;
  // // const INCREMENT = 33554432;
  // // const INCREMENT = 524288;
  // // const INCREMENT = 268435374;
  // // const ALT_INC = 82;
  // log(program);
  // log(`starting from ${starta} and incrementing by ${INCREMENT}`)

  // let i = 1;
  // while (output !== program && starta < Number.MAX_SAFE_INTEGER && starta > 0) {
  //   if (output.length > 27) {
  //     log(`${output} from ${starta}, which has ${starta % 8}`);
  //     closeAnswers.push(starta);
  //   }
  //   starta += INCREMENT;
  //   // starta += i++ % 2 === 0 ? INCREMENT : ALT_INC;
  //   output = run(starta, startb, startc);
  // }
  // if (starta < Number.MAX_SAFE_INTEGER) {
  //   log(starta);
  // } else {
  //   log(`${starta} exceeded ${Number.MAX_SAFE_INTEGER}`)
  // }
  // log(closeAnswers);
  // log(diff(closeAnswers))

  // 6108044908 is first to hit 2,4,1,3,7,5,4,2,0,3
  // 6108044991
  // 6376480365
  // 6376480447

  // 2097152
  // 2890400
  // 202464877
  // 202464959
  // 210853485
  // 210853567
  // 212950637
  // 212950719
  // 227630701, which has 5
  // 227630783, which has 7
  // 229727853, which has 5
  // 229727935, which has 7
  // 470900333, which has 5
  // 470900415, which has 7
  // 739335789
  // 739335871
  // 189425254400
  // 9007199254740991
  // 1158593196595872
  // 4958505382189728
  // 9007199254740991 is max_safe_int
  // 11713904823245472

  // OK so no matter what, we always:
  // get a 2-4: BST which gets the value in A % 8 and stores it in B
  // Then we get a 1-3, which takes a bitwise XOR of B and 3 and stores it in b
  // So, for the diff values of A % 8:
  // 0: 3
  // 1: 2
  // 2: 1
  // 3: 0
  // 4: 7
  // 5: 6
  // 6: 5
  // 7: 4
  // Then we get a 7-5, which sets C = Math.floor(A / 2**B)
  // Then we get a 4-2, which sets B = B XOR C
  // Then we get a 0-3, which sets A = Math.floor(A / 8)
  // Then we get a 1-5, which sets B = B XOR 5
  // Then we get a 5-5, which outputs B % 8
  // Then we get a 3-0, which jumps to beginning unless A is 0

  // Let's go backwards
  // The program must *finish*
  // That means a must equal 0
  // The only actual output is B % 8
  // So to finish, B % 8 must equal 0
  // Before that, B XOR 5 is set in B
  // So (B XOR 5) % 8 === 0
  // So B could be 5, 13, 21, 29, etc.
  // Before that, we set A to 0. To do this, A must be between 0 and 7 already.
  // Before this, we set B to 5, 13, 21, etc. To do this, we do B XOR C
  // There are many ways this could occur, but easiest is for B to already be what it's supposed to be, and C to be a multiple of 8
  // Before this, we set C to Math.floor(A / 2**B)
  // prevc = Math.floor(A / 2**prevB)
  // 5 = prevb XOR prevc
  // We know A must be between 1 and 7
  // Example solution at this state: A is 6, B is 5, C gets set to 0
  // For B to be 5, it would have to have previously been 6
  // for B to have previously been 6, A % 8 must be 6
  // So starting point for the final round: A6, B?, C?
  // Every round, the only starting thing that matters is A
  // And the only thing that matters when we end is B and A
  // So for final round, we need B % 8 to equal 0, and A to equal 0
  // For penultimate round, we need B % 8 to equal 3, and A to equal 6
}

export default run;
