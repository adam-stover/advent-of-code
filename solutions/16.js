import { filterMap, getLines, ints } from '../utils.js';

const URL = './inputs/16.txt';

class Valve {
  constructor(name, flow) {
    this.name = name;
    this.flow = flow;
    this.edges = [];
  }

  addEdge(valve) {
    this.edges.push(valve);
  }

  toString() {
    return this.name;
  }
}

const makeValves = (lines) => {
  const valves = {};

  for (const line of lines) {
    const name = line.split(' ')[1];
    const flow = ints(line)[0];

    const valve = new Valve(name, flow);
    valves[name] = valve;
  }

  for (const line of lines) {
    const name = line.split(' ')[1];
    const valve = valves[name];

    let outputs;
    const outputList = line.split('tunnels lead to valves ');
    if (outputList.length > 1) outputs = outputList[1].split(', ');
    else outputs = [line.split('tunnel leads to valve ')[1]];
    // console.log(outputs);
    for (const output of outputs) {
      valve.addEdge(valves[output]);
    }
  }

  return valves;
}

const getMostFlow = (valveLength, valve, timeRemaining, openList, origin) => {
  if (valveLength === openList.length) {
    return [0, []];
  }

  if (timeRemaining <= 1) return [0, []];

  const options = [];
  const list = (valve.flow === 0 && !openList.includes(valve.name))? [...openList, valve.name] : [...openList];
  const open = list.includes(valve.name);

  if (!open) {
    const [flow, history] = getMostFlow(valveLength, valve, timeRemaining - 1, [...list, valve.name]);
    const releasedPressure = (timeRemaining - 1) * valve.flow;
    options.push([releasedPressure + flow, [`opened ${valve.name} for ${releasedPressure}`, ...history]]);
  }

  for (const edge of valve.edges) {
    if (edge.name !== origin) {
      const [flow, history] = getMostFlow(valveLength, edge, timeRemaining - 1, [...list], valve.name);

      options.push([flow, [`from ${valve.name} to ${edge.name}`, ...history]]);
    }
  }

  const bestOption = options.length ? options.reduce((acc, cur) => acc[0] > cur[0] ? acc : cur) : [0, []];

  return bestOption;
}

const getCombos = (valve1, valve2, valve1Closed, valve2Closed, valve1Origin, valve2Origin) => {
  const combos = [];
  if (valve1.name === valve2.name) {
    const allDestinations = valve1Closed ? [valve1, ...valve1.edges] : [...valve1.edges];

    for (let i = 0; i < allDestinations.length - 1; ++i) {
      if (allDestinations[i] !== valve1Origin && allDestinations[i] !== valve2Origin) {
        for (let j = i + 1; j < allDestinations.length; ++j) {
          if (allDestinations[j] !== valve2Origin && allDestinations[j] !== valve1Origin) {
            combos.push([allDestinations[i], allDestinations[j]]);
          }
        }
      }
    }

    return combos;
  }

  const aDestinations = valve1Closed ? [valve1, ...valve1.edges] : [...valve1.edges];
  const bDestinations = valve2Closed ? [valve2, ...valve2.edges] : [...valve2.edges];

  for (let i = 0; i < aDestinations.length; ++i) {
    if (aDestinations[i] !== valve1Origin && aDestinations[i] !== valve2Origin) {
      for (let j = 0; j < bDestinations.length; ++j) {
        if (bDestinations[j] !== valve2Origin && bDestinations[j] !== valve1Origin) {
          combos.push([aDestinations[i], bDestinations[j]]);
        }
      }
    }
  }

  return combos;
}

const has = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

const getDistanceHelper = (a, b) => {
  const queue = a.edges.map(edge => [edge, 0]);
  const visited = new Set([a]);

  while (queue.length) {
    const [node, count] = queue.shift();

    if (!visited.has(node)) {
      if (node === b) return count + 1;
      visited.add(node);
      queue.push(...filterMap(node.edges, edge => !visited.has(edge), edge => [edge, count + 1]));
    }
  }
}

const getDistance = (() => {
  const cache = {};

  return (a, b) => {
    if (a === b) return 0;

    const key = `${a}-${b}`;

    if (!has(cache, key)) {
      cache[key] = getDistanceHelper(a, b);
      const altKey = `${b}-${a}`;
      cache[altKey] = cache[key];
    }

    return cache[key];
  }
})();

