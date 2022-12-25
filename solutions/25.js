import { cloneObj, getLines, ints, max } from '../utils.js';

const URL = './inputs/25.txt';

const SNAFU_MAP = {
  '2': 2,
  '1': 1,
  '0': 0,
  '-': -1,
  '=': -2,
};

const convertSnafuDec = (snafu) => {
  let res = 0;
  for (
    let i = snafu.length - 1, pos = 1;
    i >= 0;
    i--, pos *= 5
  ) {
    res += SNAFU_MAP[snafu[i]] * pos;
  }

  return res;
}

const maxWithDigits = (digits) => {
  let max = 0;
  for (let i = 0; i < digits; i++) {
    max += (5 ** i) * 2;
  }
  return max;
}

const convertDecSnafu = (dec) => {
  let res = '';
  let i = 1;
  while (maxWithDigits(i + 1) < dec) {
    i++;
  }

  while (i >= 0) {
    const unit = 5 ** i;
    const maxOneLess = maxWithDigits(i);

    if (dec >= unit * 2 - maxOneLess) {
      res += '2';
      dec -= unit * 2;
    } else if (dec >= unit - maxOneLess) {
      res += '1';
      dec -= unit;
    } else if (Math.abs(dec) >= unit * 2 - maxOneLess) {
      res += '=';
      dec += unit * 2;
    } else if (Math.abs(dec) >= unit - maxOneLess) {
      res += '-';
      dec += unit;
    } else {
      res += '0';
    }

    i--;
  }
  return res;
}

export default async function dayTwentyFive() {
  const lines = await getLines(URL);

  let sum = 0;

  for (const line of lines) {
    sum += convertSnafuDec(line);
  }

  console.log(sum);

  const reverse = convertDecSnafu(sum);
  console.log(reverse);
}
