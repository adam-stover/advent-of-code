import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/23.txt';
// URL = './inputs/t.txt';

export async function run() {
  const lines = await getLines(URL);

  const nodes = new Set();
  const tNodes = new Set();
  const edges = {};

  for (let i = 0; i < lines.length; i++) {
    const [a, b] = lines[i].trim().split('-');
    nodes.add(a);
    nodes.add(b);
    if (!has(edges, a)) edges[a] = new Set();
    if (!has(edges, b)) edges[b] = new Set();
    edges[a].add(b);
    edges[b].add(a);
    if (a.startsWith('t')) tNodes.add(a);
    if (b.startsWith('t')) tNodes.add(b);
  }

  const collectGroup = (node) => {
    const seen = new Set();

    const queue = [node];

    while (queue.length) {
        const cur = queue.shift();
        if (seen.has(cur)) continue;
        seen.add(cur);
        for (const nextNode of edges[cur]) {
            queue.push(nextNode);
        }
    }

    return seen;
  }

  const getGroups = (set) => {
    const groups = new Set();
    for (const node of set.keys()) {
        const nextNodes = edges[node];
        for (const nextNode of nextNodes.keys()) {
            const nextNodeNodes = edges[nextNode];
            for (const nextNextNode of nextNodeNodes.keys()) {
                // log(`We are evaluating ${nextNextNode} which is edging ${nextNode} which is edging ${tNode}`)
                if (nextNodes.has(nextNextNode)) {
                    const key = [node, nextNode, nextNextNode]
                        .sort((a, b) => a.localeCompare(b))
                        .join('-');
                    groups.add(key)
                }
            }
        }
      }

      return groups;
  }

  const memo = (() => {
    const cache = {};

    return (node, required = []) => {
        const key = `${node}|${required.join('-')}`;

        if (!has(cache, key)) cache[key] = getGroupsRecurse(node, required);
        return cache[key];
    }
  })();

  const getGroupsRecurse = (node, required = []) => {
    // log(required);
    const nextNodes = edges[node];

    if (required.every(node => nextNodes.has(node))) {
        const nextRequirement = [...required, node];
        const requirements = filterMap(
            [...nextNodes],
            n => !required.includes(n),
            n => memo(n, nextRequirement)
        );
        const bestRequirement = max(requirements, r => r.length);
        return bestRequirement
    }

    return required;
  }

  const doThing = (startingNode) => {
    const seen = new Set();
    const queue = [startingNode];

    while (queue.length) {
      const node = queue.pop();
      if (seen.has(node)) continue;
      const nextNodes = edges[node];
      if (nextNodes.isSupersetOf(seen)) {
        seen.add(node);
        queue.push(...nextNodes);
      }
    }

    return [...seen];
  }

  let best = [];

  for (const key of nodes.keys()) {
    const group = doThing(key);
    if (group.length > best.length) best = group;
  }

  log(best.sort((a, b) => a.localeCompare(b)).join(','));

  // let best = [];

  // for (const key of nodes.keys()) {
  //   const cur = memo(key);
  //   log(`${key} gives us ${cur}`)
  //   if (cur.length > best.length) best = cur;
  // }

  // log(best.sort((a, b) => a.localeCompare(b)).join(','));

//   const groups = getGroups(nodes);
//   log(groups.size);

//   const tNodeGroups = getGroups(tNodes);
//   log(tNodeGroups.size)

//   let count = 0;

//   for (const group of groups) {
//     const computers = group.split('-');
//     if (computers.some(c => c.startsWith('t'))) {
//         // log(computers);
//         count++;
//     }
//   }

//   log(count);
}

export default run;
