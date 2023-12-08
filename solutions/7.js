import { getLines, ints, count, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex } from '../utils.js';

const URL = './inputs/7.txt';

const strength = (card) => {
  return {
    'A': 14,
    'K': 13,
    'Q': 12,
    'J': 1,
    'T': 10,
  }[card] || Number(card);
}

const type = (hand) => {
  const uniqs = [...new Set(hand)];
  const counts = uniqs.map(x => count(hand, x));
  const [maxCount, secondMax] = maxTwo(counts);
  // console.log(counts);
  // console.log(`max: ${maxCount} -- ${secondMax}`)
  if (maxCount === 5) return 7;
  if (maxCount === 4) return 6;
  if (maxCount === 3) {
    if (secondMax === 2) return 5;
    return 4;
  }
  if (maxCount === 2) {
    if (secondMax === 2) return 3;
    return 2;
  }
  return 1;
  // if (uniqs.length === 1) return 7;
  // if (uniqs.length === 2) {
  //   if (counts.includes(4)) return 6;
  //   return 5;
  // }
  // if (uniqs.length === 3) {
  //   if (counts.includes(3)) return 4;
  //   return 3;
  // }
  // if (uniqs.length === 4) return 2;
  // return 1;
}

const _type = (hand) => {
  const jackCount = count(hand, 'J');
  if (!jackCount) return type(hand);
  if (jackCount >= 4) return 7;
  const jackless = [];
  for (let i = 0; i < hand.length; i++) {
    if (hand[i] !== 'J') jackless.push(hand[i]);
  }
  const uniqs = [...new Set(jackless)];
  const counts = uniqs.map(x => count(jackless, x));
  let [maxCount, secondMax] = maxTwo(counts);
  if (maxCount < 0) maxCount = 0;
  if (secondMax < 0) secondMax = 0;
  maxCount += jackCount;
  if (maxCount === 5) return 7;
  if (maxCount === 4) return 6;
  if (maxCount === 3) {
    if (secondMax === 2) return 5;
    return 4;
  }
  if (maxCount === 2) {
    if (secondMax === 2) return 3;
    return 2;
  }
  return 1;
}

const better = (a, b) => {
  const ta = _type(a);
  const tb = _type(b);
  if (ta < tb) return -1;
  if (ta > tb) return 1;
  for (let i = 0; i < a.length; i++) {
    const ca = a[i];
    const cb = b[i];
    if (ca === cb) continue;
    if (strength(ca) < strength(cb)) return -1;
    if (strength(ca) > strength(cb)) return 1;
    console.log('should not be here');
    console.log(ca);
    console.log(cb);
  }
}

const sortCards = (a, b) => {
  const [handA] = a.split(' ');
  const [handB] = b.split(' ');
  return better(handA, handB);
}

export async function daySeven() {
  const lines = await getLines(URL);

  let sum = 0;

  const ranked = lines.sort(sortCards);

  for (let i = 0; i < ranked.length; i++) {
    const line = ranked[i];

    const [_hand, bid] = line.split(' ');

    sum += (i + 1) * bid;
  }

  console.log(ranked.slice(0, 5));

  console.log(sum);
}

// 254038707 is WRONG

export default daySeven;
