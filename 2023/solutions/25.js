import { getLines, log, ints, diff, gcd, lcm, count, makeArray, mergeMatrix, makeDeepMatrix, makeMatrix, cloneMatrix, deepCloneObj, cloneObj, filterMap, rangeUnion, has, maxTwo, maxN, max, min, minmax, findLastIndex, sum, flattenDeep, hexToDec, MinHeap } from '../utils.js';

let URL = './inputs/25.txt';
// URL = './inputs/t.txt';

export async function dayTwentyFive() {
  const rows = await getLines(URL);

  const h = (row) => {
    const [name, rest] = row.split(': ');
    return {
      name,
      edges: rest.split(' '),
    };
  };

  let edgeList = [];
  const components = {}

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const processed = h(row);
    if (!has(components, processed.name)) {
      components[processed.name] = processed;
    } else {
      components[processed.name].edges = [...new Set([...components[processed.name].edges, ...processed.edges])];
    }
    for (const edge of processed.edges) {
      edgeList.push([processed.name, edge].sort().join('-'));
      if (!has(components, edge)) {
        components[edge] = {
          name: edge,
          edges: [processed.name],
        };
      } else {
        components[edge].edges = [...new Set([...components[edge].edges, processed.name])];
      };
    }
  }

  edgeList = [...new Set(edgeList)].map(str => str.split('-'));

  const traceGraph = (comps, start) => {
    const set = new Set();
    const q = [start];
    set.add(start.name);
    while (q.length) {
      const curr = q.shift();

      for (const edge of curr.edges) {
        if (!set.has(edge)) {
          set.add(edge);
          if (comps[edge]) q.push(comps[edge]);
        }
      }
    }

    return set;
  }

  const testDivides = (comps) => {
    let i = 0;
    const groups = [];

    const allComps = Object.values(comps);

    while (i < allComps.length) {
      const curr = allComps[i++];
      // log(curr);
      let skip = false;
      for (const g of groups) {
        if (g.has(curr.name)) {
          skip = true;
          break;
        }
      }

      if (skip) continue;
      const group = traceGraph(comps, curr);
      // log(group);
      groups.push(group);
    }

    return groups;
  }

  // const c = deepCloneObj(components);
  // c.hfx.edges = c.hfx.edges.filter(x => x !== 'pzl');
  // c.pzl.edges = c.pzl.edges.filter(x => x !== 'hfx');
  // c.bvb.edges = c.bvb.edges.filter(x => x !== 'cmg');
  // c.cmg.edges = c.cmg.edges.filter(x => x !== 'bvb');
  // c.nvd.edges = c.nvd.edges.filter(x => x !== 'jqt');
  // c.jqt.edges = c.jqt.edges.filter(x => x !== 'nvd');
  // log(c.jqt)
  // log(testDivides(c));

  const removeEdge = (a, b) => {
    components[a].edges = components[a].edges.filter(x => x !== b);
    components[b].edges = components[b].edges.filter(x => x !== a);
  }
  const badBoys = [
    ['hhx', 'vrx'],
    ['nvh', 'grh'],
    ['vkb', 'jzj'],
  ];

  for (const [a, b] of badBoys) {
    removeEdge(a, b);
  }
  const groups = testDivides(components);
  log(groups[0].size * groups[1].size);

  // for (let i = 0; i < edgeList.length - 2; i++) {
  //   const [a, b] = edgeList[i];
  //   for (let j = i + 1; j < edgeList.length - 1; j++) {
  //     const [c, d] = edgeList[j];
  //     for (let k = j + 1; k < edgeList.length; k++) {
  //       const [e, f] = edgeList[k];
  //       const cloned = deepCloneObj(components);
  //       cloned[a].edges = cloned[a].edges.filter(x => x !== b);
  //       cloned[b].edges = cloned[b].edges.filter(x => x !== a);
  //       cloned[c].edges = cloned[c].edges.filter(x => x !== d);
  //       cloned[d].edges = cloned[d].edges.filter(x => x !== c);
  //       cloned[e].edges = cloned[e].edges.filter(x => x !== f);
  //       cloned[f].edges = cloned[f].edges.filter(x => x !== e);
  //       const groups = testDivides(cloned);
  //       // log(groups);
  //       if (groups.length === 2) {
  //         log(groups[0].size * groups[1].size);
  //         break;
  //       }
  //     }
  //   }
  // }
}

export default dayTwentyFive;
