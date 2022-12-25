import { getLines, ints } from '../utils.js';

const URL = './inputs/21.txt';

const parseMonkey = str => {
  return ints(str)?.[0] ?? str.split(' ');
}

const getMonkeySum = (name, monkeys) => {
  const monkeyVal = monkeys[name];
  if (typeof monkeyVal === 'number') return monkeyVal;
  const val = parseMonkey(monkeyVal);

  if (typeof val === 'number') return val;

  const [a, operator, b] = val;

  const aSum = getMonkeySum(a, monkeys);
  const bSum = getMonkeySum(b, monkeys);

  let res;

  if (operator === '+') res = aSum + bSum;
  else if (operator === '-') res = aSum - bSum;
  else if (operator === '*') res = aSum * bSum;
  else res = aSum / bSum;

  // monkeys[name] = res;
  return res;
}

const getRootSum = (monkeys) => getMonkeySum('root', monkeys);

const getChildren = (name, monkeys) => {
  const monkeyVal = monkeys[name];
  if (typeof monkeyVal === 'number') return false;
  const val = parseMonkey(monkeyVal);
  if (typeof val === 'number') return false;
  const [a, _, b] = val;
  return [a, b];
}

const isHumnInBranch = (name, monkeys) => {
  const children = getChildren(name, monkeys);
  if (!children) return false;
  const [a, b] = children;
  if (a === 'humn' || b === 'humn') return true;
  return isHumnInBranch(a, monkeys) || isHumnInBranch(b, monkeys);
}

const getHumnVal = (name, target, monkeys) => {
  const [a, operator, b] = parseMonkey(monkeys[name]);

  if (a === 'humn') {
    const bSum = getMonkeySum(b, monkeys);
    if (operator === '+') {
      return target - bSum;
    } else if (operator === '-') {
      return target + bSum;
    } else if (operator === '*') {
      return target / bSum;
    } else {
      return target * bSum;
    }
  } else if (b === 'humn') {
    const aSum = getMonkeySum(a, monkeys);
    if (operator === '+') {
      return target - aSum;
    } else if (operator === '-') {
      return aSum - target;
    } else if (operator === '*') {
      return target / aSum;
    } else {
      return aSum / target;
    }
  }

  if (isHumnInBranch(a, monkeys)) {
    const bSum = getMonkeySum(b, monkeys);
    if (operator === '+') {
      return getHumnVal(a, target - bSum, monkeys);
    } else if (operator === '-') {
      return getHumnVal(a, target + bSum, monkeys);
    } else if (operator === '*') {
      return getHumnVal(a, target / bSum, monkeys);
    } else {
      return getHumnVal(a, target * bSum, monkeys);
    }
  } else {
    const aSum = getMonkeySum(a, monkeys);
    if (operator === '+') {
      return getHumnVal(b, target - aSum, monkeys);
    } else if (operator === '-') {
      return getHumnVal(b, aSum - target, monkeys);
    } else if (operator === '*') {
      return getHumnVal(b, target / aSum, monkeys);
    } else {
      return getHumnVal(b, aSum / target, monkeys);
    }
  }
}

const checkRootEquality = (monkeys) => {
  const [a, _, b] = monkeys.root.split(' ');

  const aSum = getMonkeySum(a, monkeys);
  const bSum = getMonkeySum(b, monkeys);

  return aSum - bSum;
}

export default async function dayTwentyOne() {
  const lines = await getLines(URL);

  const monkeys = {};

  for (let i = 0; i < lines.length; ++i) {
    const [name, rest] = lines[i].split(': ');
    monkeys[name] = rest;
  }

  // console.log(getRootSum(monkeys));

  const [a, b] = getChildren('root', monkeys);

  const humnVal = isHumnInBranch(a, monkeys)
    ? getHumnVal(a, getMonkeySum(b, monkeys), monkeys)
    : getHumnVal(b, getMonkeySum(a, monkeys), monkeys);

  console.log(humnVal);
}
