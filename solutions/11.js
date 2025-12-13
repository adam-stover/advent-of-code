import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/11.txt';
// URL = './inputs/t.txt';

class Node {
  constructor(name) {
    this.name = name;
    this.outputs = [];
  }

  addOutput(output) {
    this.outputs.push(output);
  }
}

export async function run1() {
  const lines = await getLines(URL);

  const nodes = {};

  for (let i = 0; i < lines.length; i++) {
    const [name, rest] = lines[i].split(':')
    const outputs = rest.slice(1).split(' ');
    nodes[name] = { name, outputs };
  }

  nodes['out'] = { name: 'out' };

  const you = nodes['you'];
  const paths = [];
  let numPaths = 0;

  const recurse = (start) => {
    if (start.name === 'out') return 1;
    return start.outputs.reduce((acc, cur) => acc + recurse(nodes[cur]), 0);
  }

  const res = recurse(you);
  log(res);
}

const YOU = 'svr';
const OUT = 'out';
const FFT = 'fft';
const DAC = 'dac';

export async function run() {
  const lines = await getLines(URL);

  const nodes = {};

  for (let i = 0; i < lines.length; i++) {
    const [name, rest] = lines[i].split(':')
    const outputs = rest.slice(1).split(' ');
    nodes[name] = { name, outputs, inputs: [] };
  }

  nodes['out'] = { name: 'out', outputs: [], inputs: [] };

  for (const node of Object.values(nodes)) {
    const { outputs } = node;
    for (let i = 0; i < outputs.length; i++) {
      nodes[outputs[i]].inputs.push(node.name);
    }
  }

  const fft = nodes[FFT];
  const dac = nodes[DAC];

  const fftLeadsToDac = (() => {
    const queue = [fft];
    const seen = new Set();
    while (queue.length) {
      const cur = queue.shift();
      const { name, outputs } = cur;
      if (seen.has(name)) continue;
      seen.add(name);
      if (name === DAC) return true;
      queue.push(...outputs.map(o => nodes[o]));
    }
    return false;
  })();

  log(fftLeadsToDac);

  const dacLeadsToFft = (() => {
    const queue = [dac];
    while (queue.length) {
      const cur = queue.shift();
      const { name, outputs } = cur;
      if (name === FFT) return true;
      queue.push(...outputs.map(o => nodes[o]));
    }
    return false;
  })();

  log(dacLeadsToFft);

  const getPaths = (a, b) => {
    const table = [{[a]: 1}];
    let paths = 0;
    do {
      const lastState = table[table.length - 1];
      const nodeNames = Object.keys(lastState);
      const nextState = {};
      for (const name of nodeNames) {
        if (name === b) {
          log(lastState);
          paths += lastState[name];
        } else {
          const node = nodes[name];
          const { outputs } = node;
          for (const output of outputs) {
            if (has(nextState, output)) nextState[output] += lastState[name];
            else nextState[output] = lastState[name];
          }
        }
      }
      table.push(nextState);
    } while (Object.keys(table[table.length - 1]).length);
    return paths;
  }
  const youfft = getPaths(YOU, FFT);
  log(youfft);
  const fftdac = getPaths(FFT, DAC);
  log(fftdac);
  const dacout = getPaths(DAC, OUT);
  log(dacout);
  log(youfft * fftdac * dacout);
  log(`but wait, what about ${getPaths(DAC, FFT)}`)

  // 243 is not right
}

export default run;
