import { readFile } from 'node:fs/promises';

export async function getLines(url) {
  const data = await readFile(url, 'utf-8');
  const lines = data.split('\n');
  return lines.slice(0, -1);
}

export function log(...args) {
  console.log(...args);
}

export function ints(str) {
  return str.match(/(?:(?<!\d)-)?\d+/g)?.map(Number);
}

export const diff = (nums) => {
  const differences = [];

  for (let i = 1; i < nums.length; i++) {
    differences.push(nums[i] - nums[i - 1]);
  }

  return differences;
}

export const gcd = (a, b) => a ? gcd(b % a, a) : b;

export const lcm = (a, b) => a * b / gcd(a, b);

export function count(arr, el) {
  let res = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === el) res++;
  }

  return res;
}

export function makeArray(length, fill) {
  const arr = [];

  for (let i = 0; i < length; i++) {
    const f = typeof fill === 'function' ? fill(i) : fill;
    arr.push(f);
  }

  return arr;
}

export function mergeMatrix(a, b, mergeRight = false) {
  const c = [];

  if (mergeRight) {
    for (let i = 0; i < a.length; i++) {
      c.push(a[i].concat(b[i]));
    }

    return c;
  }

  for (const row of [...a, ...b]) {
    c.push([...row]);
  }

  return c;
}

export function makeDeepMatrix(fill, ...dimensions) {
  const matrix = []
  const dimension = dimensions[0];
  const rest = dimensions.slice(1);

  for (let i = 0; i < dimension; i++) {
    if (rest.length === 1) {
      matrix.push(makeArray(rest[0], fill));
    } else {
      matrix.push(makeDeepMatrix(fill, ...rest));
    }
  }

  return matrix;
}

export function makeMatrix(length, height, fill) {
  const matrix = [];

  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < length; j++) {
      const f = typeof fill === 'function' ? fill(i, j) : fill;
      row.push(f);
    }
    matrix.push(row);
  }

  return matrix;
}

export function cloneMatrix(matrix) {
  const newMatrix = [];
  for (let i = 0; i < matrix.length; ++i) {
    if (Array.isArray(matrix[i])) newMatrix[i] = cloneMatrix(matrix[i]);
    else newMatrix[i] = matrix[i];
  }
  return newMatrix;
}

export function rotateMatrix(matrix) {
  const rotated = makeMatrix(
    matrix.length,
    matrix[0].length,
    (i, j) => matrix[j][i],
  );

  return rotated;
}

export function getMatrixDiags(matrix, limit = 1) {
  const diagonals = [];
  const iLen = matrix.length;
  const jLen = matrix[0].length;

  for (let j = jLen - limit; j >= 0; j--) {
    const diag = [];
    for (let k = j; k < jLen; k++) {
      const i = k - j;
      diag.push(matrix[i][k]);
    }
    diagonals.push(diag);
  }

  for (let i = 1; i < iLen; i++) {
    const diag = [];
    for (let k = i; k < iLen; k++) {
      const j = k - i;
      diag.push(matrix[k][j]);
    }
    diagonals.push(diag);
  }

  for (let i = limit - 1; i < iLen; i++) {
    const diag = [];
    for (let k = i; k >= 0; k--) {
      const j = i - k;
      diag.push(matrix[k][j]);
    }
    diagonals.push(diag);
  }

  for (let j = 1; j <= jLen - limit; j++) {
    const diag = [];
    for (let k = j; k < jLen; k++) {
      const i = iLen - (k - j) - 1;
      diag.push(matrix[i][k]);
    }
    diagonals.push(diag);
  }

  return diagonals;
}

export function deepCloneObj(obj) {
  const newObj = {}

  for (const key of Object.keys(obj)) {
    const val = Array.isArray(obj[key])
      ? cloneMatrix(obj[key])
      : typeof obj[key] === 'object'
      ? deepCloneObj(obj[key])
      : obj[key];

    newObj[key] = val;
  }

  return newObj;
}

export function cloneObj(obj) {
  const newObj = {}

  for (const key of Object.keys(obj)) {
    newObj[key] = obj[key];
  }

  return newObj;
}

export function filterMap(arr, filterFn, mapFn) {
  const res = [];
  for (let i = 0; i < arr.length; ++i) {
    if (filterFn(arr[i])) res.push(mapFn(arr[i]));
  }
  return res;
}

