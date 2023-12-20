import { getLines, log, ints, diff, gcd, lcm, count, makeArray, makeDeepMatrix, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep, hexToDec, MinHeap } from '../utils.js';

let URL = './inputs/20.txt';
// URL = './inputs/t.txt';

const OFF = 0;
const ON = 1;
const LOW = 2;
const HIGH = 3;
const BROADCASTER = 'broadcaster';
const FLIP_FLOP = '%';
const CONJUNCTION = '&';

export async function dayTwenty() {
  const rows = await getLines(URL);

  let modules = {};
  let conjs = {};

  const process = (row) => {
    let [name, outputs] = row.split(' -> ');
    outputs = outputs.split(', ');

    if (name === BROADCASTER) modules.broadcaster = {
      type: BROADCASTER,
      name: BROADCASTER,
      outputs,
    }
    else {
      const type = name[0];
      name = name.slice(1);
      if (type === FLIP_FLOP) modules[name] = {
        type: FLIP_FLOP,
        name,
        state: OFF,
        outputs,
      };
      else {
        modules[name] = {
          type: CONJUNCTION,
          name,
          outputs,
          inputs: {},
        };
        conjs[name] = modules[name];
      }
    }
  }

  rows.forEach(process);

  for (const mod of Object.values(modules)) {
    for (const output of mod.outputs) {
      if (has(conjs, output)) conjs[output].inputs[mod.name] = LOW;
    }
  }

  const queue = [];
  const FINAL = 'rx';

  const handlePulse = (input, output, pulse) => {
    if (output === FINAL && pulse === LOW) return true;
    const mod = modules[output];
    if (!mod) {
      // log(`Hit output mod from ${input} with ${pulse}`);
    } else if (mod.type === BROADCASTER) {
      for (const out of mod.outputs) {
        queue.push([mod.name, out, pulse])
      }
    } else if (mod.type === FLIP_FLOP) {
      if (pulse === LOW) {
        mod.state = mod.state === OFF ? ON : OFF;
        const outPulse = mod.state === ON ? HIGH : LOW;
        for (const out of mod.outputs) {
          queue.push([mod.name, out, outPulse]);
        }
      }
    } else {
      mod.inputs[input] = pulse;
      const outPulse =  Object.values(mod.inputs).every(p => p === HIGH) ? LOW : HIGH;
      for (const out of mod.outputs) {
        queue.push([mod.name, out, outPulse]);
      }
    }
  }

  const button = () => {
    if (handlePulse(false, BROADCASTER, LOW)) return true;
    while (queue.length) {
      const params = queue.shift();
      if (handlePulse(...params)) return true;
    }
  }

  const COUNT = 1000000000;
  const importantInputs = Object.keys(modules.zr.inputs);
  for (let i = 1; i <= COUNT; i++) {
    if (button()) {
      log(`Took ${i} button presses.`)
      break;
    }
    if (i % 10000000 === 0) {
      log(`Pushed button ${i / 10000000} * 10 million times and NOTHING.`)
      for (const input of importantInputs) {
        log(modules[input].inputs)
      }
    }
  }

  // console.log(modules);
  // log(lowPulses);
  // log(highPulses);
  // log(lowPulses * highPulses);
}

export default dayTwenty;
