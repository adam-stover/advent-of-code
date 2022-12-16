import { getLines } from './helpers.js';

const URL = './inputs/six.txt';

class Node {
  constructor(val) {
    this.next = null;
    this.val = val;
  }
}

class List {
  constructor(max) {
    this.max = max;
    this.size = 0;
    this.head = null;
    this.tail = null;
    this.cache = new Set();
  }

  hasDuplicate() {
    return this.cache.size !== this.size;
  }

  append(val) {
    const newNode = new Node(val);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    if (this.isFull()) {
      this.cache.delete(this.head.val);
      this.head = this.head.next;
    } else {
      this.size++;
    }

    this.cache.add(val);
  }

  isFull() {
    return this.size === this.max;
  }
}

export default async function daySix() {
  const signal = (await getLines(URL))[0];
  const lastFour = new List(4);

  for (let i = 0; i < signal.length; ++i) {
    lastFour.append(signal[i]);
    if (lastFour.isFull() && !lastFour.hasDuplicate()) {
      console.log(i);
      break;
    }
  }
}
