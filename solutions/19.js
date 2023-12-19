import { getLines, log, ints, diff, gcd, lcm, count, makeArray, makeDeepMatrix, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep, hexToDec, MinHeap } from '../utils.js';

let URL = './inputs/19.txt';
// URL = './inputs/t.txt';

export async function dayNineteen() {
  const rows = await getLines(URL);

  const workflows = {};
  const CAT_KEYS = ['x', 'm', 'a', 's'];
  const categories = {
    x: [],
    m: [],
    a: [],
    s: [],
  };

  const categoryRanges = {
    x: [],
    m: [],
    a: [],
    s: [],
  };

  const process = (part) => {
    let destination = 'in';

    while (destination !== 'A' && destination !== 'R') {
      const workflow = workflows[destination];

      for (const c of workflow) {
        if (c.predicate(part)) {
          destination = c.destination;
          break;
        }
      }
    }

    return destination;
  }

  const p1 = () => {
    const parts = [];
    const accepted = [];

    let transition = false;

    for (const row of rows) {
      if (row === '') {
        transition = true;
        continue;
      }

      if (!transition) {
        const [name, rest] = row.split('{');
        const conditionals = rest.split(',').map(c => {
          const components = c.split(':');
          if (components.length === 1) return {
            predicate: () => true,
            destination: components[0].slice(0, -1),
          };
          const [condition, destination] = components;
          const category = condition[0];
          const comparator = condition[1];
          const num = ints(condition);

          return {
            predicate: (part) => comparator === '>' ? part[category] > num : part[category] < num,
            destination,
          };
        });
        workflows[name] = conditionals;
      }
      else {
        const nums = ints(row);
        parts.push({
          x: nums[0],
          m: nums[1],
          a: nums[2],
          s: nums[3],
        });
      }
    }

    for (const part of parts) {
      const dest = process(part);

      if (dest === 'A') accepted.push(part);
    }

    const res = sum(accepted.map(a => a.x + a.m + a.a + a.s))

    log(res);
  }

  for (const row of rows) {
    if (row === '') {
      break;
    }

    const [name, rest] = row.split('{');
    const conditionals = rest.split(',').map(c => {
      const components = c.split(':');
      if (components.length === 1) return {
        predicate: () => true,
        destination: components[0].slice(0, -1),
      };
      const [condition, destination] = components;
      const category = condition[0];
      const comparator = condition[1];
      const num = ints(condition)[0];

      categories[category].push(comparator === '<' ? num : num + 1);

      return {
        predicate: (part) => comparator === '<' ? part[category] < num : part[category] > num,
        category,
        destination,
      };
    });
    workflows[name] = conditionals;
  }

  const tryit = (cat, val) => {
    const part = { [cat]: val };
    let destination = 'in';

    while (destination !== 'A' && destination !== 'R') {
      const workflow = workflows[destination];

      for (const c of workflow) {
        if (!c.category || c.category !== cat || c.predicate(part)) {
          destination = c.destination;
          break;
        }
      }
    }

    return destination
  }

  const getCombos = (cat) => {
    let total = 0;

    for (let i = 1; i <= 4000; i++) {
      if (tryit(cat, i) === 'A') total++;
    }

    return total;
  }

  for (const key of CAT_KEYS) {
    const cat = categories[key];
    const range = categoryRanges[key];
    cat.sort((a, b) => a - b);

    let start = 1;
    let end = cat[0]
    let i = 1;
    range.push([start, end]);

    while (i < cat.length) {
      start = end;
      end = cat[i++];
      range.push([start, end]);
    }

    range.push([end, 4001]);
    log(range.length)
  }

  let res = 0;

  // log(categoryRanges)

  for (const xrange of categoryRanges.x) {
    const xtotal = xrange[1] - xrange[0];
    const xsample = Math.floor((xrange[0] + xrange[1]) / 2);
    const part = { x: xsample };
    console.log(xrange);
    for (const mrange of categoryRanges.m) {
      const mtotal = mrange[1] - mrange[0];
      const msample = Math.floor((mrange[0] + mrange[1]) / 2);
      part.m = msample;
      for (const arange of categoryRanges.a) {
        const atotal = arange[1] - arange[0];
        const asample = Math.floor((arange[0] + arange[1]) / 2);
        part.a = asample;
        for (const srange of categoryRanges.s) {
          const stotal = srange[1] - srange[0];
          const ssample = Math.floor((srange[0] + srange[1]) / 2);
          part.s = ssample;
          // log(part);
          const dest = process(part);
          // log(dest);
          if (dest === 'A') {
            const total = xtotal * mtotal * atotal * stotal;
            // log(total);
            // log(part);
            res += total
          }
        }
      }
    }
  }

  log(res)
}

export default dayNineteen;
