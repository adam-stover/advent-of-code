import { readFile } from 'node:fs/promises';

export async function getLines(url) {
  const data = await readFile(url, 'utf-8');
  const lines = data.split('\n');
  return lines;
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
    const accVal = transform(acc);
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

export const sum = (arr) => arr.reduce((acc, cur) => acc + cur, 0);

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
  constructor(comparator) {
    this.heap = [];
    this.comparator = comparator;
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
  // heapifyDown will be called
  remove() {
      if (this.size === 0) {
          return null;
      }
      const item = this.heap[0];
      this.heap[0] = this.heap[this.size - 1];
      this.heap.pop();
      this.heapifyDown();
      return item;
  }

  add(item) {
      this.heap.push(item);
      this.heapifyUp();
  }

  printHeap() {
    let heap =` ${this.heap[0]} `
    for(let i = 1; i < this.size; i++) {
        heap += ` ${this.heap[i]} `;
    }
    console.log(heap);
}
}

export class MinHeap extends Heap {
  constructor(comparator) {
    super(comparator);
  }

  heapifyUp() {
      let index = this.size - 1;
      while (this.hasParent(index) && this.comparator(this.parent(index)) > this.comparator(this.heap[index])) {
          this.swap(this.getParentIndex(index), index);
          index = this.getParentIndex(index);
      }
  }

  heapifyDown() {
      let index = 0;
      while (this.hasLeftChild(index)) {
          let smallerChildIndex = this.getLeftChildIndex(index);
          if (this.hasRightChild(index) && this.comparator(this.rightChild(index)) < this.comparator(this.leftChild(index))) {
              smallerChildIndex = this.getRightChildIndex(index);
          }
          if (this.comparator(this.heap[index]) < this.comparator(this.heap[smallerChildIndex])) {
              break;
          } else {
              this.swap(index, smallerChildIndex);
          }
          index = smallerChildIndex;
      }
  }
}

export class MaxHeap extends Heap {
  constructor(comparator) {
    super(comparator);
  }

  heapifyUp() {
      let index = this.heap.length - 1;
      while (this.hasParent(index) && this.comparator(this.parent(index)) < this.comparator(this.heap[index])) {
          this.swap(this.getParentIndex(index), index);
          index = this.getParentIndex(index);
      }
  }

  heapifyDown() {
      let index = 0;
      while (this.hasLeftChild(index)) {
          let largerChildIndex = this.getLeftChildIndex(index);
          if (this.hasRightChild(index) && this.comparator(this.rightChild(index)) > this.comparator(this.leftChild(index))) {
              largerChildIndex = this.getRightChildIndex(index);
          }
          if (this.comparator(this.heap[index]) > this.comparator(this.heap[largerChildIndex])) {
              break;
          } else {
              this.swap(index, largerChildIndex);
          }
          index = largerChildIndex;
      }
  }
};
