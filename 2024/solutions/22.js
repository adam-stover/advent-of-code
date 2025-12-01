import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log, diff, intersection } from '../utils.js';

let URL = './inputs/22.txt';
// URL = './inputs/t.txt';

const MOD_FACTOR = 16777216;
const NUM_SECRETS = 2000;

export async function run() {
  const lines = await getLines(URL);

  let sum = 0;

  const prune = (num) => {
    return num % MOD_FACTOR;
  }

  const mix = (secret, mix) => {
    return (secret ^ mix) >>> 0;
  }

  const getNext = (secret) => {
    let next = secret * 64;
    next = mix(secret, next);
    next = prune(next);
    let x = Math.floor(next / 32);
    next = mix(next, x);
    next = prune(next);
    x = next * 2048;
    next = mix(next, x);
    next = prune(next);
    return next;
  }

  const secretSequences = [];

  for (let i = 0; i < lines.length; i++) {
    const sequence = [ints(lines[i])[0]];
    for (let i = 0; i < NUM_SECRETS; i++) {
        const last = sequence[sequence.length - 1];
        sequence.push(getNext(last));
    }
    secretSequences.push(sequence);
  }

  const priceSequences = [];

  for (const sequence of secretSequences) {
    const prices = [];
    for (const secret of sequence) {
        const price = secret % 10;
        prices.push(price);
    }
    priceSequences.push(prices);
  }

  const changeSequences = priceSequences.map(diff);
  log(changeSequences[0].length)


  const allChanges = {};

  for (let i = 0; i < changeSequences.length; i++) {
    const changeSequence = changeSequences[i];
    const priceSequence = priceSequences[i];

    const set = new Set();

    for (let j = 4; j <= changeSequence.length; j++) {
        const price = priceSequence[j];
        const str = changeSequence.slice(j - 4, j).join('');
        if (!set.has(str)) {
            if (!has(allChanges, str)) {
                allChanges[str] = price;
            } else {
                allChanges[str] += price;
            }
            set.add(str);
        }
    }
  }

  const best = max(Object.values(allChanges));

  log(best);

  // 1909 is not right
  // 2077 is too high
}

export default run;
