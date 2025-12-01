import { getLines, ints, filterMap, has, max, min, copyExcept, makeMatrix, log } from '../utils.js';

let URL = './inputs/8.txt';
// URL = './inputs/t.txt';

const AIR = '.';

export async function run() {
  const lines = await getLines(URL);
  const iLen = lines.length;
  const jLen = lines[0].length;

  const antennas = {};

  for (let i = 0; i < iLen; i++) {
    for (let j = 0; j < jLen; j++) {
      if (lines[i][j] !== AIR) {
        const symbol = lines[i][j];
        if (!has(antennas, symbol)) {
          antennas[symbol] = [];
        }

        antennas[symbol].push(`${i}-${j}`);
      }
    }
  }

  const symbols = Object.keys(antennas);

  // const antinodes = {};

  // for (const symbol of symbols) {
  //   antinodes[symbol] = new Set();
  // }

  const antinodeSet = new Set();

  // ok we have all the antennas
  // now we draw lines between every pair of same-frequency antennas

  const handlePair = (a, b) => {
    log(`handling ${a} and ${b}`)
    const [i, j] = ints(a);
    const [k, l] = ints(b);

    const yGap = k - i;
    const xGap = l - j;

    // const yDir = yGap >= 0;
    // const xDir = xGap >= 0;

    // const absYGap = Math.abs(yGap);
    // const absXGap = Math.abs(xGap);

    let firstAntinodeY = i - yGap;
    let firstAntinodeX = j - xGap;
    let secondAntinodeY = k + yGap;
    let secondAntinodeX = l + xGap;

    // const first = `${firstAntinodeY}-${firstAntinodeX}`;
    // const second = `${secondAntinodeY}-${secondAntinodeX}`;
    antinodeSet.add(a);
    antinodeSet.add(b);

    // log(`get antinodes ${first} and ${second}`)

    while (firstAntinodeY >= 0 && firstAntinodeY < iLen && firstAntinodeX >= 0 && firstAntinodeX < jLen) {
      const node = `${firstAntinodeY}-${firstAntinodeX}`;
      log(`${node} is valid`)
      antinodeSet.add(node);
      firstAntinodeY -= yGap;
      firstAntinodeX -= xGap;
    }

    while (secondAntinodeY >= 0 && secondAntinodeY < iLen && secondAntinodeX >= 0 && secondAntinodeX < jLen) {
      const node = `${secondAntinodeY}-${secondAntinodeX}`;
      // log(`${node} is valid`)
      antinodeSet.add(node);
      secondAntinodeY += yGap;
      secondAntinodeX += xGap;
    }
  }

  const handleSymbol = (symbol) => {
    const locations = antennas[symbol];
    for (let i = 0; i < locations.length - 1; i++) {
      for (let j = i + 1; j < locations.length; j++) {
        handlePair(locations[i], locations[j]);
      }
    }
  }

  for (const symbol of symbols) {
    handleSymbol(symbol);
  }

  let count = 0;

  // for (const symbol of symbols) {
  //   count += antinodes[symbol].size;
  //   if (antinodes[symbol].size) {
  //     log(symbol)
  //     log(antinodes[symbol])
  //   }
  // }

  // log(count);
  log(antinodeSet.size)

  // 832 is not right
}

export default run;
