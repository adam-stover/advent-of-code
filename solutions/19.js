import { cloneObj, getLines, ints, max } from '../utils.js';

const URL = './inputs/test.txt';
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

class BlueprintEvaluator {
  constructor(blueprint, time, robots, resources) {
    this.blueprint = blueprint;
    this.id = blueprint[0];
    this.time = time;

    this.costs = {
      [ORE]: {
        [ORE]: blueprint[1],
      },
      [CLAY]: {
        [ORE]: blueprint[2],
      },
      [OBS]: {
        [ORE]: blueprint[3],
        [CLAY]: blueprint[4],
      },
      [GEODE]: {
        [ORE]: blueprint[5],
        [OBS]: blueprint[6],
      },
    };

    this.robots = robots
      ? robots
      : {
        [ORE]: 1,
        [CLAY]: 0,
        [OBS]: 0,
        [GEODE]: 0,
      };

    this.resources = resources
      ? resources
      : {
        [ORE]: 0,
        [CLAY]: 0,
        [OBS]: 0,
        [GEODE]: 0,
      };

      this.pending = {
        [ORE]: 0,
        [CLAY]: 0,
        [OBS]: 0,
        [GEODE]: 0,
      };
  }

  canMake(type) {
    return Object.keys(this.costs[type]).every(resourceType => this.resources[resourceType] >= this.costs[type][resourceType]);
  }

  make(type) {
    if (!this.canMake(type)) return false;

    let str = 'Spend ';

    Object.keys(this.costs[type]).forEach((resourceType, i) => {
      const cost = this.costs[type][resourceType];
      if (i) str += 'and '
      str += `${cost} ${NAMES[resourceType]} `
      this.resources[resourceType] -= cost;
    });

    this.pending[type] += 1;

    str += `to make ${NAMES[type]}-collecting robot.`;
    console.log(str);

    return true;
  }

  gather() {
    this.resources[ORE] += this.robots[ORE];
    this.resources[CLAY] += this.robots[CLAY];
    this.resources[OBS] += this.robots[OBS];
    this.resources[GEODE] += this.robots[GEODE];

    console.log(`Collect ${this.robots[ORE]} ${NAMES[ORE]}; you now have ${this.resources[ORE]} ${NAMES[ORE]}.`);
    if (this.robots[CLAY]) console.log(`Collect ${this.robots[CLAY]} ${NAMES[CLAY]}; you now have ${this.resources[CLAY]} ${NAMES[CLAY]}.`);
    if (this.robots[OBS]) console.log(`Collect ${this.robots[OBS]} ${NAMES[OBS]}; you now have ${this.resources[OBS]} ${NAMES[OBS]}.`);
    if (this.robots[GEODE]) console.log(`Collect ${this.robots[GEODE]} ${NAMES[GEODE]}; you now have ${this.resources[GEODE]} ${NAMES[GEODE]}.`);
  }

  step() {
    if (this.time <= 0) return false;

    console.log(`\n== Minute ${1 + TIME - this.time} ==`);
    const onlyGeodes = this.projectedGeodesWithBuildingOnlyGeodes(cloneObj(this.robots), cloneObj(this.resources));
    const geodesAndObs = this.projectedGeodesWithBuildingGeodesAndObs(cloneObj(this.robots), cloneObj(this.resources));
    const buildClay = this.projectedGeodesWithBuildingClay(cloneObj(this.robots), cloneObj(this.resources));
    const buildAll = this.projectedGeodesWithBuildingAll(cloneObj(this.robots), cloneObj(this.resources));
    console.log(`projected naive geodes would be ${onlyGeodes}`);
    console.log(`projected buildObs geodes would be ${geodesAndObs}`);
    console.log(`projected buildClay geodes would be ${buildClay}`);
    console.log(`projected buildall geodes would be ${buildAll}`);
    // console.log(`priority would be ${NAMES[this.getPriority()]}`)

    while (this.make(GEODE)) {}
    while (this.make(OBS)) {}

    // console.log(`priority actually is ${NAMES[this.getPriority()]}`)
    while (this.make(this.getPriority(this.robots))) {}
    this.gather();
    for (const type of TYPES) {
      if (this.pending[type]) {
        this.robots[type] += this.pending[type];
        console.log(`The ${NAMES[type]}-collecting robot is ready; you now have ${this.robots[type]}.`)
        this.pending[type] = 0;
      }
    }
    this.time--;

    return true;
  }

