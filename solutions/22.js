import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

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

  const thing = (secret) => {
    let res = secret;
    for (let i = 0; i < NUM_SECRETS; i++) {
        res = getNext(res);
    }
    return res;
  }

//   const sequences = [];

//   for (let i = 0; )

  const res = lines.reduce((acc, cur) => {
    const secret = thing(ints(cur)[0]);
    log(secret);
    return acc + secret;
  }, 0);

  log(res);
}

export default run;
