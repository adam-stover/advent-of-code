import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/8.txt';
// URL = './inputs/t.txt';

const distance = (p, q) => {
  const d1 = Math.abs(p[0] - q[0]);
  const d2 = Math.abs(p[1] - q[1]);
  const d3 = Math.abs(p[2] - q[2]);

  return Math.sqrt(d1 ** 2 + d2 ** 2 + d3 ** 2);
}

export async function run() {
  const lines = await getLines(URL);
  const boxes = lines.map(ints);
  const distances = [];

  // const NUM_CONNECTS = 1000;
  const circuits = [];
  for (let i = 0; i < boxes.length; i++) {
    circuits.push(new Set([i]));
  }

  for (let i = 0; i < boxes.length - 1; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const d = distance(boxes[i], boxes[j]);
      distances.push([d, i, j]);
    }
  }

  distances.sort((a, b) => a[0] - b[0]);

  for (let i = 0; i < distances.length; i++) {
    const [_distance, p, q] = distances[i];
    const [larger, smaller] = circuits[p].size > circuits[q].size ? [circuits[p], circuits[q]] : [circuits[q], circuits[p]];
    smaller.difference(larger).forEach(box => {
      larger.add(box);
      circuits[box] = larger;
    })
    if (larger.size === boxes.length) {
      log(boxes[p][0] * boxes[q][0]);
      break;
    }
  }
  // const unique = [...new Set(circuits)].map(set => set.size).sort((a, b) => b - a);

  // log(unique[0] * unique[1] * unique[2]);
}

export default run;