export function rangeUnion(ranges) {
  const sorted = cloneMatrix(ranges).sort((a, b) => a[0] - b[0]);
  const union = [];

  for (const [start, end] of sorted) {
    if (union.length && union[union.length - 1][1] >= start - 1) {
      // following if is to avoid entirely contained ranges
      if (union[union.length - 1][1] < end) {
        union[union.length - 1] = [union[union.length - 1][0], end];
      }
    } else {
      union.push([start, end]);
    }
  }

  return union;
}

export function intersection(a, ...b) {
  const res = new Set();

  for (const key of a.keys()) {
    if (b.every(set => set.has(key))) {
      res.add(key);
    }
  }

  return res;
}

export function has(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function maxN(arr, n) {
  if (arr.length < n) console.warn(`arr should be length n (${n}) or greater`);

  const maxes = makeArray(n, -Infinity);

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < maxes.length; j++) {
      if (arr[i] > maxes[j]) {
        for (let k = maxes.length - 1; k > j; k--) {
          maxes[k] = maxes[k - 1];
        }
        maxes[j] = arr[i];
        break;
      }
    }
  }

  return maxes;
}

export function maxTwo(arr) {
  if (arr.length < 2) console.warn('arr should be length two or greater');

  const maxes = [arr[0], -Infinity];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxes[0]) {
      maxes[1] = maxes[0];
      maxes[0] = arr[i];
    } else if (arr[i] > maxes[1]) {
      maxes[1] = arr[i];
    }
  }

  return maxes;
}

export function max(arr, cb) {
  const transform = cb ? cb : x => x;
  return arr.reduce((acc, cur) => {
    const val = transform(cur);
    const accVal = transform(acc);
    return accVal > val ? acc : cur;
  }, -Infinity);
}

export function min(arr, cb) {
  const transform = cb ? cb : x => x;
  return arr.reduce((acc, cur) => {
    const val = transform(cur);
    const accVal = acc;
    return accVal < val ? acc : cur;
  }, Infinity);
}

export function minmax(arr, cb) {
  if (!arr.length) throw new Error('arr is empty noob');

  const transform = cb ? cb : x => x;

  const first = transform(arr[0]);
  let min = first;
  let max = first;

  for (let i = 1; i < arr.length; ++i) {
    const val = transform(arr[i]);
    if (val < min) min = val;
    else if (val > max) max = val;
  }

  return [min, max];
}

export function findLastIndex(arr, cb) {
  for (let i = arr.length - 1; i >= 0; --i) {
    if (cb(arr[i])) return i;
  }

  return -1;
}

export const copyExcept = (arr, index) => {
  const newArr = [];

  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArr.push(arr[i]);
  }

  return newArr;
}

export const sum = (arr) => arr.reduce((acc, cur) => acc + cur, 0);

// Swap in place
export const swap = (arr, i, j) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

/** Used as references for various `Number` constants. */
const INFINITY = 1 / 0;
/** Built-in value reference. */
const spreadableSymbol = Symbol.isConcatSpreadable

function isFlattenable(value) {
  return Array.isArray(value) || !!(value && value[spreadableSymbol]);
}

function baseFlatten(array, depth, predicate, isStrict, result) {
  predicate || (predicate = isFlattenable)
  result || (result = [])

  if (array == null) {
    return result
  }

  for (const value of array) {
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result)
      } else {
        result.push(...value)
      }
    } else if (!isStrict) {
      result[result.length] = value
    }
  }
  return result
}

export const flattenDeep = (array) => {
  const length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, INFINITY) : [];
};

export const hexToDec = (hex) => {
  const digitMap = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    a: 10,
    b: 11,
    c: 12,
    d: 13,
    e: 14,
    f: 15,
  };

  const digits = hex.split('').map(d => digitMap[d]);

  let res = 0;

  for (let i = digits.length - 1; i >= 0; i--) {
    res += digits[i] * 16 ** (digits.length - 1 - i);
  }

  return res;
}

class Heap {
  constructor(comparator, heap = []) {
    this.comparator = comparator;
    this.heap = heap;

    for (let i = Math.floor(this.size / 2) - 1; i >= 0; i--) {
      this.siftDownPerformanceOptimized(i);
    }
  }