const getMostDoubleFlow = (...args) => {
  const cache = {};

  const inner = (valveLength, valve1, valve2, timeRemaining, openList, valve1Origin, valve2Origin) => {
    if (valveLength === openList.length) {
      return [0, []];
    }

    if (timeRemaining <= 1) return [0, []];

    const options = [];

    const list = [...openList];
    let valve1Closed = true;
    let valve2Closed = true;

    for (let i = 0; i < list.length; ++i) {
      if (list[i] === valve1.name) valve1Closed = false;
      if (list[i] === valve2.name) valve2Closed = false;
    }

    if (valve1Closed && valve1.flow === 0) {
      valve1Closed = false;
      list.push(valve1.name);
    }

    if (valve2Closed && valve2.flow === 0) {
      valve2Closed = false;
      if (valve1.name !== valve2.name) {
        list.push(valve2.name);
      }
    }

    const combos = getCombos(valve1, valve2, valve1Closed, valve2Closed, valve1Origin, valve2Origin);

    for (const [a, b] of combos) {
      if (a.name === valve1.name) {
        if (b.name === valve2.name) {
          const args = [valveLength, a, b, timeRemaining - 1, [...list, a.name, b.name]]
          const key = args.join('-');
          if (!has(cache, key)) cache[key] = inner(...args);
          const [flow, history] = cache[key];
          const releasedPressure = (timeRemaining - 1) * a.flow + (timeRemaining - 1) * b.flow;
          options.push([releasedPressure + flow, [`opened ${a.name} and ${b.name} for ${releasedPressure}`, ...history]]);
        } else {
          const args = [valveLength, a, b, timeRemaining - 1, [...list, a.name], undefined, valve2.name];
          const key = args.join('-');
          if (!has(cache, key)) cache[key] = inner(...args);
          const [flow, history] = cache[key];
          const releasedPressure = (timeRemaining - 1) * a.flow;
          options.push([releasedPressure + flow, [`opened ${a.name} and moved from ${valve2.name} to ${b.name} for ${releasedPressure}`, ...history]]);
        }
      } else if (b.name === valve2.name) {
        const args = [valveLength, a, b, timeRemaining - 1, [...list, b.name], valve1.name];
        const key = args.join('-');
        if (!has(cache, key)) cache[key] = inner(...args);
        const [flow, history] = cache[key];
        const releasedPressure = (timeRemaining - 1) * b.flow;
        options.push([releasedPressure + flow, [`moved from ${valve1.name} to ${a.name} and opened ${b.name} for ${releasedPressure}`, ...history]]);
      } else {
        const args = [valveLength, a, b, timeRemaining - 1, [...list], valve1.name, valve2.name];
        const key = args.join('-');
        if (!has(cache, key)) cache[key] = inner(...args);
        const [flow, history] = cache[key];
        options.push([flow, [`moved from ${valve1.name} to ${a.name} and ${valve2.name} to ${b.name}`, ...history]]);
      }
    }

    const bestOption = options.length ? options.reduce((acc, cur) => acc[0] > cur[0] ? acc : cur) : [0, []];

    console.log(bestOption);

    return bestOption;
  }

  return inner(...args);
}

const getMostFlowGreedy = (valve, timeRemaining) => {
  if (timeRemaining < 1) return 0;

  let pressure = 0;
  if (valve.flow && !valve.open) {
    timeRemaining--;
    pressure += timeRemaining * valve.flow;
    valve.open = true;
  }

  let bestValve;

  let i = 0;

  while (!bestValve && i < valve.edges.length) {
    if (!valve.edges[i].open) bestValve = valve.edges[i];
    i++;
  }

  if (!bestValve) return 0;

  while (i < valve.edges.length) {
    if (!valve.edges[i].open && valve.edges[i].flow > bestValve.flow) bestValve = valve.edges[i];
    i++;
  }

  return pressure + getMostFlowGreedy(bestValve, timeRemaining - 1);
}

const getSingleAnswerHelper = (valves, time, current) => {
  const options = [];

  const distances = valves.map(valve => getDistance(current, valve));
  for (let i = 0; i < distances.length; ++i) {
    const newTime = time - (distances[i] + 1);
    const hasTime = newTime > 0;
    const flow = hasTime ? newTime * valves[i].flow : 0;

    const deepFlow = hasTime ? getSingleAnswer(valves.filter(v => v !== valves[i]), newTime, valves[i]) : 0;
    options.push(flow + deepFlow);
  }

  return options.length ? options.reduce((acc, cur) => acc > cur ? acc : cur, 0) : 0;
}

