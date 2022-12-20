import { getLines, filterMap } from "../utils.js";

const URL = './inputs/13.txt';

const compareInt = (left, right) => {
  if (left < right) return -1;
  if (right < left) return 1;
  return 0;
}

const compareList = (left, right) => {
  for (let i = 0; i < left.length; ++i) {
    if (i >= right.length) return 1;
    const comparison = compare(left[i], right[i]);
    if (comparison === -1) return -1;
    if (comparison === 1) return 1;
  }

  if (right.length > left.length) return -1;
  return 0;
}

const compare = (left, right) => {
  if (typeof left === 'number') {
    if (typeof right === 'number') return compareInt(left, right);
    return compareList([left], right);
  }

  if (typeof right === 'number') return compareList(left, [right]);

  return compareList(left, right);
}

const recurse = (str, i = 0) => {
  const result = [];

  while (i < str.length) {
    if (str[i] === '[') {
      const subResult = recurse(str, i + 1);
      i = subResult[0];
      result.push(subResult[1]);
    } else if (str[i] === ']') {
      return [i + 1, result];
    } else if (str[i] === ',') {
      i++;
    } else {
      let j = i + 1;
      while (j < str.length && !Number.isNaN(Number(str[j]))) {
        j++;
      }
      result.push(Number(str.slice(i, j)));
      i = j;
    }
  }

  return [i, result];
}

const processLine = (line) => {
  return recurse(line.slice(1, -1))[1];
}

export default async function dayThirteen() {
  const lines = await getLines(URL);

  const packets = [
    [[2]],
    [[6]],
    ...filterMap(lines, l => l, processLine)
  ];

  packets.sort(compare);

  const dividerIndices = [];

  for (let i = 0; i < packets.length; ++i) {
    if (
      packets[i].length === 1
      && Array.isArray(packets[i][0])
      && packets[i][0].length === 1
      && (packets[i][0][0] === 2 || packets[i][0][0] === 6)
    ) {
      dividerIndices.push(i + 1);
    }
  }

  console.log(dividerIndices[0] * dividerIndices[1]);

  // const pairs = [];
  // const correctPairIndices = [];

  // for (let i = 0; i < lines.length; i += 3) {
  //   pairs.push(
  //     [processLine(lines[i]), processLine(lines[i + 1])]
  //   );
  // }

  // pairs.forEach((pair, i) => {
  //   if (compare(pair[0], pair[1]) === -1) correctPairIndices.push(i + 1);
  // });

  // console.log(correctPairIndices);
  // console.log(correctPairIndices.reduce((acc, cur) => acc + cur));
}
