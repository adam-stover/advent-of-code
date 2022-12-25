import { cloneObj, getLines, ints, max } from '../utils.js';

const URL = './inputs/20.txt';

class Node {
  constructor(val, prev, next) {
    this.val = val;
    this.prev = prev;
    this.next = next;
  }
}

class CircularList {
  constructor(arr) {
    const first = new Node(arr[0]);
    this.cache = [first];
    let cur = first;

    for (let i = 1; i < arr.length; ++i) {
      const node = new Node(arr[i], cur);
      this.cache.push(node);
      cur.next = node;
      cur = node;

      if (arr[i] === 0) this.zeroth = node;
    }

    const last = this.cache[this.cache.length - 1];
    last.next = first;
    first.prev = last;
  }

  swapAdjacent(a, b) {
    a.prev.next = b;
    b.next.prev = a;
    const tempPrev = a.prev;
    a.prev = b;
    a.next = b.next;
    b.prev = tempPrev;
    b.next = a;
  }

  move(key) {
    const node = this.cache[key];
    let num = node.val;

    if (num === 0) return;
    if (num === 1) {
      this.swapAdjacent(node, node.next);
      return;
    } else if (num === -1) {
      this.swapAdjacent(node.prev, node);
      return;
    }

    const direction = num > 0;
    let target = node;

    while (num > 0) {
      target = target.next;
      num--;
    }
    while (num < 0) {
      target = target.prev;
      num++;
    }

    if (!direction) target = target.prev;

    if (node === target || node.prev === target) {
      console.log(`we hit ourselves for ${key}th number: ${node.val} || ${target.val}`);
      return;
    }
    if (node.next === target) {
      console.log(`we swapping adjacent for ${key}th number: ${node.val} to ${target.val}`)
      this.swapAdjacent(node, target);
      return;
    }

    // inserting node after target
    node.prev.next = node.next;
    node.next.prev = node.prev;
    const tempNext = target.next;
    target.next = node;
    tempNext.prev = node;
    node.prev = target;
    node.next = tempNext;
  }

  getNth(n) {
    let cur = this.zeroth;
    while (n > 0) {
      cur = cur.next;
      n--;
    }
    return cur.val;
  }

  print() {
    const arr = [this.zeroth.val];
    let cur = this.zeroth.next;
    while (cur !== this.zeroth) {
      arr.push(cur.val);
      cur = cur.next;
    }

    console.log(arr.join(', '));
  }
}

export default async function dayTwenty() {
  const nums = (await getLines(URL)).map(Number);

  const list = new CircularList(nums);

  for (let i = 0; i < nums.length; ++i) {
    list.move(i);
    // console.log(`moved ${nums[i]}`)
    // list.print();
  }

  const targets = [1000, 2000, 3000];

  const answers = targets.map(n => list.getNth(n));

  answers.forEach(a => console.log(a));

  console.log(answers.reduce((acc, cur) => acc + cur));
}