  projectedGeodesWithBuildingOnlyGeodes(robots, resources, time) {
    if (time <= 0) return [resources[GEODE], []];
    if (time === 1) return [resources[GEODE] + robots[GEODE], []];
    if (time === 2) {
      // const history = [];
      let geodes = resources[GEODE] + 2 * robots[GEODE];
      if (this._canMake(GEODE, resources)) {
        geodes++;
        // history.push(`building geode at minute ${1 + TIME - time}`);
      }
      return geodes;
      // return [geodes, history];
    }
    // console.log(`\n== Minute ${1 + TIME - time} ==`);
    // console.log(`${resources[ORE]} ore -- ${resources[CLAY]} clay -- ${resources[OBS]} obs -- ${resources[GEODE]} geode`)
    // const history = [];
    for (let i = time; i > 0; i--) {
      const buildGeode = this._canMake(GEODE, resources);
      if (buildGeode) {
        // history.push(`building geode at minute ${1 + TIME - i}`);
        resources[ORE] -= this.costs[GEODE][ORE];
        resources[OBS] -= this.costs[GEODE][OBS];
      }
      resources[GEODE] += robots[GEODE];
      resources[OBS] += robots[OBS];
      resources[CLAY] += robots[CLAY];
      resources[ORE] += robots[ORE];
      if (buildGeode) robots[GEODE]++;
    }

    return resources[GEODE];
    // return [resources[GEODE], history];
  }

  projectedGeodesWithBuildingGeodesAndObs(robots, resources, time) {
    if (time <= 0) return [resources[GEODE], []];
    if (time === 1) return [resources[GEODE] + robots[GEODE], []];
    if (time === 2) {
      // const history = [];
      let geodes = resources[GEODE] + 2 * robots[GEODE];
      if (this._canMake(GEODE, resources)) {
        geodes++;
        // history.push(`building geode at minute ${1 + TIME - time}`);
      }
      return geodes;
      // return [geodes, history];
    }
    const history = []

    let buildGeode = false;
    let buildObs = false;

    if (this._canMake(GEODE, resources)) {
      buildGeode = true;
      // history.push(`building geode at minute ${1 + TIME - time}`);
      resources[ORE] -= this.costs[GEODE][ORE];
      resources[OBS] -= this.costs[GEODE][OBS];
    } else if (this._canMake(OBS, resources)) {
      buildObs = true;
      // history.push(`building obs at minute ${1 + TIME - time}`);
      resources[ORE] -= this.costs[OBS][ORE];
      resources[CLAY] -= this.costs[OBS][CLAY];
    }
    resources[GEODE] += robots[GEODE];
    resources[OBS] += robots[OBS];
    resources[CLAY] += robots[CLAY];
    resources[ORE] += robots[ORE];
    if (buildGeode) robots[GEODE]++;
    if (buildObs) robots[OBS]++;

    return this.projectedGeodesWithBuildingGeodesAndObs(cloneObj(robots), cloneObj(resources), time - 1);
    // return [geodes, [...history, ...subhistory]];
  }

  _canMake(type, resources) {
    return Object.keys(this.costs[type]).every(resourceType => resources[resourceType] >= this.costs[type][resourceType]);
  }

  projectedGeodesWithBuildingClay(robots, resources, time) {
    if (time <= 0) return [resources[GEODE], []];
    if (time === 1) return [resources[GEODE] + robots[GEODE], []];
    if (time === 2) {
      // const history = [];
      let geodes = resources[GEODE] + 2 * robots[GEODE];
      if (this._canMake(GEODE, resources)) {
        geodes++;
        // history.push(`building geode at minute ${1 + TIME - time}`);
      }
      return geodes;
      // return [geodes, history];
    }
    const history = [];

    let buildGeode = false;
    let buildObs = false;
    let buildClay = false;
    if (this._canMake(GEODE, resources)) {
      buildGeode = true;
      // history.push(`building geode at minute ${1 + TIME - time}`);
      resources[ORE] -= this.costs[GEODE][ORE];
      resources[OBS] -= this.costs[GEODE][OBS];
    } else if (this._canMake(OBS, resources)) {
      buildObs = true;
      // history.push(`building obs at minute ${1 + TIME - time}`);
      resources[ORE] -= this.costs[OBS][ORE];
      resources[CLAY] -= this.costs[OBS][CLAY];
    } else if (this._canMake(CLAY, resources)) {
      buildClay = true;
      // history.push(`building clay at minute ${1 + TIME - time}`);
      resources[ORE] -= this.costs[CLAY][ORE];
    }
    resources[GEODE] += robots[GEODE];
    resources[OBS] += robots[OBS];
    resources[CLAY] += robots[CLAY];
    resources[ORE] += robots[ORE];
    if (buildGeode) robots[GEODE]++;
    if (buildObs) robots[OBS]++;
    if (buildClay) robots[CLAY]++;

    return this.projectedGeodesWithBuildingAll(cloneObj(robots), cloneObj(resources), time - 1);
    // return [geodes, [...history, ...subhistory]];
  }

