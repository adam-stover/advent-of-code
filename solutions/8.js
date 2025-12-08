import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log, MinHeap } from '../utils.js';

let URL = './inputs/8.txt';
// URL = './inputs/t.txt';

const distance = (p, q) => {
  const d1 = (p[0] - q[0]) ** 2;
  const d2 = (p[1] - q[1]) ** 2;
  const d3 = (p[2] - q[2]) ** 2;

  return Math.sqrt(d1 + d2 + d3);
}

export async function run_pre_optimized() {
  const lines = await getLines(URL);
  const t0 = performance.now();
  const boxes = lines.map(ints);

  const circuits = [];
  for (let i = 0; i < boxes.length; i++) {
    circuits.push(new Set([i]));
  }

  const distances = [];
  for (let i = 0; i < boxes.length - 1; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const d = distance(boxes[i], boxes[j]);
      distances.push([d, i, j]);
    }
  }

  const t1 = performance.now();

  distances.sort((a, b) => a[0] - b[0]);

  const t2 = performance.now();

  let t3;

  for (let i = 0; i < distances.length; i++) {
    const [_distance, p, q] = distances[i];
    const [larger, smaller] = circuits[p].size > circuits[q].size ? [circuits[p], circuits[q]] : [circuits[q], circuits[p]];
    smaller.difference(larger).forEach(box => {
      larger.add(box);
      circuits[box] = larger;
    })
    if (larger.size === boxes.length) {
      t3 = performance.now();
      log(boxes[p][0] * boxes[q][0]);
      break;
    }
  }

  // const unique = [...new Set(circuits)].map(set => set.size).sort((a, b) => b - a);
  // log(unique[0] * unique[1] * unique[2]);

  log(`Setup time: ${(t1 - t0).toFixed(2)} ms`);
  log(`Sort time: ${(t2 - t1).toFixed(2)} ms`);
  log(`Circuitry time: ${(t3 - t2).toFixed(2)} ms`);
  log(`Total time: ${(t3 - t0).toFixed(2)} ms`);
}

export async function run() {
  const lines = await getLines(URL);
  const t0 = performance.now();
  const boxes = lines.map(ints);

  const circuits = [];
  for (let i = 0; i < boxes.length; i++) {
    circuits.push(new Set([i]));
  }

  const distances = [];
  for (let i = 0; i < boxes.length - 1; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const d = distance(boxes[i], boxes[j]);
      distances.push([d, i, j]);
    }
  }

  const t1 = performance.now();

  const distanceHeap = new MinHeap((d) => d[0], distances);

  const t2 = performance.now();

  let t3;

  while (distanceHeap.size) {
    const [_distance, p, q] = distanceHeap.pop();
    if (circuits[p] !== circuits[q]) {
      const [larger, smaller] = circuits[p].size > circuits[q].size ? [circuits[p], circuits[q]] : [circuits[q], circuits[p]];

      smaller.difference(larger).forEach(box => {
        larger.add(box);
        circuits[box] = larger;
      });

      if (larger.size === boxes.length) {
        t3 = performance.now();
        log(boxes[p][0] * boxes[q][0]);
        break;
      }
    }
  }

  log(`Setup time: ${(t1 - t0).toFixed(2)} ms`);
  log(`Heapify time: ${(t2 - t1).toFixed(2)} ms`);
  log(`Circuitry time: ${(t3 - t2).toFixed(2)} ms`);
  log(`Total time: ${(t3 - t0).toFixed(2)} ms`);
}

export default run;
