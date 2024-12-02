import { getLines, ints, makeMatrix, cloneMatrix, cloneObj, filterMap, rangeUnion, has, max, min, minmax, findLastIndex } from '../../../utils.js';

const URL = './inputs/5.txt';

const convertSourceToDestination = (source, mapping) => {
  for (const [destStart, sourceStart, length] of mapping) {
    if (sourceStart <= source && source < sourceStart + length) {
      const distance = source - sourceStart;

      return destStart + distance;
    }
  }

  console.log(source);

  return source;
}

export async function dayFive() {
  const lines = await getLines(URL);

  const seedRanges = ints(lines[0]);
  const seed2soil = lines.slice(3, 20).map(ints);
  const soil2fertilizer = lines.slice(22, 53).map(ints);
  const fertilizer2water = lines.slice(55, 94).map(ints);
  const water2light = lines.slice(96, 113).map(ints);
  const light2temp = lines.slice(115, 134).map(ints);
  const temp2humidity = lines.slice(136, 166).map(ints);
  const humidity2location = lines.slice(168, 206).map(ints);

  const groups = [seed2soil, soil2fertilizer, fertilizer2water, water2light, light2temp, temp2humidity, humidity2location];

  const optimizeRange = (start, length, map) => {
    const results = [];

    let current = start;

    while (current < start + length) {
      let thing = false;

      for (const [destStart, sourceStart, mapLength] of map) {
        if (sourceStart <= current && current < sourceStart + mapLength) {
          const distance = current - sourceStart;
          const newStart = destStart + distance;
          results.push(newStart);
          // Now determine whether to go to the end of the map or the end of the range

          const distanceToEndOfMap = mapLength - distance;
          const distanceToEndOfRange = (start + length) - current;
          const distanceToEnd = Math.min(distanceToEndOfMap, distanceToEndOfRange);
          results.push(distanceToEnd);
          current += distanceToEnd;

          thing = true;
          break;
        }
      }

      if (thing) continue;

      const sourceStarts = map.map(([_destStart, sourceStart, _length]) => sourceStart).sort((a, b) => a - b);

      const nextSourceStart = sourceStarts.find(sourceStart => sourceStart > current);

      results.push(current);
      const distance = nextSourceStart - current;
      const distanceToEndOfRange = (start + length) - current;
      const distanceToEnd = Math.min(distance, distanceToEndOfRange);
      const next = Math.min(nextSourceStart, start + length)
      results.push(distanceToEnd);
      current = next;
    }

    return results;
  }

  const thinger = (prevResults, map) => {
    const results = [];

    for (let i = 0; i < prevResults.length; i += 2) {
      const start = prevResults[i];
      const length = prevResults[i + 1];

      results.push(...optimizeRange(start, length, map));
    }

    return results;
  }

  let lowest = Infinity;

  for (let i = 0; i < seedRanges.length; i += 2) {
    const start = seedRanges[i];
    const length = seedRanges[i + 1];

    const results = groups.reduce((acc, cur) => thinger(acc, cur), [start, length]);

    for (let j = 0; j < results.length; j += 2) {
      if (results[j] < lowest) {
        lowest = results[j];
        console.log(lowest);
      }
    }
  }

  // 215294
  // 19239305
  // 21399250
  // 1287215595
  // REAL ANSWER IS:
  // 60294664
  // for (let i = 0; i < seedRanges.length; i += 2)

  //   for (let j = seedRanges[i]; j < seedRanges[i] + seedRanges[i + 1]; j++) {
  //     const ans = groups.reduce((acc, cur) => convertSourceToDestination(acc, cur), j);
  //     if (ans < min) min = ans;
  //   }
  //   console.log(`done with seed ${i}`);
  // }

  // console.log(min);

  // const locations = seeds.map(seed => groups.reduce((acc, cur) => convertSourceToDestination(acc, cur), seed));
  // const locations = [];

  // for (const seed of seeds) {
  //   let cur = seed;
  //   for (const group of groups) {
  //     cur = convertSourceToDestination(cur, group);
  //     console.log(cur);
  //   }
  //   locations.push(cur);
  // }


  // console.log(min(locations))
}

export default dayFive;
