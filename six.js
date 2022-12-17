import { getLines } from './helpers.js';

const URL = './inputs/six.txt';

export default async function daySix() {
  const signal = (await getLines(URL))[0];

  for (let i = 14; i < signal.length; ++i) {
    const a = new Set(signal.slice(i - 14, i));
    if (a.size === 14) {
      console.log(i);
      break;
    }
  }
}