import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/24.txt';
// URL = './inputs/t.txt';

const AND = 'AND';
const OR = 'OR';
const XOR = 'XOR';

class Node {
  constructor(key) {
    this.key = key;
    this.inputs = [];
    this.outputs = [];
    this.command = undefined;
  }
}

export async function run() {
  const lines = (await getLines(URL)).map(line => line.trimEnd());
  const presets = [];
  const instructions = [];
  const registers = {};
  const nodeMap = {};
  const outputs = [];
  const intermediateNodes = [];

  const handleAnd = (a, b, output) => registers[output] = Number(registers[a] && registers[b]);
  const handleOr = (a, b, output) => registers[output] = Number(registers[a] || registers[b]);
  const handleXor = (a, b, output) => registers[output] = Number(registers[a] ^ registers[b]);
  const handle = {
    [AND]: handleAnd,
    [OR]: handleOr,
    [XOR]: handleXor,
  };

  const binToDec = (str) => {
    let num = 0;

    for (let digit = 0; digit < str.length; digit++) {
      let index = str.length - digit - 1;
      if (str[index] === '1') num += 2 ** digit;
    }

    return num;
  }

  const getOrMake = (key) => {
    if (!has(nodeMap, key)) nodeMap[key] = new Node(key);
    return nodeMap[key];
  }

  const handleNode = (node) => {
    if (!node.inputs.length) return;
    const [a, b] = node.inputs;
    handleNode(a);
    handleNode(b);
    handle[node.command](a.key, b.key, node.key);
  }

  const getStr = (char) => Object.keys(registers)
    .filter(key => key.startsWith(char))
    .toSorted((a, b) => b.localeCompare(a))
    .map(key => registers[key])
    .join('');

  const getNum = (char) => binToDec(getStr(char));

  const prepare = () => {
    let isPreset = true;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === '') isPreset = false;
      else if (isPreset) presets.push(lines[i]);
      else instructions.push(lines[i]);
    }

    for (const line of presets) {
      const [key, val] = line.split(': ');
      registers[key] = Number(val);
    }

    for (const instr of instructions) {
      const [pre, output] = instr.split(' -> ');
      const [a, command, b] = pre.split(' ');
      const outputNode = getOrMake(output);
      const aNode = getOrMake(a);
      const bNode = getOrMake(b);

      outputNode.inputs = [aNode, bNode];
      outputNode.command = command;
      aNode.outputs.push(outputNode);
      bNode.outputs.push(outputNode);
      if (output.startsWith('z')) outputs.push(outputNode);
      else intermediateNodes.push(outputNode);
    }
  }

  const test = () => {
    for (const outputNode of outputs) {
      handleNode(outputNode);
    }

    const actual = getNum('z');

    log(`We got ${actual}, so we're off by ${expected - actual}`);
  }

  prepare();

  const x = getNum('x');
  const y = getNum('y');
  const expected = x + y;

  log(`${x} + ${y} = ${expected}`);

  test();

  // for (let i = 0; i < 45; i++) {
  //   const str = i < 10 ? `0${i}` : `${i}`;
  //   const nodeSet = getConnectedGraphByNum(str);
  //   log(`${str}: ${nodeSet.size}`);
  // }

  // OK, brute force definitely isn't going to work.
  // Interesting note, `getConnectedGraphByNum` actually gives us 312 for every single num
  /*
    We can try to work backwards
    y00 XOR x00 -> z00
    OK that's actually an obvious swap, z00 needs to swap with nqp
    because currently nqp is x00 AND y00, and z00 is y00 XOR x00
    z01 however is made up of fht XOR nqp
    fht is x01 XOR y01
    nqp, once swapped with z00, is y00 XOR x00
    OH -- WOW. GOOD CATCH.
    The example is ANDing. But we really are supposed to ADD, as expected. Wow!!! Talk about a trap.
    We are adding two 45-bit numbers into a 46-bit number.
    We have 222 instructions, which is 5 ops each for 44 full-adders + 2 ops for one half-adder
    Therefore everything is actually exactly as it needs to be, there's no extra to confuse us
    The least significant digit, which has no carry-in, takes two inputs, x00 and y00
    z00 = x00 XOR y00
    c00 = x00 AND y00
    Now for the next digit, which has a carry-in C00 and two more inputs, x01 and y01
    z01 = (x01 ^ y01) ^ c00
    c01 = (x01 & y01) | (c00 AND (x01 ^ y01));
  */

    const assertFirstValid = () => {
      const node = getOrMake('z00');
      const expectedInput = getOrMake('x00');
      const expectedInput2 = getOrMake('y00');
      return (
        node.inputs.includes(expectedInput) &&
        node.inputs.includes(expectedInput2) &&
        node.command === XOR
      );
    }

    // const swap = (aOut, aIn1, aIn2, bOut, bIn1, bIn2) => {
      
    //   a.inputs = b.inputs;
    //   a.outputs = b.outputs;
    //   b.inputs = aInputs;
    // }

    const getOther = (arr, first) => {
      const index = arr.indexOf(first);
      if (index === -1) return undefined;
      return arr[index === 0 ? 1 : 0];
    }

    const validate = () => {
      const carries = [];
      carries.push(getOrMake('nqp'));

      for (let i = 1; i < 45; i++) {
        const str = i < 10 ? `0${i}` : `${i}`;
        const x = getOrMake(`x${str}`);
        const y = getOrMake(`y${str}`);
        const z = getOrMake(`z${str}`);
        const carryIn = carries[carries.length - 1];
        if (z.command !== XOR) {
          log(`We have failed at ${i} because ${z.key} is not XOR`);
          return;
        }
        // carryIn should be used twice: once as a component of z01, once as a component to generate a carryout
        // We'll have to validate that the carryout is used currently as part of the next round
        // But we can validate that it's *made* correctly right now
        // The other input should be x ^ y
        const otherInput = getOther(z.inputs, carryIn);
        if (!otherInput) {
          log(`We have failed at ${i} due to carryIn ${carryIn.key} not being an input to ${z.key}`);
          return;
        }
        if (otherInput.command !== XOR) {
          log(`We have failed at ${i} because ${otherInput.key} is not XOR`);
          return;
        }
        if (!(otherInput.inputs.includes(x) && otherInput.inputs.includes(y))) {
          log(`We have failed at ${i} because ${otherInput.key} doesn't contain ${x.key} and ${y.key}`);
          return;
        }

        // z is now validated, we need to validate that the carryout is constructed properly.
        // otherInput (x ^ y) is now ANDed with the carryIn
        const carryOutPartTwo = getOther(carryIn.outputs, z);
        if (!carryOutPartTwo) {
          log(`we have failed at ${i} due to ${carryIn.key} not having another output besides ${z.key}`);
          return;
        }
        if (carryOutPartTwo.command !== AND) {
          log(`we have failed at ${i} due to ${carryOutPartTwo.key} is not AND`);
          return;
        }
        if (getOther(carryOutPartTwo.inputs, carryIn) !== otherInput) {
          log(`we have failed at ${i} due to ${carryOutPartTwo.key}`);
          return;
        }
        const carryOut = carryOutPartTwo.outputs[0];
        if (carryOutPartTwo.outputs.length > 1) {
          log(`${carryOutPartTwo.key} shouldn't have more than one output`);
          return;
        }
        // carryOutPartOne should be x & y
        // carryOut should be carryOutPartOne | carryOutPartTwo
        const carryOutPartOne = getOther(carryOut.inputs, carryOutPartTwo);
        if (carryOut.command !== OR) {
          log(`${carryOut.key} should be OR`);
          return;
        }
        if (!carryOutPartOne) {
          log(`${carryOut.key} should have two children`);
          return;
        }
        if (carryOutPartOne.command !== AND) {
          log(`${carryOutPartOne.key} should be AND`);
          return;
        }
        if (!(carryOutPartOne.inputs.includes(x) && carryOutPartOne.inputs.includes(y))) {
          log(`We have failed at ${i} because ${carryOutPartOne.key} doesn't contain ${x.key} and ${y.key}`);
          return;
        }
        carries.push(carryOut);
      }
    }

    log(assertFirstValid());
    validate();
    test();
}

export default run;
