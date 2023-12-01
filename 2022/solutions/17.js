import { getLines, has } from '../utils.js';

const URL = './inputs/17.txt';
const ROCK = '#';
const AIR = '.';
const TARGET = 1000000000000;
const WIDTH = 7;
const SHAPES = [
  [
    [ROCK, ROCK, ROCK, ROCK]
  ],
  [
    [AIR, ROCK, AIR],
    [ROCK, ROCK, ROCK],
    [AIR, ROCK, AIR],
  ],
  [
    [AIR, AIR, ROCK],
    [AIR, AIR, ROCK],
    [ROCK, ROCK, ROCK],
  ],
  [
    [ROCK],
    [ROCK],
    [ROCK],
    [ROCK],
  ],
  [
    [ROCK, ROCK],
    [ROCK, ROCK],
  ],
];

class Rock {
  constructor(shape) {
    this.shape = shape;
    this.height = shape.length;
    this.width = shape[0].length;
  }
}

class Tetris {
  constructor(width, shapes, jets) {
    this.cache = {};
    this.rockCount = 0;
    this.width = width;
    this.jets = jets;
    this.rockIndex = 0;
    this.jetIndex = 0;
    this.grid = [this.makeRow(ROCK)];
    this.height = 0;
    this.rocks = shapes.map(shape => new Rock(shape));
  }

  makeRow(fill = AIR) {
    const row = [];
    for (let i = 0; i < this.width; ++i) {
      row.push(fill);
    }
    return row;
  }

  nextRock() {
    const rock = this.rocks[this.rockIndex];
    this.rockIndex = (this.rockIndex + 1) % this.rocks.length;
    return rock;
  }

  nextJet() {
    const jet = this.jets[this.jetIndex];
    this.jetIndex = (this.jetIndex + 1) % this.jets.length;
    return jet;
  }

  insertRock(rock, left, bottom) {
    for (let i = bottom; i < bottom + rock.height; ++i) {
      const rockIndex = rock.height - (i - bottom) - 1;
      while (i >= this.grid.length) {
        this.grid.push(this.makeRow());
        this.height++;
      }

      for (let j = 0; j < rock.width; ++j) {
        if (rock.shape[rockIndex][j] === ROCK) this.grid[i][left + j] = ROCK;
      }
    }

    for (let i = this.grid.length - 1; i >= bottom; --i) {
      if (this.grid[i].every(cell => cell === ROCK)) {
        this.grid = this.grid.slice(i);
        break;
      }
    }

    this.rockCount++;
  }

  rockCollision(rock, left, bottom) {
    for (
      let gridIndex = bottom, rockIndex = rock.height - 1;
      gridIndex < this.grid.length && rockIndex >= 0;
      ++gridIndex, --rockIndex
     ) {
      for (let i = 0; i < rock.width; ++i) {
        if (rock.shape[rockIndex][i] === ROCK && this.grid[gridIndex][i + left] === ROCK) {
          return true;
        }
      }
    }

    return false;
  }

  detectPattern() {
    const len = 1000;
    if (this.rockCount <= len) return;

    const key = `${this.rockIndex}_${this.jetIndex}_${this.grid.slice(-len).reduce((acc, cur) => acc + cur.join(''), '')}`;

    if (!has(this.cache, key)) {
      this.cache[key] = this.rockCount;
    } else {
      console.log(`Found repeat after ${this.rockCount} rocks!`);
      return key;
    }
  }

  drop() {
    const rock = this.nextRock();

    let left = 2;
    let bottom = this.grid.length + 3;

    while (!this.rockCollision(rock, left, bottom)) {
      const jet = this.nextJet();

      if (jet === '<') {
        if (left > 0 && !this.rockCollision(rock, left - 1, bottom)) {
          left -= 1;
        }
      } else if (jet === '>') {
        if (left + rock.width < this.width && !this.rockCollision(rock, left + 1, bottom)) {
          left += 1;
        }
      }

      bottom -= 1;
    }

    this.insertRock(rock, left, bottom + 1);
  }

  printGrid() {
    for (let i = this.height; i > 0; --i) {
      console.log(`|${this.grid[i].join('')}| -- ${i}`);
    }
  }
}

export default async function daySeventeen() {
  const jets = (await getLines(URL))[0];

  const tetris = new Tetris(WIDTH, SHAPES, jets);
  const heights = [0];

  for (let i = 0; i < TARGET; ++i) {
    tetris.drop();
    heights.push(tetris.height);
    const key = tetris.detectPattern();
    if (key) {
      const patternStart = tetris.cache[key];
      const startHeight = heights[patternStart];
      const patternLen = tetris.rockCount - patternStart;
      const heightDiff = tetris.height - startHeight;
      const numRepeats = Math.floor((TARGET - patternStart) / patternLen);
      // why tf does this work?
      const prevIndex = TARGET - patternLen * numRepeats;
      const prevHeight = heights[prevIndex];
      const comboHeight = numRepeats * heightDiff;
      const height = prevHeight + comboHeight;
      console.log(height);
      break;
    }
  }
}