const getSingleAnswer = (() => {
  const cache = {};

  return (valves, time, current) => {
    if (!valves.length || time <= 1) return 0;

    const key = `${valves.join('')}-${time}-${current}`;

    if (!has(cache, key)) cache[key] = getSingleAnswerHelper(valves, time, current);

    return cache[key];
  }
})();

const getDeepFlow = (valves, aNewValve, bNewValve, aNewTime, bNewTime) => {
  const aFlow = aNewTime * aNewValve.flow;
  const bFlow = bNewTime > 0 ? bNewTime * bNewValve.flow : 0;
  const deepFlow = bFlow > 0
    ? getAnswer(
      valves.filter(v => v !== aNewValve && v !== bNewValve),
      aNewTime,
      bNewTime,
      aNewValve,
      bNewValve,
      )
    : getSingleAnswer(
      valves.filter(v => v !== aNewValve),
      aNewTime,
      aNewValve,
    );

  return aFlow + bFlow + deepFlow;
}

const getAnswerHelper = (valves, aTime, bTime, aCurrent, bCurrent = aCurrent) => {
  const options = [];

  if (aCurrent === bCurrent) {
    const distances = valves.map(valve => getDistance(aCurrent, valve));
    for (let i = 0; i < distances.length - 1; ++i) {
      const aNewTime = aTime - (distances[i] + 1);
      const aHasTime = aNewTime > 0;
      if (aHasTime) {
        for (let j = i + 1; j < distances.length; ++j) {
          const bNewTime = bTime - (distances[j] + 1);
          options.push(getDeepFlow(valves, valves[i], valves[j], aNewTime, bNewTime));
        }
      }
    }

    return options.reduce((acc, cur) => acc > cur ? acc : cur, 0);
  }

  const aValves = [];
  const bValves = [];
  const distances = [];

  for (const valve of valves) {
    const aDistance = getDistance(aCurrent, valve);
    const bDistance = getDistance(bCurrent, valve);

    if (aDistance < bDistance) aValves.push([valve, aDistance]);
    else bValves.push([valve, bDistance]);
    distances.push([valve, aDistance, bDistance]);
  }

  if (aValves.length === 0 || bValves.length === 0) {
    for (let i = 0; i < distances.length - 1; ++i) {
      const aNewValve = distances[i][0];
      const aNewTime = aTime - (distances[i][1] + 1);
      const aHasTime = aNewTime > 0;

      if (aHasTime) {
        // is following a bug or just a free optimization? it still works o.o
        for (let j = i + 1; j < distances.length; ++j) {
          const bNewValve = distances[j][0];
          const bNewTime = bTime - (distances[j][2] + 1);

          options.push(getDeepFlow(valves, aNewValve, bNewValve, aNewTime, bNewTime))
        }
      }
    }

    return options.reduce((acc, cur) => acc > cur ? acc : cur, 0);
  }

  for (let i = 0; i < aValves.length; ++i) {
    const aNewValve = aValves[i][0];
    const aNewTime = aTime - (aValves[i][1] + 1);
    const aHasTime = aNewTime > 0;

    if (aHasTime) {
      for (let j = 0; j < bValves.length; ++j) {
        const bNewValve = bValves[j][0];
        const bNewTime = bTime - (bValves[j][1] + 1);

        options.push(getDeepFlow(valves, aNewValve, bNewValve, aNewTime, bNewTime));
      }
    }
  }

  return options.reduce((acc, cur) => acc > cur ? acc : cur, 0);
}

const getAnswer = (() => {
  const cache = {};

  return (valves, aTime, bTime, aCurrent, bCurrent = aCurrent) => {
    if (!valves.length) return 0;
    if (aTime <= 1) return getSingleAnswer(valves, bTime, bCurrent);
    if (bTime <= 1) return getSingleAnswer(valves, aTime, aCurrent);

    const key = `${valves.join('')}-${aTime}-${bTime}-${aCurrent}-${bCurrent}`;

    if (!has(cache, key)) cache[key] = getAnswerHelper(valves, aTime, bTime, aCurrent, bCurrent);

    return cache[key];
  }
})();

export default async function daySixteen() {
  const lines = await getLines(URL);
  const valveMap = makeValves(lines);
  const valves = Object.values(valveMap);
  // const valveLength = valves.length;

  console.log(valveMap['AA']);
  // const pressure = getMostFlow(valveLength, valveMap['AA'], 30, []);

  // console.log(pressure);

  const start = process.hrtime();
  const answer = getAnswer(valves.filter(valve => valve.flow), 26, 26, valveMap['AA']);
  const end = process.hrtime();
  console.log(end[0] - start[0]);

  console.log(answer);
}