  // Helper Methods
  getLeftChildIndex(parentIndex) {
    return 2 * parentIndex + 1;
  }
  getRightChildIndex(parentIndex) {
      return 2 * parentIndex + 2;
  }
  getParentIndex(childIndex) {
      return Math.floor((childIndex - 1) / 2);
  }
  hasLeftChild(index) {
      return this.getLeftChildIndex(index) < this.size;
  }
  hasRightChild(index) {
      return this.getRightChildIndex(index) < this.size;
  }
  hasParent(index) {
      return this.getParentIndex(index) >= 0;
  }
  leftChild(index) {
      return this.heap[this.getLeftChildIndex(index)];
  }
  rightChild(index) {
      return this.heap[this.getRightChildIndex(index)];
  }
  parent(index) {
      return this.heap[this.getParentIndex(index)];
  }

  // Functions to create Min Heap
  swap(indexOne, indexTwo) {
      const temp = this.heap[indexOne];
      this.heap[indexOne] = this.heap[indexTwo];
      this.heap[indexTwo] = temp;
  }

  get size() {
    return this.heap.length;
  }

  peek() {
      if (this.size === 0) {
          return null;
      }
      return this.heap[0];
  }

  // Removing an element will remove the
  // top element with highest priority then
  // siftDown will be called
  remove() {
      if (this.size === 0) {
          return null;
      }
      const item = this.heap[0];
      this.heap[0] = this.heap[this.size - 1];
      this.heap.pop();
      this.siftDown();
      return item;
  }

  pop() {
      return this.remove();
  }

  add(item) {
      this.heap.push(item);
      this.siftUp();
  }

  printHeap() {
    let heap =` ${this.heap[0]} `
    for(let i = 1; i < this.size; i++) {
        heap += ` ${this.heap[i]} `;
    }
    console.log(heap);
  }

  siftUp() {
    let index = this.size - 1;
    while (this.hasParent(index) && !this.isCorrectOrder(this.parent(index), this.heap[index])) {
        this.swap(this.getParentIndex(index), index);
        index = this.getParentIndex(index);
    }
  }

  siftDown(index = 0) {
    while (this.hasLeftChild(index)) {
      let childIndexToSwap = this.getLeftChildIndex(index);
      if (this.hasRightChild(index) && !this.isCorrectOrder(this.leftChild(index), this.rightChild(index))) {
          childIndexToSwap = this.getRightChildIndex(index);
      }

      if (this.isCorrectOrder(this.heap[index], this.heap[childIndexToSwap])) {
          break;
      } else {
          this.swap(index, childIndexToSwap);
      }
      index = childIndexToSwap;
    }
  }
}

export class MinHeap extends Heap {
  constructor(...args) {
    super(...args);
  }

  isCorrectOrder(a, b) {
    return this.comparator(a) <= this.comparator(b);
  }

  siftDownPerformanceOptimized(index = 0) {
    const size = this.size;

    let leftChildIndex = 2 * index + 1;
    while (leftChildIndex < size) {
      let leftChildVal = this.comparator(this.heap[leftChildIndex]);
      const rightChildIndex = 2 * index + 2;
      if (rightChildIndex < 2) {
        const rightChildVal = this.comparator(this.heap[rightChildIndex]);
        if (rightChildVal > leftChildVal) {
          leftChildIndex = rightChildIndex;
          leftChildVal = rightChildVal;
        }
      }

      if (this.comparator(this.heap[index]) <= leftChildVal) break;

      this.swap(index, leftChildIndex);
      index = leftChildIndex;
      leftChildIndex = 2 * index + 1;
    }
  }
}

export class MaxHeap extends Heap {
  constructor(...args) {
    super(...args);
  }

  isCorrectOrder(a, b) {
    return this.comparator(a) >= this.comparator(b);
  }

  siftDownPerformanceOptimized(index = 0) {
    const size = this.size;

    let leftChildIndex = 2 * index + 1;
    while (leftChildIndex < size) {
      let leftChildVal = this.comparator(this.heap[leftChildIndex]);
      const rightChildIndex = 2 * index + 2;
      if (rightChildIndex < 2) {
        const rightChildVal = this.comparator(this.heap[rightChildIndex]);
        if (rightChildVal < leftChildVal) {
          leftChildIndex = rightChildIndex;
          leftChildVal = rightChildVal;
        }
      }

      if (this.comparator(this.heap[index]) >= leftChildVal) break;

      this.swap(index, leftChildIndex);
      index = leftChildIndex;
      leftChildIndex = 2 * index + 1;
    }
  }
};
