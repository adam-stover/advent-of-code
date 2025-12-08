import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/7.txt';
// URL = './inputs/t.txt';

const START = 'S';
const AIR = '.';
const SPLITTER = '^';
const BEAM = '|';

class StateMachine {
  constructor(map) {
    this.map = [];
    this.height = map.length;
    this.width = map[0].length;
    this.splitters = new Set();
    this.splits = 0;
    this.timelines = 0;

    for (let i = 0; i < this.height; i++) {
      const row = [];
      for (let j = 0; j < this.width; j++) {
        row.push(map[i][j]);
        if (map[i][j] === START) this.start = StateMachine.key(i, j)
        else if (map[i][j] === SPLITTER) this.splitters.add(StateMachine.key(i, j))
      }
      this.map.push(row);
    }

    this.activeBeams = [this.start];
    this.beams = [[this.start, 1]]; // for part 2
  }

  static key(y, x) {
    return `${y}-${x}`;
  }

  tick1() {
    const nextActiveBeams = [];
    for (let i = 0; i < this.activeBeams.length; i++) {
      const [y, x] = this.activeBeams[i].split('-').map(Number);
      // this.map[y][x] = BEAM;
      if (y === this.width - 1 || this.map[y + 1][x] === BEAM) continue;
      if (this.map[y + 1][x] === AIR) {
        nextActiveBeams.push(StateMachine.key(y + 1, x));
        this.map[y + 1][x] = BEAM;
        continue;
      }

      let split = false;
      if (x !== 0 && this.map[y + 1][x - 1] === AIR) {
        nextActiveBeams.push(StateMachine.key(y + 1, x - 1));
        this.map[y + 1][x - 1] = BEAM;
        split = true;
      }
      if (x !== this.width - 1 && this.map[y + 1][x + 1] === AIR) {
        nextActiveBeams.push(StateMachine.key(y + 1, x + 1))
        this.map[y + 1][x + 1] = BEAM;
        split = true;
      }

      if (split) {
        this.splits++;
        // log(this.map[y + 1][x]);
      }
    }
    this.activeBeams = nextActiveBeams;
    return Boolean(this.activeBeams.length);
  }

  tick() {
    const nextBeams = {};

    for (let i = 0; i < this.beams.length; i++) {
      const [coords, count] = this.beams[i];
      const [y, x] = coords.split('-').map(Number);
      if (y === this.width - 1) {
        this.timelines += count;
      } else if (this.map[y + 1][x] === AIR) {
        const key = StateMachine.key(y + 1, x);
        if (has(nextBeams, key)) nextBeams[key] += count;
        else nextBeams[key] = count;
      } else {
        const left = StateMachine.key(y + 1, x - 1);
        const right = StateMachine.key(y + 1, x + 1);
        if (has(nextBeams, left)) nextBeams[left] += count;
        else nextBeams[left] = count;
        if (has(nextBeams, right)) nextBeams[right] += count;
        else nextBeams[right] = count;
      }
    }

    this.beams = Object.keys(nextBeams).map(k => [k, nextBeams[k]]);
    return Boolean(this.beams.length);
  }
}

export async function run() {
  const lines = await getLines(URL);

  const machine = new StateMachine(lines);
  
  while (machine.tick()) {
    // log(machine.timelines);
  }

  log(machine.splits);
  log(machine.timelines);
}

export default run;
