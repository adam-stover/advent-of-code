import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/23.txt';
URL = './inputs/t.txt';

export async function run() {
  const lines = await getLines(URL);

  console.time('eyo');

  const nodes = new Set();
  const edges = {};

  for (let i = 0; i < lines.length; i++) {
    const [a, b] = lines[i].trim().split('-');
    nodes.add(a);
    nodes.add(b);
    if (!has(edges, a)) edges[a] = new Set();
    if (!has(edges, b)) edges[b] = new Set();
    edges[a].add(b);
    edges[b].add(a);
  }

  const lehNodes = new Map();

  for (const key of nodes.keys()) {
    lehNodes.set(key, { key, edges: edges[key] });
  }

  const getGroupsRecurse = (node, required = [], _refs = new WeakSet()) => {
    if (_refs.has(node)) return required;
    _refs.add(node);
    const nextNodes = node.edges;

    if (required.every(key => nextNodes.has(key))) {
        const nextRequirement = [...required, node.key];
        const requirements = filterMap(
            [...nextNodes].map(key => lehNodes.get(key)),
            n => !required.includes(n),
            n => getGroupsRecurse(n, nextRequirement, _refs)
        );
        const bestRequirement = max(requirements, r => r.length);
        _refs.delete(node.key);
        return bestRequirement
    }
    _refs.delete(node);
    return required;
  }

  const getGroups = (startingNode) => {
    const seen = new Set();
    const queue = [startingNode];

    while (queue.length) {
      const node = queue.shift();
      if (!seen.has(node) && edges[node].isSupersetOf(seen)) {
        seen.add(node);
        queue.push(...edges[node]);
      }
    }

    return [...seen];
  }

  let best = [];

  // for (const [key, node] of lehNodes.entries()) {
  //   const reqs = getGroupsRecurse(node);
  //   if (reqs.length > best.length) best = reqs;
  // }

  for (const key of nodes.keys()) {
    const group = getGroups(key);
    if (group.length > best.length) best = group;
  }

  console.timeEnd('eyo');

  log(best.sort((a, b) => a.localeCompare(b)).join(','));
}

export default run;
