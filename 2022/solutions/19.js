import { cloneObj, getLines, ints, max } from '../../utils.js';

const URL = './inputs/19.txt';
const TIME = 32;

const ORE = 0;
const CLAY = 1;
const OBS = 2;
const GEODE = 3;

const TYPES = [ORE, CLAY, OBS, GEODE];
const NAMES = {
  [ORE]: 'ORE',
  [CLAY]: 'CLAY',
  [OBS]: 'OBS',
  [GEODE]: 'GEODE',
}

const getMaxGeodes = (timeLimit, oreCost, clayCost, obsOreCost, obsClayCost, geodeOreCost, geodeObsCost) => {
  const defaultState = () => ({
    ore: 0,
    clay: 0,
    obs: 0,
    geodes: 0,
    oreBots: 1,
    clayBots: 0,
    obsBots: 0,
    geodeBots: 0,
    t: 0,
  });

  const stateKey = ({ ore, clay, obs, geodes, oreBots, clayBots, obsBots, geodeBots, t }) => (`${ore}:${clay}:${obs}:${geodes}:${oreBots}:${clayBots}:${obsBots}:${geodeBots}:${t}`);

  const heuristic = (state) => {
    const obsTotalCost = obsOreCost + obsClayCost * clayCost;
    const geodeTotalCost = geodeOreCost + geodeObsCost * obsTotalCost;

    if (state.oreBots > geodeTotalCost || state.clayBots > obsClayCost || state.obsBots > geodeObsCost) return -1;

    return state.oreBots + state.clayBots * clayCost + state.obsBots * obsTotalCost + state.geodeBots * geodeTotalCost;
  }

  const seen = new Set();
  let queue = [defaultState()];
  let best = 0;

  while (queue.length) {
    const state = cloneObj(queue[0]);
    // console.log(state);
    queue = queue.slice(1);
    const key = stateKey(state);

    if (seen.has(key)) continue;
    seen.add(key);

    if (state.t === timeLimit) {
      // console.log(state);
      if (state.geodes > best) best = state.geodes;
      continue;
    }

    const canBuildOreBot = state.ore >= oreCost;
    const canBuildClayBot = state.ore >= clayCost;
    const canBuildObsBot = state.ore >= obsOreCost && state.clay >= obsClayCost;
    const canBuildGeodeBot = state.ore >= geodeOreCost && state.obs >= geodeObsCost;

    state.ore += state.oreBots;
    state.clay += state.clayBots;
    state.obs += state.obsBots;
    state.geodes += state.geodeBots;
    state.t++;

    queue.push(state);

    if (canBuildOreBot) {
      const nextState = cloneObj(state);
      nextState.oreBots++;
      nextState.ore -= oreCost;
      queue.push(nextState);
    }
    if (canBuildClayBot) {
      const nextState = cloneObj(state);
      nextState.clayBots++;
      nextState.ore -= clayCost;
      queue.push(nextState);
    }
    if (canBuildObsBot) {
      const nextState = cloneObj(state);
      nextState.obsBots++;
      nextState.ore -= obsOreCost;
      nextState.clay -= obsClayCost;
      queue.push(nextState);
    }
    if (canBuildGeodeBot) {
      const nextState = cloneObj(state);
      nextState.geodeBots++;
      nextState.ore -= geodeOreCost;
      nextState.obs -= geodeObsCost;
      queue.push(nextState);
    }

    if (queue.length > 50000) {
      queue = [...queue].sort((a, b) => heuristic(a) - heuristic(b)).slice(-20000);
      console.log(queue[queue.length - 1])
      // console.log('first');
      // console.log(queue[0]);
      // console.log('last');
      // console.log(queue[queue.length - 1]);
    }
  }

  return best;
}

export default async function dayNineteen() {
  const blueprints = (await getLines(URL)).map(ints);

  let sum = 0;
  for (const [id, ...costs] of blueprints) {
    const max = getMaxGeodes(24, ...costs);
    console.log(`${id}: ${max}`);
    sum += id * max;
  }
  console.log(sum);

  // for (let i = 0; i < 3; ++i) {
  //   const x = evaluators[i];
  //   console.log(x.id);
  //   const answer = x.getMostGeodes();
  //   console.log(answer);
  //   answers.push([x.id, answer]);
  // }

  // console.log(answers);
  // console.log(answers.reduce((acc, cur) => acc * cur[1]), 1);
}