  projectedGeodesWithBuildingOre(robots, resources, time) {
    if (time <= 0) return [resources[GEODE], []];
    if (time === 1) return [resources[GEODE] + robots[GEODE], []];
    if (time === 2) {
      // const history = [];
      let geodes = resources[GEODE] + 2 * robots[GEODE];
      if (this._canMake(GEODE, resources)) {
        geodes++;
        // history.push(`building geode at minute ${1 + TIME - time}`);
      }
      return geodes;
    }

    // const history = [];

    let buildGeode = false;
    let buildObs = false;
    let buildOre = false;

    if (this._canMake(GEODE, resources)) {
      buildGeode = true;
      // history.push(`building geode at minute ${1 + TIME - time}`);
      resources[ORE] -= this.costs[GEODE][ORE];
      resources[OBS] -= this.costs[GEODE][OBS];
    } else if (this._canMake(OBS, resources)) {
      buildObs = true;
      // history.push(`building obs at minute ${1 + TIME - time}`);
      resources[ORE] -= this.costs[OBS][ORE];
      resources[CLAY] -= this.costs[OBS][CLAY];
    } else if (this._canMake(ORE, resources)) {
      buildOre = true;
      // history.push(`building ore at minute ${1 + TIME - time}`);
      resources[ORE] -= this.costs[ORE][ORE];
    }
    resources[GEODE] += robots[GEODE];
    resources[OBS] += robots[OBS];
    resources[CLAY] += robots[CLAY];
    resources[ORE] += robots[ORE];
    if (buildGeode) robots[GEODE]++;
    if (buildObs) robots[OBS]++;
    if (buildOre) robots[ORE]++;

    return this.projectedGeodesWithBuildingAll(cloneObj(robots), cloneObj(resources), time - 1);
    // return [geodes, [...history, ...subhistory]];
  }

  projectedGeodesHelper(robots, resources, time) {
    if (time <= 0) return [resources[GEODE], []];
    if (time === 1) return [resources[GEODE] + robots[GEODE], []];
    if (time === 2) {
      // const history = [];
      let geodes = resources[GEODE] + 2 * robots[GEODE];
      if (this._canMake(GEODE, resources)) {
        geodes++;
        // history.push(`building geode at minute ${1 + TIME - time}`);
      }
      return geodes;
      // return [geodes, history];
    }

    let buildGeode = false;

    if (this._canMake(GEODE, resources)) {
      buildGeode = true;
      // history.push(`building geode at minute ${1 + TIME - time}`);
      resources[ORE] -= this.costs[GEODE][ORE];
      resources[OBS] -= this.costs[GEODE][OBS];
    }

    resources[GEODE] += robots[GEODE];
    resources[OBS] += robots[OBS];
    resources[CLAY] += robots[CLAY];
    resources[ORE] += robots[ORE];
    if (buildGeode) robots[GEODE]++;
    return this.projectedGeodesWithBuildingAll(cloneObj(robots), cloneObj(resources), time - 1);
  }

  projectedGeodesWithBuildingAll(robots, resources, time) {
    if (time <= 0) return [resources[GEODE], []];
    if (time === 1) return [resources[GEODE] + robots[GEODE], []];
    if (time === 2) {
      // const history = [];
      let geodes = resources[GEODE] + 2 * robots[GEODE];
      if (this._canMake(GEODE, resources)) {
        geodes++;
        // history.push(`building geode at minute ${1 + TIME - time}`);
      }
      return geodes;
      // return [geodes, history];
    }

    // const justGeodes = this.projectedGeodesWithBuildingOnlyGeodes(cloneObj(robots), cloneObj(resources), time);
    const justGeodes = this.projectedGeodesHelper(cloneObj(robots), cloneObj(resources), time);
    const geodesAndObs = this.projectedGeodesWithBuildingGeodesAndObs(cloneObj(robots), cloneObj(resources), time);
    const withOre = this._canMake(ORE, resources) ? this.projectedGeodesWithBuildingOre(cloneObj(robots), cloneObj(resources), time) : 0;
    const withClay = this._canMake(CLAY, resources) ? this.projectedGeodesWithBuildingClay(cloneObj(robots), cloneObj(resources), time) : 0;

    return max([justGeodes, geodesAndObs, withOre, withClay]);
  }

  getPriority(robots) {
    // ore / obs
    const geodeIdealRatio = this.costs[GEODE][ORE] / this.costs[GEODE][OBS];
    const geodeActualRatio = robots[ORE] / robots[OBS];

    if (geodeIdealRatio > geodeActualRatio) return ORE;

    // ore / clay
    const obsIdealRatio = (this.costs[GEODE][ORE] + this.costs[OBS][ORE]) / this.costs[OBS][CLAY];
    const obsActualRatio = robots[ORE] / robots[CLAY];

    if (obsIdealRatio > obsActualRatio) return ORE;

    return CLAY;
  }

  getMostGeodes() {
    return this.projectedGeodesWithBuildingAll(cloneObj(this.robots), cloneObj(this.resources), this.time);
    // while (this.step()) {}

    // return this.resources[GEODE];
  }
}

export default async function dayNineteen() {
  const blueprints = (await getLines(URL)).map(ints);

  const evaluators = blueprints.map(b => new BlueprintEvaluator(b, TIME));
  const answers = [];

  for (let i = 0; i < evaluators.length; ++i) {
    const x = evaluators[i];
    console.log(x.id);
    const answer = x.getMostGeodes();
    console.log(answer);
    answers.push([x.id, answer]);
  }

  console.log(answers);
  console.log(answers.reduce((acc, cur) => acc + cur[0] * cur[1]), 0);
}
